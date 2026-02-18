# AI Transparency Protocol — Specification v2.0

**Status:** Draft
**Version:** 2.0
**Date:** 2026-02-18
**Authors:** Sascha Deforth (Antigravity Ventures)

---

## 1. Overview

The AI Transparency Protocol defines a machine-readable JSON manifest served at `/.well-known/ai-transparency.json` that declares how a website uses AI-generated content. It is designed to fulfill EU AI Act Article 50 transparency obligations.

## 2. Manifest Location

The manifest MUST be served at:

```
https://{domain}/.well-known/ai-transparency.json
```

The file MUST:
- Be valid JSON (RFC 8259)
- Use UTF-8 encoding
- Be served with `Content-Type: application/json`
- Be publicly accessible (no authentication required)

### 2.1 HTML Auto-Discovery

Sites SHOULD include a `<link>` element in the HTML `<head>` for crawler and tool discovery:

```html
<link rel="ai-transparency" href="/.well-known/ai-transparency.json">
```

This follows the pattern of RSS (`alternate`), favicons (`icon`), and security policies (`security.txt`).

### 2.2 CORS Headers

The manifest route MUST include CORS headers to enable cross-origin access by EU audit tools, browser extensions, and compliance scanners:

```http
Access-Control-Allow-Origin: *
Content-Type: application/json
```

## 3. Schema Reference

Every manifest MUST include a `$schema` property pointing to the versioned JSON Schema:

```json
{
  "$schema": "https://ai-transparency-protocol.org/schema/v2.0.json"
}
```

## 4. Root Properties

| Property | Type | Required | Description |
|---|---|---|---|
| `$schema` | string (URI) | REQUIRED | JSON Schema validation URL |
| `eu_ai_act` | object | REQUIRED | EU AI Act compliance declaration |
| `policies` | array | RECOMMENDED | Per-route content policies (v2.0) |
| `schema_version` | string | OPTIONAL | Legacy version indicator (use `$schema` instead) |
| `transparency_policy_url` | string (URI) | REQUIRED | Human-readable transparency policy page |
| `contact` | string (email) | REQUIRED | Compliance contact |
| `last_updated` | string (date) | REQUIRED | ISO 8601 date of last manifest update |
| `generator` | string | OPTIONAL | Tool that generated the manifest |
| `wcag_compliance` | string | OPTIONAL | WCAG compliance level (e.g., "WCAG 2.1 AA") |

## 5. `eu_ai_act` Object

| Property | Type | Required | Description |
|---|---|---|---|
| `article_50_compliant` | boolean | REQUIRED | Whether the site complies with Art. 50 |
| `effective_date` | string (date) | REQUIRED | Art. 50 enforcement date: `2026-08-02` |
| `disclosure_method` | array of strings | REQUIRED | Methods used: `http-header`, `client-widget`, `manifest` |

## 6. Policies Array (v2.0)

The `policies` array enables per-route AI content declarations. Each policy object defines the AI involvement for a specific URL scope.

### 6.1 Policy Object

| Property | Type | Required | Description |
|---|---|---|---|
| `scope` | string or array | REQUIRED | URL pattern(s) this policy applies to |
| `content_types` | array of strings | OPTIONAL | Content types: `text`, `images`, `video`, `audio` |
| `ats_tier` | string | RECOMMENDED | ATS tier: `ATS-0` through `ATS-4` |
| `ats_extent` | string | OPTIONAL | E-scale: `E0` through `E4` |
| `human_oversight` | boolean | OPTIONAL | Whether human oversight exists |
| `c2pa_status` | string | OPTIONAL | C2PA status: `signed`, `signaled`, `not-applicable` |
| `description` | string | OPTIONAL | Human-readable description of AI usage |

### 6.2 Scope Patterns

Scopes use glob-like patterns:
- `/chatbot/*` — matches all paths under `/chatbot/`
- `/blog/ai-news/*` — matches AI news blog section
- `["/impressum", "/agb"]` — array for multiple exact paths
- `/*` — entire site (equivalent to site-wide)

### 6.3 Policy Precedence

When multiple policies match a URL, the **most specific** scope takes precedence:
1. Exact path match (`/impressum`) wins over
2. Path prefix match (`/blog/*`) wins over
3. Wildcard match (`/*`)

## 7. ATS Framework Integration

### 7.1 ATS Tiers (Authorship Transparency Statement)

The ATS Framework (January 2026) standardizes the declaration of AI involvement in content creation:

| Tier | AI Role | Human Role | Description |
|---|---|---|---|
| `ATS-0` | None | Full author | Fully human-authored |
| `ATS-1` | Tool | Author + AI tools | Spell-check, grammar, formatting |
| `ATS-2` | Co-creator | Editor + curator | AI generates fragments, human assembles |
| `ATS-3` | Drafter | Reviewer + approver | AI generates full draft, human validates |
| `ATS-4` | Agent | Minimal oversight | Autonomous AI generation |

### 7.2 E-Scale (Extent of AI Contribution)

| Level | Range | Description |
|---|---|---|
| `E0` | < 1% | Negligible AI involvement |
| `E1` | 1–25% | Minor AI assistance |
| `E2` | 26–50% | Significant AI co-creation |
| `E3` | 51–90% | AI-primary content |
| `E4` | > 90% | Fully AI-generated |

## 8. HTTP Headers

The following HTTP response headers SHOULD accompany the manifest:

```
AI-Transparency: article-50-compliant
AI-Content-Policy: https://example.com/ai-transparency
AI-Generated-Content: true
```

### 8.1 Header Design Rationale

- **`AI-Transparency`** — Custom namespace, IETF RFC 7230 compliant
- **`AI-Content-Policy`** — Modeled after `Content-Security-Policy` (W3C)
- **`AI-Generated-Content`** — Explicit own namespace; avoids collision with C2PA `Content-Credentials`

> **IMPORTANT:** The `Content-Credentials` header is reserved by the C2PA standard (Adobe, Microsoft) and MUST NOT be used for AI Act compliance to avoid parsing errors and legal "compliance washing".

## 9. Client-Side Widget

An optional JavaScript widget provides human-readable disclosure:

### 9.1 Requirements

- MUST use Shadow DOM for style isolation
- MUST comply with WCAG 2.1 AA accessibility standards
- MUST support keyboard navigation (Enter, Space, Escape)
- MUST include `aria-expanded` state tracking
- MUST include `focus-visible` styles
- MUST provide a `<noscript>` fallback for CSP-restricted environments

## 10. Legacy Compatibility (v1.x)

For backward compatibility, the manifest MAY include a `schema_version` field alongside `$schema`:

```json
{
  "$schema": "https://ai-transparency-protocol.org/schema/v2.0.json",
  "schema_version": "2.0",
  "eu_ai_act": {
    "scope": { "type": "site-wide" }
  }
}
```

When no `policies` array is present, the simple `scope` object provides v1.x-compatible behavior:

| Scope Type | Description |
|---|---|
| `site-wide` | Entire site is AI-assisted |
| `mixed-content` | Some content is AI-generated |
| `path-specific` | Only specific paths (listed in `scope.paths`) |

## 11. Security Considerations

- Manifests MUST NOT contain sensitive information (API keys, internal URLs)
- Manifests SHOULD be served over HTTPS
- Manifests MUST NOT be used to make false compliance claims
- The `$schema` URL is for validation only and MUST NOT execute code
- The manifest route MUST serve `Access-Control-Allow-Origin: *` for cross-origin scanner access

## 12. References

- [EU AI Act — Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [ATS Framework — Authorship Transparency Statement](https://www.authorshiptransparency.org)
- [IETF RFC 7230 — HTTP/1.1 Message Syntax](https://tools.ietf.org/html/rfc7230)
- [IETF OETP Draft — Open Ethics Transparency Protocol](https://datatracker.ietf.org/doc/draft-lukianets-open-ethics-transparency-protocol/)
- [C2PA — Coalition for Content Provenance and Authenticity](https://c2pa.org)
- [W3C TDMRep — Text and Data Mining Reservation Protocol](https://www.w3.org/community/tdmrep/)
- [JSON Schema — json-schema.org](https://json-schema.org)
