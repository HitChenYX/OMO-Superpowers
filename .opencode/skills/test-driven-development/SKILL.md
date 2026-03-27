---
name: test-driven-development
description: "Use when implementing any feature or bugfix, before writing implementation code"
version: "5.0.6-omo-1.0"
source: "https://github.com/obra/superpowers"
source_version: "5.0.6"
allowed-tools:
  - "Bash"
  - "Read"
  - "Write"
  - "skill"
  - "skill_mcp"
  - "lsp_diagnostics"
  - "task"
hook-triggers:
  - "code-generation-request"
  - "file-write-intent"
---

# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (ask your human partner):**
- Throwaway prototypes
- Generated code
- Configuration files

Thinking "skip TDD just this once"? Stop. That's rationalization.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete

Implement fresh from tests. Period.

## Red-Green-Refactor

### RED - Write Failing Test

Write one minimal test showing what should happen.

**Requirements:**
- One behavior
- Clear name
- Real code (no mocks unless unavoidable)

### Verify RED - Watch It Fail

**MANDATORY. Never skip.**

```bash
npm test path/to/test.test.ts
```

Confirm:
- Test fails (not errors)
- Failure message is expected
- Fails because feature missing (not typos)

### GREEN - Minimal Code

Write simplest code to pass the test.

Don't add features, refactor other code, or "improve" beyond the test.

### Verify GREEN - Watch It Pass

**MANDATORY.**

Confirm:
- Test passes
- Other tests still pass
- Output pristine (no errors, warnings)

### REFACTOR - Clean Up

After green only:
- Remove duplication
- Improve names
- Extract helpers

Keep tests green. Don't add behavior.

## Verification Checklist

Before marking work complete:

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

Can't check all boxes? You skipped TDD. Start over.

## OMO Integration

When working with oh-my-openagent:

### OMO Tools for TDD

**Task delegation for tests:**
```javascript
task(
  category="quick",
  load_skills=[],
  run_in_background=false,
  prompt="Write a failing test for [feature]. Use real code, not mocks."
)
```

**Diagnostics after changes:**
```javascript
lsp_diagnostics(filePath="path/to/changed-file.ts")
```

**MCP test execution:**
```javascript
skill_mcp(
  mcp_name="testing",
  tool_name="run_tests",
  arguments='{"pattern": "path/to/test.test.ts"}'
)
```

### OMO Workflow Integration

The Hook system will:
1. Intercept code generation requests
2. Inject TDD discipline requirements
3. Enforce test-before-implementation

### Common OMO Patterns

**RED Phase with OMO:**
1. Use `Write` to create test file
2. Use `Bash` to run test and verify it fails
3. Use `lsp_diagnostics` to check for syntax errors

**GREEN Phase with OMO:**
1. Use `Write` to implement minimal production code
2. Use `Bash` to run test and verify it passes
3. Use `lsp_diagnostics` to ensure clean diagnostics

**REFACTOR Phase with OMO:**
1. Use `skill(name="refactor")` or manual refactoring
2. Run `lsp_diagnostics` after each change
3. Use `Bash` to verify all tests still pass

## Cross-Skill References

- **Before implementation**: Consider using `brainstorming` skill for design approval
- **Before completion**: Must use `verification-before-completion` skill
- **During debugging**: Bug found -> Write failing test first -> Follow TDD cycle
- **After approval**: Transition to implementation with TDD enforcement

## Final Rule

```
Production code -> test exists and failed first
Otherwise -> not TDD
```

No exceptions without your human partner's permission.
