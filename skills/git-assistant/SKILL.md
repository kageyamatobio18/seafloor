---
name: git-assistant
description: Help with Git operations including commit messages, branch management, and repository workflows. Use when committing changes, reviewing diffs, managing branches, or resolving Git issues.
---

# Git Assistant

Streamline Git workflows with better commits and branch management.

## Smart Commits

Generate good commit messages from staged changes:

```bash
# See what's staged
git diff --staged --stat

# See actual changes
git diff --staged

# Then craft a message following conventional commits:
# type(scope): description
#
# Types: feat, fix, docs, style, refactor, test, chore
```

### Commit Message Format

```
<type>(<scope>): <short description>

<body - what and why, not how>

<footer - breaking changes, issue refs>
```

**Examples:**
- `feat(auth): add OAuth2 login flow`
- `fix(api): handle null response in user endpoint`
- `docs(readme): add installation instructions`
- `chore(deps): update lodash to 4.17.21`

## Common Operations

### Stage & Commit
```bash
git add -p              # Interactive staging
git add .               # Stage all
git commit -m "msg"     # Quick commit
git commit              # Opens editor
```

### Branch Management
```bash
git branch              # List local
git branch -a           # List all
git checkout -b name    # Create + switch
git branch -d name      # Delete (safe)
git branch -D name      # Delete (force)
```

### Sync with Remote
```bash
git fetch               # Get remote changes
git pull                # Fetch + merge
git pull --rebase       # Fetch + rebase
git push                # Push to remote
git push -u origin name # Push new branch
```

### Undo Things
```bash
# Unstage files
git reset HEAD file

# Discard changes (careful!)
git checkout -- file

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert <commit>
```

### View History
```bash
git log --oneline -10   # Quick view
git log -p              # With diffs
git log --graph         # Branch structure
git blame file          # Line-by-line history
git show <commit>       # Single commit details
```

## Workflow Patterns

### Feature Branch
```bash
git checkout -b feature/name
# ... work ...
git add -A
git commit -m "feat: description"
git push -u origin feature/name
# Create PR/MR via web
```

### Quick Fix
```bash
git stash               # Save current work
git checkout main
git pull
git checkout -b fix/issue
# ... fix ...
git commit -m "fix: description"
git push -u origin fix/issue
git checkout -                  # Back to previous branch
git stash pop           # Restore work
```

### Sync Fork
```bash
git remote add upstream <url>
git fetch upstream
git checkout main
git merge upstream/main
git push
```

## Troubleshooting

### Merge Conflicts
```bash
# See conflicted files
git status

# After resolving:
git add <resolved-files>
git commit  # or git merge --continue
```

### Detached HEAD
```bash
# Create branch from current state
git checkout -b new-branch

# Or return to a branch
git checkout main
```

### Wrong Branch
```bash
# Move commits to correct branch
git stash
git checkout correct-branch
git stash pop
```

## Best Practices

- Commit early, commit often
- One logical change per commit
- Write descriptive messages
- Pull before push
- Use branches for features
- Don't commit secrets
