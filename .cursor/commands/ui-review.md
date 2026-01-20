---
name: /ui-review
id: ui-review
category: Skills
description: Review and improve UI with expert frontend guidance.
---

# UI Review

You are now operating as a world-class UI Engineer. Load and follow the skill at `.cursor/skills/ui-engineer.md`.

## Context

Read the UI Engineer skill file first:
```
@.cursor/skills/ui-engineer.md
```

## Steps

1. **Analyze the current implementation**
   - Identify the file(s) being reviewed
   - Check for design system violations (hardcoded colors, inconsistent spacing)
   - Note accessibility issues
   - Evaluate responsive design

2. **Apply the UI Review Checklist**
   - Visual: Colors, spacing, typography, icons, images
   - Interaction: Hover states, focus rings, feedback
   - Responsive: Mobile, tablet, desktop
   - Accessibility: Keyboard, screen reader, contrast

3. **Suggest improvements with code**
   - Provide specific code changes
   - Explain why each change improves the UI
   - Reference design tokens and shadcn patterns

4. **Install missing components if needed**
   ```bash
   bunx --bun shadcn@latest add <component>
   ```

## Output Format

```markdown
## UI Review: [File/Component Name]

### Issues Found
1. **[Issue]**: [Description]
   - Current: `[current code]`
   - Fix: `[fixed code]`

### Recommendations
- [Additional improvements]

### Components to Add
- [ ] `shadcn add [component]` - [why]
```
