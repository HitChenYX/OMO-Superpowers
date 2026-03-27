# OpenCode 平台插件系统性分析报告

## oh-my-openagent vs Superpowers 综合对比

---

## 1. 功能对比分析

### 1.1 核心功能对比

| 维度 | oh-my-openagent (OMO) | Superpowers | 相同点 | 差异点 |
|------|----------------------|-------------|--------|--------|
| **定位** | AI Agent Harness（智能体编排框架） | 软件开发工作流框架 | 均为AI编程辅助框架 | OMO侧重**多模型编排**；Superpowers侧重**流程控制** |
| **核心能力** | 多Agent并行、工具集成、技能系统 | TDD强制、流程门控、代码审查 | 均有**技能系统**概念 | OMO提供**内置Agent**；Superpowers提供**工作流模式** |
| **适用场景** | 复杂项目开发、多模型协作、工具集成 | 规范开发流程、强制执行最佳实践 | 适用于AI辅助编程 | OMO适合**大型/复杂项目**；Superpowers适合**流程规范化** |
| **架构复杂度** | 高（TypeScript + Bun + MCP） | 低（纯JS + Markdown技能） | 均为插件化架构 | OMO是**重型框架**；Superpowers是**轻量规则集** |

### 1.2 技术架构对比

| 特性 | OMO | Superpowers |
|------|-----|-------------|
| **开发语言** | TypeScript | JavaScript (ES Module) |
| **运行时** | Bun | Node.js (纯内置模块) |
| **依赖数量** | 多（@opencode-ai/plugin, MCP SDK等） | 零外部依赖 |
| **技能定义** | SKILL.md + TypeScript内置技能 | 纯 SKILL.md |
| **Agent系统** | 6+内置Agent（Sisyphus, Hephaestus等） | 1个代码审查Agent |
| **工具集成** | LSP、AST-grep、MCP、Playwright | 无（纯文本指令） |
| **跨平台** | OpenCode为主，部分兼容 | Claude Code、OpenCode、Codex、Cursor、Gemini CLI |

### 1.3 技能系统对比

**OMO技能系统**：
- **技能定义**：SKILL.md（YAML frontmatter + Markdown内容）
- **技能类型**：内置技能（TypeScript）+ 用户自定义（Markdown）
- **技能来源**：6层优先级（`.opencode/skills/` → `~/.claude/skills/`等）
- **MCP集成**：支持嵌入式MCP服务器配置
- **技能合并**：复杂合并逻辑（内置 → 配置 → 文件系统）

**Superpowers技能系统**：
- **技能定义**：SKILL.md（YAML frontmatter + Markdown内容）
- **技能类型**：纯Markdown技能（14个流程技能 + 1个元技能）
- **技能来源**：项目级 `.superpowers/skills/` 或全局安装
- **MCP集成**：无（纯文本指令）
- **技能合并**：简单路径注入

**相同点**：两者均采用 `SKILL.md` + YAML frontmatter 的规范格式，遵循 agentskills.io 标准。

**差异点**：
- OMO支持**内置技能**（TypeScript实现），Superpowers纯Markdown
- OMO支持**MCP工具集成**，Superpowers纯规则/流程
- OMO技能可通过 **skill_mcp** 工具调用，Superpowers通过 **Skill** 工具激活

---

## 2. 兼容性评估

### 2.1 代码结构兼容性

| 评估维度 | 兼容性 | 说明 |
|----------|--------|------|
| **技能文件格式** | ✅ **完全兼容** | 两者均使用 `SKILL.md` + YAML frontmatter |
| **技能命名规范** | ⚠️ **部分兼容** | OMO使用`kebab-case`；Superpowers也使用`kebab-case`，需避免命名冲突 |
| **目录结构** | ⚠️ **需适配** | Superpowers技能在`skills/`目录；OMO支持多来源，需配置路径 |
| **Agent模板** | ❌ **不兼容** | Superpowers的`agents/code-reviewer.md`需要转换 |

### 2.2 接口规范兼容性

| 评估维度 | 兼容性 | 说明 |
|----------|--------|------|
| **技能激活方式** | ✅ **兼容** | 两者均通过 `Skill` 工具激活（平台通用） |
| **技能描述字段** | ✅ **兼容** | 两者均使用`description`作为触发条件 |
| **跨技能引用** | ⚠️ **需适配** | Superpowers使用`superpowers:skill-name`语法；OMO使用`skill:name` |
| **输出格式** | ✅ **兼容** | Markdown + Graphviz 流程图两者均支持 |

### 2.3 依赖关系兼容性

| Superpowers技能 | 外部依赖 | OMO兼容性 | 风险等级 |
|-----------------|----------|-----------|----------|
| `brainstorming` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `using-git-worktrees` | Git CLI | ✅ 完全兼容 | 🟢 低风险 |
| `writing-plans` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `subagent-driven-development` | 子代理模板文件 | ⚠️ 需适配 | 🟡 中风险 |
| `executing-plans` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `dispatching-parallel-agents` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `test-driven-development` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `systematic-debugging` | 辅助脚本（shell） | ⚠️ 需适配 | 🟡 中风险 |
| `verification-before-completion` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `requesting-code-review` | 代码审查Agent | ⚠️ 需适配 | 🟡 中风险 |
| `receiving-code-review` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `finishing-a-development-branch` | Git CLI | ✅ 完全兼容 | 🟢 低风险 |
| `using-superpowers` | 无 | ✅ 完全兼容 | 🟢 低风险 |
| `writing-skills` | 无 | ✅ 完全兼容 | 🟢 低风险 |

### 2.4 技术风险分析

| 风险类型 | 风险描述 | 缓解措施 |
|----------|----------|----------|
| **命名冲突** | 两者均有`test-driven-development`等技能 | 使用前缀区分或合并逻辑 |
| **子代理不兼容** | Superpowers的子代理模板需要OMO的Agent系统支持 | 将模板转换为OMO Agent配置 |
| **平台行为差异** | Cursor/Claude Code与OpenCode的Skill工具行为可能不同 | 在OMO中测试验证 |
| **流程冲突** | OMO内置的`ralph-loop`与Superpowers的流程控制可能冲突 | 明确优先级或禁用冲突功能 |

---

## 3. 技能迁移推荐

### 3.1 推荐迁移的技能模块

基于兼容性评估，推荐按优先级迁移以下技能：

#### 🔴 **高优先级（立即迁移）**

| 技能名 | 推荐理由 | 预期价值 |
|--------|----------|----------|
| **`test-driven-development`** | 核心纪律技能，与OMO的代码生成能力互补，强制测试先行 | 🟢🟢🟢 高 - 提升代码质量 |
| **`systematic-debugging`** | OMO缺乏结构化调试流程，该技能填补空白 | 🟢🟢🟢 高 - 降低调试时间 |
| **`verification-before-completion`** | 与OMO的任务系统结合，强制执行验证 | 🟢🟢 中 - 减少返工 |

#### 🟡 **中优先级（建议迁移）**

| 技能名 | 推荐理由 | 预期价值 |
|--------|----------|----------|
| **`writing-plans`** | 与OMO的Prometheus规划Agent协同 | 🟢🟢 中 - 标准化规划流程 |
| **`subagent-driven-development`** | 与OMO的task()工具理念契合，增强子任务管理 | 🟢🟢 中 - 提升并行效率 |
| **`brainstorming`** | 在复杂需求前强制设计阶段，防止过早编码 | 🟢🟢 中 - 减少设计缺陷 |
| **`using-git-worktrees`** | 与OMO的git-master技能协同，增强分支管理 | 🟢🟢 中 - 改善工作流隔离 |

#### 🟢 **低优先级（可选迁移）**

| 技能名 | 推荐理由 | 预期价值 |
|--------|----------|----------|
| **`requesting-code-review`** | OMO已有代码生成能力，审查流程可后续补充 | 🟢 低 - 锦上添花 |
| **`executing-plans`** | OMO的task()已实现类似功能，功能重叠 | 🟢 低 - 重复功能 |
| **`dispatching-parallel-agents`** | OMO的background agent已支持并行 | 🟢 低 - 功能重叠 |

### 3.2 不推荐迁移的技能

| 技能名 | 不推荐理由 |
|--------|------------|
| **`using-superpowers`** | 这是Superpowers的入门引导，与OMO的初始化流程冲突 |
| **`writing-skills`** | OMO已有内置技能系统，该技能是元技能编写指南 |
| **`finishing-a-development-branch`** | OMO的git-master已覆盖大部分功能 |
| **`receiving-code-review`** | 依赖Superpowers的代码审查流程，与OMO集成度低 |

### 3.3 迁移潜在风险

| 风险项 | 风险描述 | 缓解措施 |
|--------|----------|----------|
| **流程冲突** | Superpowers的强制门控可能与OMO的Agent自主决策冲突 | 在技能描述中明确优先级，或修改门控逻辑 |
| **用户体验碎片化** | 同时使用两套流程可能让用户困惑 | 提供统一的"使用指南"技能，整合两套流程 |
| **维护成本** | 需要同步Superpowers上游更新 | 建立定期同步机制或Fork维护 |
| **命名空间污染** | 技能名称可能与其他技能冲突 | 使用`super-`前缀或合并重复技能 |

---

## 4. 迁移实施建议

### 4.1 迁移步骤

#### **Phase 1: 基础设施准备**（1-2天）

1. **创建迁移目录结构**
   ```bash
   mkdir -p .opencode/skills/superpowers-{test-driven-development,systematic-debugging,verification-before-completion}
   ```

2. **创建适配层文件**
   ```markdown
   <!-- .opencode/skills/superpowers-adapter/SKILL.md -->
   ---
   name: superpowers-adapter
   description: "适配Superpowers技能到OMO框架的转换层"
   ---
   
   ## 使用说明
   
   本技能用于桥接Superpowers的工作流与OMO的Agent系统...
   ```

#### **Phase 2: 技能迁移**（每技能2-4小时）

以`test-driven-development`为例的迁移步骤：

1. **复制原始技能文件**
   ```bash
   cp superpowers/skills/test-driven-development/SKILL.md \
      .opencode/skills/superpowers-test-driven-development/
   ```

2. **修改YAML Frontmatter**
   ```yaml
   ---
   name: superpowers-test-driven-development
   description: "OMO适配版：Use when implementing any feature or fixing any bug, BEFORE writing production code"
   # 可选：添加OMO特定的配置
   allowed-tools:
     - "Bash"
     - "Read"
     - "Write"
     - "skill"
   ---
   ```

3. **适配内容中的技能引用**
   - 将 `superpowers:writing-plans` 改为 `skill:writing-plans`
   - 将 `@skills/...` 引用改为OMO的路径格式

4. **添加OMO特定的集成说明**
   ```markdown
   ## OMO Integration
   
   When working with oh-my-openagent:
   - Use `task(category="quick", ...)` for test implementation
   - Run `lsp_diagnostics` after each change
   - Follow OMO's built-in TDD discipline
   ```

#### **Phase 3: Agent模板迁移**（针对`subagent-driven-development`）

将Superpowers的子代理模板转换为OMO Agent配置：

**原Superpowers模板**：
```markdown
<!-- subagent-driven-development/implementer-prompt.md -->
You are an Implementer Subagent...
```

**OMO适配版**：
```typescript
// .opencode/agents/implementer.ts
export const implementerAgent = {
  name: "superpowers-implementer",
  model: "anthropic/claude-sonnet-4",
  systemPrompt: `
    You are an Implementer Subagent...
    // 原模板内容
  `,
  tools: ["Bash", "Read", "Write", "skill"]
}
```

#### **Phase 4: 集成配置**（半天）

在`.opencode/config.json`中配置迁移的技能：

```jsonc
{
  "oh-my-opencode": {
    "skills": {
      "sources": [
        { "path": "./.opencode/skills", "recursive": true }
      ],
      "enable": [
        "superpowers-test-driven-development",
        "superpowers-systematic-debugging",
        "superpowers-verification-before-completion"
      ]
    },
    // 可选：调整Agent配置以适配Superpowers流程
    "agents": {
      "sisyphus": {
        "systemPrompt": "You are Sisyphus with Superpowers discipline..."
      }
    }
  }
}
```

### 4.2 集成方法

#### **方法A: 独立技能模式（推荐）**

保持Superpowers技能独立，通过`skill`工具显式调用：

```
User: @skill:superpowers-test-driven-development
```

**优点**：
- 清晰区分两套系统
- 便于维护和更新
- 用户可自主选择

**缺点**：
- 需要显式调用，不够自动化

#### **方法B: 混合Agent模式**

创建融合Superpowers纪律的OMO Agent：

```typescript
// .opencode/agents/sisyphus-super.ts
export const sisyphusSuperAgent = {
  name: "sisyphus-super",
  description: "Sisyphus with Superpowers discipline",
  systemPrompt: `
    ${loadSisyphusPrompt()}
    
    ## Superpowers Discipline
    
    You MUST follow these Superpowers skills:
    - test-driven-development: NO CODE WITHOUT FAILING TEST FIRST
    - systematic-debugging: Follow 4-phase debugging
    - verification-before-completion: ALWAYS verify before claiming done
    
    When activated, load the corresponding skill content...
  `
}
```

**优点**：
- 自动化应用纪律
- 无缝用户体验

**缺点**：
- 修改量大
- 需要维护融合的Agent配置

#### **方法C: Hook注入模式**

使用OMO的Hook系统在会话启动时注入Superpowers规则：

```typescript
// 在OMO插件配置中
createHooks({
  'chat.message': async (message) => {
    if (shouldApplySuperpowers(message)) {
      injectSkillContent('superpowers-test-driven-development')
    }
  }
})
```

### 4.3 测试验证方案

#### **单元测试（每技能）**

为每个迁移的技能创建测试用例：

```typescript
// tests/skills/superpowers-tdd.test.ts
describe('superpowers-test-driven-development', () => {
  it('should reject code without failing test', async () => {
    const result = await agent.execute(`
      Write a function add(a, b) { return a + b }
    `)
    expect(result).toContain('NO PRODUCTION CODE WITHOUT FAILING TEST')
  })
  
  it('should accept code with test-first approach', async () => {
    const result = await agent.execute(`
      First write test for add(a, b)
      Then implement the function
    `)
    expect(result).toContain('RED-GREEN-REFACTOR')
  })
})
```

#### **集成测试（工作流）**

测试完整的Superpowers + OMO工作流：

```typescript
// tests/integration/superpowers-omo-flow.test.ts
describe('Superpowers + OMO Integration', () => {
  it('should complete TDD cycle with OMO tools', async () => {
    // 1. 激活brainstorming
    // 2. 通过Prometheus制定计划
    // 3. 使用task()执行，强制TDD
    // 4. 验证完成
  })
})
```

#### **手动验证清单**

- [ ] 技能可通过`skill`工具正确加载
- [ ] 技能内容与原始Superpowers一致
- [ ] Graphviz流程图正确渲染
- [ ] 跨技能引用正确解析
- [ ] 与OMO内置工具（task, lsp_diagnostics）协同工作
- [ ] 无明显流程冲突

---

## 5. 总结与建议

### 5.1 核心结论

| 维度 | 评估结果 |
|------|----------|
| **技术兼容性** | ⭐⭐⭐⭐ 高 - 两者技能格式一致，迁移成本低 |
| **功能互补性** | ⭐⭐⭐⭐⭐ 极高 - OMO缺流程控制，Superpowers缺工具集成 |
| **迁移可行性** | ⭐⭐⭐⭐ 高 - 14个技能中10个可直接迁移 |
| **长期价值** | ⭐⭐⭐⭐ 高 - 填补OMO在开发纪律方面的空白 |

### 5.2 推荐策略

**短期（1-2周）**：
1. 迁移`test-driven-development`、`systematic-debugging`、`verification-before-completion`三个核心纪律技能
2. 创建统一的`superpowers-adapter`技能说明使用方式
3. 在试点项目中验证

**中期（1个月）**：
1. 根据反馈调整技能内容，适配OMO特定场景
2. 迁移`writing-plans`、`brainstorming`等流程技能
3. 开发融合Agent（`sisyphus-super`）

**长期（可选）**：
1. 建立自动化同步机制，跟踪Superpowers上游更新
2. 将Superpowers的纪律机制深度集成到OMO核心Agent中
3. 贡献回Superpowers社区，推动标准化

### 5.3 风险缓解总结

| 风险 | 缓解策略 |
|------|----------|
| 流程冲突 | 明确定义触发条件和优先级，避免双重门控 |
| 用户体验碎片化 | 提供统一入口技能，隐藏底层差异 |
| 维护成本 | 建立自动化测试和同步机制 |
| 命名冲突 | 使用`super-`前缀，逐步合并重复功能 |

---

**报告完成时间**: 2026-03-26  
**基于版本**: 
- oh-my-openagent: v3.11.0 (commit: b34eab3)
- Superpowers: v5.0.6 (commit: eafe962)
