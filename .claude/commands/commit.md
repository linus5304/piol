---
description: Create a well-formatted commit following Piol conventions
---

Review all staged changes with `git diff --staged`, then:

1. Analyze what changed
2. Determine the appropriate scope (web, convex, mobile, agent, chore)
3. Identify the feature ID if applicable
4. Generate a commit message following this format:
   `<scope>(<feature-id>): <description>`

Requirements:
- Description should be imperative ("add" not "added")
- Keep under 72 characters
- Focus on WHY not WHAT

After generating the message, execute the commit.
