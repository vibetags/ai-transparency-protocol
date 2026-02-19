# Contributing to the AI Transparency Protocol

Thank you for your interest in contributing! This project aims to become a widely adopted web convention for AI content transparency — and that requires community input.

## How to Contribute

### 🐛 Report Issues

Found a bug in the schema, a gap in the spec, or a legal inaccuracy? [Open an issue](../../issues/new/choose).

### 💡 Suggest Features

Have an idea for improving the protocol? Open a feature request. We especially welcome:

- **Real-world edge cases** — content types or deployment scenarios not covered
- **CMS integration ideas** — WordPress, Drupal, Shopify, etc.
- **Legal review** — corrections to our Article 50 mapping
- **Accessibility improvements** — WCAG compliance of the widget

### 🔧 Submit Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-improvement`)
3. Make your changes
4. Ensure the JSON schema is valid: `npx ajv compile -s schema/v2.0.json`
5. Submit a PR with a clear description

### 🌍 Translate Documentation

We need translations of the README, SPEC, and examples in:
- 🇩🇪 German (Deutsch)
- 🇫🇷 French (Français)
- 🇪🇸 Spanish (Español)
- 🇮🇹 Italian (Italiano)
- 🇳🇱 Dutch (Nederlands)

## Most Wanted Contributions

| Priority | Area | Description |
|---|---|---|
| 🔴 High | **WordPress Plugin** | Admin UI for manifest generation |
| 🔴 High | **Legal Review** | Accuracy of Art. 50 mapping by qualified lawyers |
| 🟡 Medium | **Schema Edge Cases** | Content types, scope patterns, validation rules |
| 🟡 Medium | **CMS Plugins** | Drupal, Shopify, Ghost integrations |
| 🟢 Nice-to-have | **Translations** | README and SPEC in EU languages |
| 🟢 Nice-to-have | **Adoption Examples** | Real-world manifests from production sites |

## Schema Change Process

Changes to `schema/v2.0.json` require:

1. An issue describing the proposed change and rationale
2. Discussion period (minimum 7 days for breaking changes)
3. Updated examples demonstrating the change
4. PR with schema change + documentation updates

Breaking changes will increment the major version (v2 → v3).

## Code of Conduct

Be respectful, constructive, and inclusive. This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## Questions?

Open a [Discussion](../../discussions) or reach out via the contact in the README.
