# Contributing Guide

## Branch Strategy

- `main`: production-ready code
- `develop`: active integration branch
- `feature/*`: new functionality
- `bugfix/*`: non-urgent fixes
- `hotfix/*`: urgent production fixes

## Starting Work

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

## Before Opening a PR

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run format:check
```

Fix failures before requesting review.

## Commit Guidelines

Keep commits focused and descriptive. Avoid mixing unrelated refactors with feature work.

## Pull Requests

- Explain the problem and solution.
- Keep the PR focused.
- Include validation performed.
- Call out configuration or database changes.
- Do not include secrets.
- Resolve merge conflicts before final review.
- Wait for required review and CI checks before merging.

## Security

Never commit:

- passwords
- tokens
- API keys
- private certificates
- production connection strings
- `.env.local`

Report security issues privately to the project maintainers rather than opening a public issue with exploit details.
