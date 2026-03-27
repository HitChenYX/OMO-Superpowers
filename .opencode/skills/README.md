# Superpowers Skills for OMO

本文档提供Superpowers技能在OMO系统中的使用指南。

## 技能列表

### 1. test-driven-development（Hook注入模式）

**触发方式**: 自动（代码生成前）  
**强制执行**: 是

**核心原则**: NO PRODUCTION CODE WITHOUT FAILING TEST FIRST

**OMO集成说明**:
- 在代码生成请求前自动注入
- 使用 `task(category="quick", ...)` 实现测试
- 使用 `lsp_diagnostics` 验证代码质量
- 使用 `skill_mcp` 执行测试套件

**使用示例**:
```
[系统自动触发TDD纪律]
```

### 2. verification-before-completion（Hook注入模式）

**触发方式**: 自动（任务完成前）  
**强制执行**: 是

**核心原则**: ALWAYS verify before claiming completion

**OMO集成说明**:
- 在任务完成、提交代码、创建PR前自动拦截
- 要求提供验证证据（测试输出、类型检查结果等）
- 使用 `Bash` 运行验证命令
- 使用 `lsp_diagnostics` 检查类型错误

**使用示例**:
```
[完成任务时自动触发验证检查]
```

### 3. brainstorming（独立技能模式）

**触发方式**: 手动调用  
**调用命令**: `skill(name="brainstorming")`  
**强制执行**: 否（建议性）

**核心原则**: Present design before implementation

**使用场景**:
- 开始新功能开发前
- 重大架构决策前
- 需求不明确时

**使用示例**:
```
User: skill(name="brainstorming")
Agent: [启动头脑风暴流程]
```

**与Prometheus的协同**:
设计批准后，可调用 `task(category="deep", ...)` 进行详细规划。

## 快速参考

### 强制检查流程

```
代码生成请求 → TDD检查 → 通过 → 继续
                    ↓
              缺少测试 → 拦截 → 要求先写测试

任务完成请求 → Verification检查 → 通过 → 标记完成
                        ↓
                  缺少验证 → 拦截 → 要求提供证据
```

### 常用命令

```bash
# 手动调用头脑风暴
skill(name="brainstorming")

# 查看日志
tail -f .opencode/logs/superpowers.log

# 禁用Superpowers Hook（紧急）
mv .opencode/hooks .opencode/hooks.disabled
```

## 迁移信息

- **来源**: https://github.com/obra/superpowers
- **版本**: 5.0.6
- **适配版本**: OMO 3.11.0+
- **迁移日期**: 2026-03-26

## 问题反馈

如有问题，请提交至项目Issue Tracker。
