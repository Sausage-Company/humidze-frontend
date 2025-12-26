# Claude Code Instructions for Humidze

This file contains Claude-specific instructions. For general project patterns, see [AGENTS.md](./AGENTS.md).

## General Project Guidelines

**IMPORTANT:** Read [AGENTS.md](./AGENTS.md) for complete project architecture, patterns, and conventions.

This file contains only Claude-specific tooling instructions.

## Svelte MCP Server

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation.

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.

When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.

After calling list-sections, you MUST:
1. Analyze the returned documentation sections (especially the `use_cases` field)
2. Use get-documentation to fetch ALL documentation sections relevant for the user's task

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.

**MUST use this tool:**
- Whenever writing Svelte code before sending it to the user
- Keep calling it until no issues or suggestions are returned
- This ensures Svelte 5 best practices are followed

### 4. playground-link

Generates a Svelte Playground link with the provided code.

**Usage:**
- After completing code, ask the user if they want a playground link
- Only call this tool after user confirmation
- NEVER use if code was written to files in their project

## Claude-Specific Workflow

When implementing Svelte features:

1. **Check AGENTS.md** for project patterns
2. **Use list-sections** to find relevant Svelte docs (if needed)
3. **Use get-documentation** to fetch all relevant sections
4. **Implement the feature** following project patterns
5. **Use svelte-autofixer** to verify code before sending to user
6. **Optionally offer playground-link** for standalone examples

## Example Workflow

```
User: "Add a modal component"

1. Check AGENTS.md → Component patterns section
2. list-sections → Find "snippets", "state", "transitions"
3. get-documentation → Fetch relevant sections
4. Implement Modal.svelte following project patterns:
   - Props: variant, size, class, children (Snippet)
   - State: $state for isOpen
   - Use $derived for classes
5. svelte-autofixer → Verify implementation
6. Send to user with option for playground link
```

## Project-Specific Reminders

- Always use `$derived` for computed classes (see AGENTS.md)
- Follow the composables pattern for reusable logic (see AGENTS.md)
- Use error type constants (see AGENTS.md Error Handling)
- Use `dvh` not `vh` for viewport height
- Check AGENTS.md for naming conventions (fetch vs refetch)
