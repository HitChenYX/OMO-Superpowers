/**
 * Superpowers Discipline Plugin for OpenCode/OMO
 * 
 * Enforces TDD and Verification disciplines via tool.execute.before hook
 */

export const SuperpowersDiscipline = async ({ project, client, $, directory, worktree }) => {
  // Track if we're in implementation phase
  let hasWrittenTest = false;
  let hasVerified = false;
  
  return {
    // Hook: Before any tool executes
    "tool.execute.before": async (input, output) => {
      const toolName = input.tool;
      const args = input.args || {};
      
      // TDD Enforcement: Check before Write/Edit operations
      if ((toolName === "Write" || toolName === "Edit") && args.filePath) {
        const filePath = args.filePath;
        
        // Skip if it's a test file
        if (filePath.includes(".test.") || filePath.includes(".spec.")) {
          hasWrittenTest = true;
          return; // Allow test files
        }
        
        // Skip if it's config/documentation
        if (filePath.match(/\.(md|json|yaml|yml|config)$/)) {
          return; // Allow config files
        }
        
        // For production code files, check if test was written first
        if (!hasWrittenTest) {
          // Inject TDD discipline reminder into output
          output.warning = `
⚠️  **TDD VIOLATION DETECTED**

You are attempting to write production code without a failing test first.

**Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

**Required Actions:**
1. Write a failing test for this feature
2. Run the test to confirm it fails
3. Then write minimal production code

Use: skill(name="test-driven-development") for guidance.

Type 'OVERRIDE' to bypass (not recommended).
`;
          
          // Block if strict mode (can be disabled)
          if (process.env.SUPERPOWERS_STRICT === "true") {
            throw new Error("TDD Violation: Write test first before production code");
          }
        }
      }
      
      // Reset flag on task completion attempt
      if (toolName === "todowrite" && args.todos) {
        const todos = JSON.parse(args.todos || "[]");
        const completingTask = todos.some(t => 
          t.status === "completed" && t.content.toLowerCase().includes("implement")
        );
        
        if (completingTask && !hasVerified) {
          output.warning = `
⚠️  **VERIFICATION REQUIRED**

You are marking an implementation task as complete without verification.

**Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

**Required Actions:**
1. Run verification commands (tests, lint, type-check)
2. Collect evidence of success
3. Then mark complete

Use: skill(name="verification-before-completion") for guidance.
`;
          
          if (process.env.SUPERPOWERS_STRICT === "true") {
            throw new Error("Verification Required: Run tests before marking complete");
          }
        }
      }
    },
    
    // Hook: Session start - inject discipline context
    "session.created": async (input, output) => {
      output.context = `
## Superpowers Discipline Active

This session enforces:
1. **Test-Driven Development** - Tests before production code
2. **Verification Before Completion** - Evidence before claims

Use skill(name="brainstorming") for design work.
Use skill(name="test-driven-development") for TDD guidance.
Use skill(name="verification-before-completion") for verification rituals.

Strict mode: ${process.env.SUPERPOWERS_STRICT === "true" ? "ENABLED" : "disabled (warnings only)"}
`;
    },
    
    // Hook: Reset flags on new task
    "todo.updated": async (input, output) => {
      // Reset tracking when new tasks are created
      hasWrittenTest = false;
      hasVerified = false;
    }
  };
};
