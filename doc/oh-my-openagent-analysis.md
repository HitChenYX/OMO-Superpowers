# oh-my-openagent 项目技术分析报告

**Commit SHA**: `b34eab38841715e98d1ea659ff9dfa6f54d0a72e`  
**版本**: 3.11.0  
**项目地址**: https://github.com/code-yeongyu/oh-my-openagent

---

## 1. 项目概述

### 1.1 项目定位

**oh-my-openagent** 是一个 AI Agent Harness（智能体驾驭框架），基于 OpenCode 平台构建。它通过多模型编排、并行后台 Agent、LSP/AST 工具集成等方式，将 Claude Code、AmpCode 等 AI 编程工具的最佳实践整合到一个统一的插件系统中。

**核心价值主张**：让用户无需配置，直接使用 `ultrawork` 命令即可获得最佳 AI 编程体验。

### 1.2 核心功能

| 功能类别 | 具体能力 |
|---------|---------|
| **Discipline Agents** | Sisyphus（主编排器）、Hephaestus（深度执行）、Prometheus（战略规划）、Oracle（架构咨询）、Librarian（文档搜索）、Explore（快速探索）等 |
| **工具集成** | LSP 工具、AST-Grep、Hash-anchored Edit Tool、Tmux 集成 |
| **技能系统** | Skill-embedded MCPs、内置 Playwright、Git Master、Frontend-UI-UX 等技能 |
| **上下文管理** | 目录级 AGENTS.md 注入、会话压缩、Todo 强制执行 |
| **命令系统** | `/init-deep`、`/ralph-loop`、`/ulw-loop`、`/start-work` 等 |

---

## 2. 技术架构

### 2.1 项目目录结构

```
oh-my-openagent/
├── src/                          # 核心源代码
│   ├── index.ts                  # 插件入口点
│   ├── plugin-interface.ts        # 插件接口创建
│   ├── create-tools.ts           # 工具创建入口
│   ├── create-managers.ts        # 管理器创建
│   ├── create-hooks.ts           # Hook 系统创建
│   ├── config/                   # 配置 schema 定义
│   │   ├── schema.ts
│   │   └── schema/              # 各类配置 schema
│   ├── features/                 # 核心功能模块
│   │   ├── opencode-skill-loader/  # 技能加载器
│   │   ├── skill-mcp-manager/      # 技能 MCP 管理器
│   │   ├── builtin-skills/          # 内置技能
│   │   ├── background-agent/        # 后台 Agent
│   │   └── ...
│   ├── plugin/                   # 插件处理逻辑
│   │   ├── tool-registry.ts     # 工具注册表
│   │   ├── skill-context.ts     # 技能上下文
│   │   └── ...
│   ├── tools/                    # 工具定义
│   │   ├── skill/               # skill 工具
│   │   ├── skill-mcp/           # skill_mcp 工具
│   │   └── ...
│   ├── agents/                   # Agent 相关
│   ├── hooks/                   # Hook 系统
│   └── mcp/                     # MCP 协议处理
├── docs/                        # 文档
│   ├── guide/                   # 指南
│   ├── reference/               # 参考文档
│   └── examples/                # 示例
└── packages/                   # 平台特定二进制包
```

### 2.2 技术栈和依赖

**核心依赖**：
- `@opencode-ai/plugin` - OpenCode 插件接口
- `@opencode-ai/sdk` - OpenCode SDK
- `@modelcontextprotocol/sdk` - MCP 协议 SDK
- `@ast-grep/napi` - AST 语法分析工具
- `zod` - 配置验证
- `vscode-jsonrpc` - LSP 通信

**主要特性**：
- 使用 **Bun** 作为运行时和打包工具
- **TypeScript** 作为开发语言
- 支持 **JSONC** 配置文件（含注释的 JSON）

### 2.3 插件系统设计原理

**入口点** (`src/index.ts`):

```typescript
const OhMyOpenCodePlugin: Plugin = async (ctx) => {
  // 1. 初始化配置上下文
  initConfigContext("opencode", null)
  
  // 2. 加载插件配置
  const pluginConfig = loadPluginConfig(ctx.directory, ctx)
  
  // 3. 创建管理器（后台、TMUX、技能 MCP）
  const managers = createManagers({ ctx, pluginConfig, ... })
  
  // 4. 创建工具（skill、skill_mcp、lsp 等）
  const toolsResult = await createTools({ ctx, pluginConfig, managers })
  
  // 5. 创建 Hooks
  const hooks = createHooks({ ctx, pluginConfig, mergedSkills: toolsResult.mergedSkills, ... })
  
  // 6. 创建插件接口并返回
  return {
    name: "oh-my-openagent",
    tool: toolsResult.filteredTools,
    "chat.params": ...,
    "chat.message": ...,
    config: managers.configHandler,
    event: ...,
    ...
  }
}
```

**核心设计模式**：
1. **管理器模式** (`createManagers`) - 集中管理 BackgroundManager、SkillMcpManager、TmuxSessionManager 等
2. **工具注册表模式** (`createToolRegistry`) - 统一注册和过滤所有工具
3. **Hook 编排模式** - 通过 `createHooks` 创建各类 Hook 处理函数

---

## 3. 技能（Skills）系统设计

### 3.1 技能定义格式

技能通过 **SKILL.md** 文件定义，包含 YAML frontmatter 和模板内容：

```markdown
---
name: git-master
description: "MUST USE for ANY git operations..."
mcp:
  my-mcp-server:
    command: npx
    args: ["-y", "some-mcp-server"]
---

# Skill Instruction Content

<skill-instruction>
实际注入给 Agent 的指令内容...
</skill-instruction>
```

**关键字段**：

| 字段 | 类型 | 说明 |
|-----|------|-----|
| `name` | string | 技能名称 |
| `description` | string | 技能描述 |
| `template` | string | 技能指令模板 |
| `model` | string | 专用模型（可选）|
| `agent` | string | 限制使用的 Agent |
| `subtask` | boolean | 是否为子任务技能 |
| `allowed-tools` | string[] | 允许使用的工具白名单 |
| `mcp` | object | 嵌入式 MCP 服务器配置 |

### 3.2 技能加载机制

**技能加载流程** (`src/features/opencode-skill-loader/loader.ts`):

```typescript
export async function discoverAllSkills(directory?: string): Promise<LoadedSkill[]> {
  const [
    opencodeProjectSkills,    // .opencode/skills/ (项目级)
    opencodeGlobalSkills,     // ~/.config/opencode/skills/ (用户级)
    projectSkills,            // .claude/skills/ (项目级)
    userSkills,               // ~/.claude/skills/ (用户级)
    agentsProjectSkills,      // .agents/skills/ (项目级)
    agentsGlobalSkills,       // ~/.agents/skills/ (用户级)
  ] = await Promise.all([...])
  
  // 优先级: opencode-project > opencode > project > user
  return deduplicateSkillsByName([...])
}
```

**技能来源优先级**（从高到低）：
1. `.opencode/skills/*/SKILL.md` (项目级 OpenCode)
2. `~/.config/opencode/skills/*/SKILL.md` (用户级 OpenCode)
3. `.claude/skills/*/SKILL.md` (项目级 Claude Code 兼容)
4. `.agents/skills/*/SKILL.md` (项目级 Agents 约定)
5. `~/.claude/skills/` (用户级 Claude)
6. `~/.agents/skills/` (用户级 Agents)

### 3.3 技能合并逻辑

**mergeSkills 函数** (`src/features/opencode-skill-loader/merger.ts`):

```typescript
export function mergeSkills(
  builtinSkills: BuiltinSkill[],      // 内置技能
  config: SkillsConfig | undefined,   // 配置文件定义
  configSourceSkills: LoadedSkill[],  // 配置来源技能
  userClaudeSkills: LoadedSkill[],     // 用户 Claude 技能
  userOpencodeSkills: LoadedSkill[],   // 用户 OpenCode 技能
  projectClaudeSkills: LoadedSkill[],  // 项目 Claude 技能
  projectOpencodeSkills: LoadedSkill[], // 项目 OpenCode 技能
): LoadedSkill[] {
  // 1. 首先添加所有内置技能
  // 2. 应用配置文件中的技能定义
  // 3. 按优先级添加文件系统技能
  // 4. 处理禁用逻辑
}
```

### 3.4 内置技能示例

**playwright 技能** (`src/features/builtin-skills/skills/playwright.ts`):

```typescript
export const playwrightSkill: BuiltinSkill = {
  name: "playwright",
  description: "MUST USE for any browser-related tasks...",
  template: `# Playwright Browser Automation...`,
  mcpConfig: {
    playwright: {
      command: "npx",
      args: ["@playwright/mcp@latest"],
    },
  },
}
```

**git-master 技能** (`src/features/builtin-skills/skills/git-master.ts`):
- 包含 1100+ 行详细指令
- 三大模式：COMMIT、REBASE、HISTORY_SEARCH
- 自动风格检测（语义化/普通/简短）
- 强制多提交原则

### 3.5 技能工具实现

**skill 工具** (`src/tools/skill/tools.ts`):

```typescript
export function createSkillTool(options: SkillLoadOptions = {}): ToolDefinition {
  return tool({
    description: "Returns skill or command details...",
    args: {
      name: tool.schema.string().describe("The skill or command name"),
      user_message: tool.schema.string().optional(),
    },
    async execute(args: SkillArgs, ctx?: { agent?: string }) {
      // 1. 查找匹配的技能
      const matchedSkill = skills.find(s => s.name.toLowerCase() === requestedName.toLowerCase())
      
      // 2. 提取技能体（支持 lazy loading）
      let body = await extractSkillBody(matchedSkill)
      
      // 3. 如有 MCP 配置，格式化 MCP 能力
      if (options.mcpManager && matchedSkill.mcpConfig) {
        const mcpInfo = await formatMcpCapabilities(...)
        output.push(mcpInfo)
      }
      
      return output.join("\n")
    },
  })
}
```

---

## 4. API 设计

### 4.1 技能 MCP 管理器

**SkillMcpManager** (`src/features/skill-mcp-manager/manager.ts`):

```typescript
export class SkillMcpManager {
  // 核心方法
  async listTools(info, context): Promise<Tool[]>
  async listResources(info, context): Promise<Resource[]>
  async listPrompts(info, context): Promise<Prompt[]>
  async callTool(info, context, name, args): Promise<unknown>
  async readResource(info, context, uri): Promise<unknown>
  async getPrompt(info, context, name, args): Promise<unknown>
}
```

### 4.2 skill_mcp 工具

**使用方式** (`src/tools/skill-mcp/tools.ts`):

```typescript
skill_mcp(
  mcp_name: "server-name",           // MCP 服务器名称
  tool_name: "query",                // 要调用的工具
  arguments: '{"sql": "SELECT *"}',  // JSON 参数
  grep: "pattern"                    // 可选：过滤输出
)
```

### 4.3 配置和初始化方式

**配置 schema** (`src/config/schema/oh-my-opencode-config.ts`):

```typescript
export const OhMyOpenCodeConfigSchema = z.object({
  disabled_mcps: z.array(AnyMcpNameSchema).optional(),
  disabled_agents: z.array(z.string()).optional(),
  disabled_skills: z.array(BuiltinSkillNameSchema).optional(),
  disabled_hooks: z.array(z.string()).optional(),
  agents: AgentOverridesSchema.optional(),
  categories: CategoriesConfigSchema.optional(),
  skills: SkillsConfigSchema.optional(),
  // ... 更多配置
})
```

**技能配置** (`src/config/schema/skills.ts`):

```typescript
export const SkillsConfigSchema = z.union([
  z.array(z.string()),  // 简单技能名称列表
  z.object({
    sources: z.array(SkillSourceSchema).optional(),
    enable: z.array(z.string()).optional(),
    disable: z.array(z.string()).optional(),
  }).catchall(SkillEntrySchema),
])
```

---

## 5. 配置文件和示例

### 5.1 完整配置示例

```jsonc
{
  // 插件配置
  "oh-my-opencode": {
    // 禁用内置技能
    "disabled_skills": ["playwright"],
    
    // 技能配置
    "skills": {
      "sources": [
        { "path": "./custom-skills", "recursive": true }
      ],
      "enable": ["my-skill"],
      "disable": ["unused-skill"]
    },
    
    // Agent 覆盖配置
    "agents": {
      "sisyphus": {
        "model": "anthropic/claude-opus-4-6",
        "temperature": 0.7
      }
    },
    
    // 分类配置
    "categories": {
      "visual-engineering": {
        "model": "google/gemini-3.1-pro"
      }
    },
    
    // 浏览器自动化
    "browser_automation_engine": {
      "provider": "playwright"
    },
    
    // 实验性功能
    "experimental": {
      "task_system": false
    }
  }
}
```

### 5.2 自定义技能示例

**`.opencode/skills/my-skill/SKILL.md`**:

```markdown
---
name: my-skill
description: "My custom skill for XYZ operations"
mcp:
  xyz-server:
    command: "npx"
    args: ["-y", "xyz-mcp-server"]
allowed-tools:
  - "Bash"
  - "Read"
---

# My Skill

You are an expert in...

## Guidelines

1. First, analyze the request...
2. Then, execute...
```

### 5.3 内置技能列表

| 技能名 | 说明 | MCP 配置 |
|-------|------|---------|
| `playwright` | Playwright 浏览器自动化 | `npx @playwright/mcp@latest` |
| `agent-browser` | Vercel agent-browser CLI | `agent-browser` CLI |
| `playwright-cli` | Playwright CLI 模式 | Playwright CLI |
| `dev-browser` | 状态化浏览器脚本 | agent-browser |
| `frontend-ui-ux` | UI/UX 设计专家 | 无 |
| `git-master` | Git 专家（原子提交、变基、历史搜索）| 无 |

---

## 6. 核心流程图

### 6.1 插件初始化流程

```
OhMyOpenCodePlugin(ctx)
    │
    ├─> loadPluginConfig()        // 加载配置
    │
    ├─> createManagers()         // 创建管理器
    │   ├─> TmuxSessionManager
    │   ├─> BackgroundManager
    │   ├─> SkillMcpManager
    │   └─> ConfigHandler
    │
    ├─> createTools()            // 创建工具
    │   ├─> createSkillContext() // 创建技能上下文
    │   │   ├─> discoverAllSkills() // 发现所有技能
    │   │   └─> mergeSkills()    // 合并技能
    │   └─> createToolRegistry() // 注册工具
    │       ├─> skill tool
    │       ├─> skill_mcp tool
    │       ├─> task tool
    │       └─> ...其他工具
    │
    ├─> createHooks()            // 创建 Hooks
    │
    └─> createPluginInterface()  // 创建插件接口
```

### 6.2 技能调用流程

```
Agent 调用 skill(name="git-master")
    │
    └─> skill tool execute()
        │
        ├─> getAllSkills()       // 获取所有已加载技能
        │
        ├─> find matchedSkill   // 精确匹配技能名
        │
        ├─> extractSkillBody()  // 提取技能模板
        │   └─> 解析 <skill-instruction> 标签
        │
        ├─> injectGitMasterConfig() // 注入 git-master 特殊配置
        │
        └─> formatMcpCapabilities() // 如有 MCP，格式化 MCP 能力
            │
            └─> skill_mcp 工具可用
```

---

## 7. 关键代码引用

| 功能 | 文件 | 行号 |
|-----|------|-----|
| 插件入口 | `src/index.ts` | 20-112 |
| 技能工具 | `src/tools/skill/tools.ts` | 187-316 |
| 技能加载器 | `src/features/opencode-skill-loader/loader.ts` | 70-90 |
| 技能合并 | `src/features/opencode-skill-loader/merger.ts` | 14-95 |
| 技能上下文 | `src/plugin/skill-context.ts` | 50-132 |
| MCP 管理器 | `src/features/skill-mcp-manager/manager.ts` | 9-154 |
| 工具注册表 | `src/plugin/tool-registry.ts` | 42-159 |
| 配置 Schema | `src/config/schema/oh-my-opencode-config.ts` | 26-73 |

---

## 8. 总结

oh-my-openagent 是一个结构复杂但设计清晰的 AI Agent 框架，通过插件化架构、技能系统、MCP 集成等机制，实现了多模型编排和任务自动化的强大能力。

**核心优势**：
- 多模型并行编排能力
- 丰富的工具集成（LSP、AST-grep、MCP）
- 灵活的技能系统（内置 + 自定义）
- 强大的内置Agent（Sisyphus、Prometheus等）

**项目地址**: https://github.com/code-yeongyu/oh-my-openagent
