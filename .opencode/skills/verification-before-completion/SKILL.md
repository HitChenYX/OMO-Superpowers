---
name: verification-before-completion
description: "Use BEFORE claiming work is complete, fixed, or passing"
version: "5.0.6-omo-1.0"
source: "https://github.com/obra/superpowers"
source_version: "5.0.6"
allowed-tools:
  - "Bash"
  - "Read"
  - "skill"
  - "skill_mcp"
  - "lsp_diagnostics"
  - "task"
hook-triggers:
  - "task-completion-request"
  - "commit-request"
  - "pr-request"
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Requirements met | Line-by-line checklist | Tests passing |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence != evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter != compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion != excuse |
| "Partial check is enough" | Partial proves nothing |

## OMO Integration

This skill is ENFORCED via Hook system. You cannot mark tasks complete without verification.

### Required OMO Tools

- `Bash`: Run verification commands (tests, lint, type-check)
- `lsp_diagnostics`: Verify no type errors in changed files
- `skill_mcp(mcp_name="testing", ...)`: Execute test suites
- `task(category="quick", ...)`: Dispatch verification subtasks

### Hook Enforcement

This skill is automatically triggered before:
- Task completion claims
- Git commits (via git-master integration)
- Pull request creation

### Verification Ritual with OMO

#### Step 1: Run Verification Commands

```javascript
// Example using OMO tools
Bash(command="npm test")
Bash(command="npm run lint")
lsp_diagnostics(filePath="src/changed-file.ts")
```

#### Step 2: Collect Evidence

You must provide:
- Test output showing all tests pass
- Type check results (no errors)
- Lint results (no violations)
- Visual confirmation (screenshots for UI changes)

#### Step 3: Document Results

```
VERIFICATION COMPLETE

Tests: 15 passed, 0 failed
Type Check: 0 errors, 0 warnings
Lint: Clean
Manual Check: [Description]
```

## Completion Gate

<HARD-GATE>
You CANNOT mark tasks as complete, fixed, or passing until you have:
1. Run verification commands
2. Collected evidence
3. Documented results

NO EXCEPTIONS.
</HARD-GATE>

## Why This Matters

From failure memories:
- Human partner said "I don't believe you" - trust broken
- Undefined functions shipped - would crash
- Missing requirements shipped - incomplete features
- Time wasted on false completion -> redirect -> rework
- Violates: "Honesty is a core value. If you lie, you'll be replaced."

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

**Rule applies to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness

## Cross-Skill References

- **After test-driven-development**: Use this skill before claiming complete
- **If verification fails**: Return to implementation
- **Before commit**: This skill gates all completion claims

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.
