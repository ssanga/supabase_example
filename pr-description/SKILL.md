---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR or when the user asks to summarize changes for a pull request.
argument-hint: "[base-branch]"
---

# Pull Request Description Skill

Generate a clear, structured pull request description based on the current branch's changes.

## Instructions

1. Gather context about the changes:
   - Run `git log` to see commits since diverging from the base branch
   - Run `git diff` to understand what changed
   - Run `git status` to see any uncommitted changes

2. Identify the nature of the changes:
   - Is it a new feature, bug fix, refactor, docs update, test addition, or chore?
   - What is the motivation or problem being solved?
   - What files and components are affected?

3. Write the PR description using this template:

```
## Resumen

- <resumen en bullet point de lo que hace este PR>
- <otro punto clave si es necesario>

## Cambios

- <cambio específico 1>
- <cambio específico 2>

## Plan de pruebas

- [ ] <cómo verificar que funciona>
- [ ] <otro paso de verificación>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Rules

- Keep the PR title under 70 characters, starting with a conventional commit type (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`)
- Write all content **in Spanish** — title, summary, changes, and test plan
- Be concise — focus on *why* and *what*, not line-by-line detail
- If `$ARGUMENTS` is provided, use it as the base branch for comparison; otherwise default to `main`

## Context

**Recent commits:**
!`git log --oneline $(git merge-base HEAD ${ARGUMENTS:-main})..HEAD 2>/dev/null || git log --oneline -10`

**Changed files:**
!`git diff --name-only $(git merge-base HEAD ${ARGUMENTS:-main})..HEAD 2>/dev/null || git diff --name-only HEAD~1`

**Diff summary:**
!`git diff $(git merge-base HEAD ${ARGUMENTS:-main})..HEAD --stat 2>/dev/null || git diff HEAD~1 --stat`
