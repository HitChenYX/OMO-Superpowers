---
name: brainstorming
description: "Use when starting creative work - features, components, or behavior changes"
version: "5.0.6-omo-1.0"
source: "https://github.com/obra/superpowers"
source_version: "5.0.6"
allowed-tools:
  - "Read"
  - "Write"
  - "skill"
  - "task"
---

# Brainstorming Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design and get user approval.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config change - all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences for truly simple projects), but you MUST present it and get approval.

## Checklist

You MUST complete these items in order:

1. **Explore project context** - check files, docs, recent commits
2. **Offer visual companion** (if topic will involve visual questions)
3. **Ask clarifying questions** - one at a time, understand purpose/constraints/success criteria
4. **Propose 2-3 approaches** - with trade-offs and your recommendation
5. **Present design** - in sections scaled to their complexity, get user approval after each section
6. **Write design doc** - save to appropriate location and commit
7. **Spec self-review** - quick inline check for placeholders, contradictions, ambiguity, scope
8. **User reviews written spec** - ask user to review before proceeding
9. **Transition to implementation** - proceed with TDD enforcement

## The Process

### Understanding the idea:

- Check out the current project state first (files, docs, recent commits)
- Before asking detailed questions, assess scope
- If project is too large, help decompose into sub-projects
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible
- Only one question per message
- Focus on understanding: purpose, constraints, success criteria

### Exploring approaches:

- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

### Presenting the design:

- Once you understand what you're building, present the design
- Scale each section to its complexity
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

### Design for isolation and clarity:

- Break the system into smaller units that each have one clear purpose
- For each unit, answer: what does it do, how do you use it, what does it depend on?
- Can someone understand what a unit does without reading its internals?
- Can you change the internals without breaking consumers?
- Smaller, well-bounded units are easier to work with

### Working in existing codebases:

- Explore the current structure before proposing changes
- Follow existing patterns
- Include targeted improvements as part of the design
- Don't propose unrelated refactoring

## After the Design

### Documentation:

- Write the validated design (spec) to appropriate location
- Commit the design document to git

### Spec Self-Review:

After writing the spec document:

1. **Placeholder scan:** Any "TBD", "TODO", incomplete sections? Fix them.
2. **Internal consistency:** Do sections contradict each other?
3. **Scope check:** Is this focused enough for a single implementation plan?
4. **Ambiguity check:** Could any requirement be interpreted two ways?

Fix any issues inline. No need to re-review - just fix and move on.

### User Review Gate:

After the spec review loop passes, ask the user to review the written spec before proceeding:

> "Spec written and committed to `<path>`. Please review it and let me know if you want to make any changes before we start implementation."

Wait for the user's response. If they request changes, make them and re-run the spec review loop. Only proceed once the user approves.

## OMO Integration

When working with oh-my-openagent:

### OMO Tools for Brainstorming

**Explore context:**
```javascript
Read(filePath="README.md")
Read(filePath="package.json")
Bash(command="git log --oneline -10")
```

**Delegate detailed design:**
```javascript
task(
  category="deep",
  load_skills=[],
  run_in_background=false,
  prompt="Create detailed design document for [feature] including architecture, data flow, and API design."
)
```

**Write design doc:**
```javascript
Write(filePath="docs/designs/YYYY-MM-DD-feature-design.md", content="...")
```

### OMO Workflow Integration

```
User Request -> Brainstorming -> Design Approval -> [Next Steps]
                                              |
                              Implementation with TDD enforcement
```

After user approves design:
1. For complex features -> Use `task(category="deep", ...)` with Prometheus
2. For simple features -> Proceed with test-driven-development
3. TDD will be enforced automatically via Hook

### Transition to Implementation

**The terminal state is approval to implement.** Do NOT invoke other implementation skills directly. After approval:

1. TDD discipline will be enforced automatically
2. Use `task()` to delegate implementation if needed
3. Verification will be required before completion

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Incremental validation** - Present design, get approval before moving on
- **Be flexible** - Go back and clarify when something doesn't make sense

## Cross-Skill References

- **After approval**: Use `test-driven-development` for implementation
- **Before completion**: Use `verification-before-completion` skill
- **For complex features**: Consider using `task(category="deep")` with Prometheus Agent
- **During design**: May use other skills for specific design aspects

## Final Note

Never skip the design phase. "Simple" projects often have the most hidden complexity. Take the time to understand before building.
