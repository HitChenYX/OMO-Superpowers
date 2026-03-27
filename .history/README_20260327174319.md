# OMO Superpowers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenCode](https://img.shields.io/badge/OpenCode-Compatible-blue)](https://opencode.ai)
[![Superpowers](https://img.shields.io/badge/Superpowers-v5.0.6-green)](https://github.com/obra/superpowers)

> 将 Superpowers 软件工程纪律集成到 OpenCode/OMO 平台的插件系统

## 项目概述

**OMO Superpowers** 是一个 OpenCode 插件项目，将 [Superpowers](https://github.com/obra/superpowers) 的严格软件工程纪律迁移到 OpenCode/Oh My OpenCode (OMO) 平台。

Superpowers 是一套完整的 AI 编程代理工作流程框架，通过强制性的技能系统确保代理在编码时遵循最佳实践。本项目将其核心纪律（TDD、验证、头脑风暴）适配到 OpenCode 的插件架构中。

### 核心目标

- **测试驱动开发 (TDD)**: 强制 "先写测试，再写代码" 的铁律
- **完成前验证**: 要求提供证据，而非断言
- **设计先行**: 复杂工作前必须进行头脑风暴和设计审批

## 主要功能特性

### 1. 自动纪律检查 (Hook注入模式)

通过 OpenCode Native Plugin 实现自动强制：

- **TDD 强制检查**: 在写入生产代码前自动检测是否已有测试
- **验证门控**: 标记任务完成前强制要求运行验证命令
- **实时提醒**: 通过警告和上下文注入提醒用户遵循纪律

### 2. 技能系统

三个可组合的技能模块：

| 技能名称                         | 模式     | 功能描述                     |
| -------------------------------- | -------- | ---------------------------- |
| `test-driven-development`        | Hook注入 | 强制 RED-GREEN-REFACTOR 循环 |
| `verification-before-completion` | Hook注入 | 完成前必须提供验证证据       |
| `brainstorming`                  | 独立技能 | 设计前强制思考和方案对比     |

### 3. OMO 深度集成

- **工具集成**: 无缝使用 `task()`, `lsp_diagnostics`, `skill_mcp` 等 OMO 工具
- **Agent 增强**: 自动向 Sisyphus/Hephaestus Agent 注入纪律要求
- **工作流嵌入**: 在 OpenCode 标准工作流中嵌入纪律检查点

## 技术栈

- **平台**: OpenCode / Oh My OpenCode (OMO)
- **插件架构**: OpenCode Native Plugin (JavaScript ES Module)
- **Hook 系统**: `tool.execute.before`, `session.created`, `todo.updated`
- **技能格式**: Markdown + YAML Frontmatter (agentskills.io 标准)
- **版本**: Superpowers v5.0.6 适配

## 安装与配置

### 前置要求

- OpenCode CLI 或 OMO 已安装
- Node.js/Bun 环境

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/yourusername/OMO-Superpowers.git
cd OMO-Superpowers
```

2. **复制到项目** (两种方式)

**方式A**: 复制到现有项目

```bash
cp -r .opencode /path/to/your/project/
cp opencode.json /path/to/your/project/
```

**方式B**: 作为全局插件

```bash
cp -r .opencode/plugins/* ~/.config/opencode/plugins/
```

3. **验证配置**

确认项目根目录存在 `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["superpowers-discipline"],
  "plugins": {
    "superpowers-discipline": {
      "enabled": true
    }
  }
}
```

### 配置选项

#### 严格模式 (可选)

启用严格模式后，插件将抛出错误阻止违规操作（而非仅显示警告）：

```bash
export SUPERPOWERS_STRICT=true
```

#### 禁用插件

**临时禁用**:

```bash
mv .opencode/plugins .opencode/plugins.disabled
```

**配置禁用**:

```json
{
  "plugins": {
    "superpowers-discipline": {
      "enabled": false
    }
  }
}
```

## 基本使用方法

### 1. 头脑风暴 (Brainstorming)

在开始任何功能开发前：

```
User: skill(name="brainstorming")
Agent: 启动苏格拉底式提问流程...
      探索项目上下文 -> 提问澄清 -> 提出2-3方案 -> 设计审批
```

**硬性门控**: 未获得设计审批前，Agent 不会开始写代码。

### 2. 测试驱动开发 (TDD)

TDD 纪律自动注入，无需手动调用。

**当尝试写生产代码时**:

```
⚠️ TDD VIOLATION DETECTED

You are attempting to write production code without a failing test first.

Iron Law: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

Required Actions:
1. Write a failing test for this feature
2. Run the test to confirm it fails
3. Then write minimal production code
```

**正确流程**:

```
1. Write test -> 2. Verify RED (fails) -> 3. Write minimal code -> 4. Verify GREEN (passes)
```

### 3. 完成前验证

标记任务完成时自动触发：

```
⚠️ VERIFICATION REQUIRED

You are marking a task as complete without verification.

Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

Required:
- [ ] Run tests (npm test)
- [ ] Type check (lsp_diagnostics)
- [ ] Lint check
- [ ] Provide evidence in completion message
```

## 项目结构

```
.
├── opencode.json                          # OpenCode 主配置
├── README.md                              # 项目说明
└── .opencode/
    ├── plugins/
    │   └── superpowers-discipline.js     # 纪律检查插件
    └── skills/
        ├── README.md                      # 技能使用指南
        ├── brainstorming/
        │   └── SKILL.md                   # 头脑风暴技能
        ├── test-driven-development/
        │   └── SKILL.md                   # TDD 技能
        └── verification-before-completion/
            └── SKILL.md                   # 验证技能
```

### 文件说明

| 文件                        | 作用                                      |
| --------------------------- | ----------------------------------------- |
| `opencode.json`             | OpenCode 配置，注册插件                   |
| `superpowers-discipline.js` | 核心插件，实现 Hook 检查                  |
| `SKILL.md`                  | 技能定义文件，包含纪律规范和 OMO 集成说明 |

## 核心原则

### 铁律 (Iron Laws)

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

### 反理性化 (Anti-Rationalization)

当想要跳过纪律时，记住：

| 借口                 | 现实                                       |
| -------------------- | ------------------------------------------ |
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after"    | Tests passing immediately prove nothing.   |
| "I'm confident"      | Confidence ≠ evidence                      |
| "Just this once"     | No exceptions                              |

## 相关项目

- **[Superpowers](https://github.com/obra/superpowers)**: 原始软件工程纪律框架
- **[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-openagent)**: OpenCode 插件系统
- **[OpenCode](https://opencode.ai)**: AI 编程平台

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- 感谢 [obra](https://github.com/obra) 创建 Superpowers 框架
- 感谢 OpenCode 团队提供优秀的插件系统

---

**状态**: 已适配 Superpowers v5.0.6，与 OpenCode/OMO 兼容
