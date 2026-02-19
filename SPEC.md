# AI Transparency Protocol — Specification v2.0

**Status:** Draft
**Version:** 2.0
**Date:** 2026-02-18
**Authors:** Sascha Deforth (Antigravity Ventures)

---

> [!CAUTION]
> This specification is a **best-effort implementation** for compliance with Art. 50 of the EU AI Act (Regulation (EU) 2024/1689). While specific harmonised EU standards for web-based text content are still pending (CEN/CENELEC), this open-source protocol offers a state-of-the-art method to meet transparency obligations. It is **not endorsed by or affiliated with** the European Union or any EU institution.

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

### 4.1 Article 50 Paragraph Mapping

The following table maps each paragraph of EU AI Act Article 50 to the corresponding protocol feature:

| Art. 50 | Obligation | Addressee | Protocol Feature |
|---|---|---|---|
| Abs. 1 | Inform users of AI interaction | Provider | `ats_tier: ATS-4/5` + `scope` route matching |
| Abs. 2 | Machine-readable output marking | Provider | JSON manifest + HTTP headers + `<link>` discovery |
| Abs. 3 | Emotion/biometric system disclosure | Deployer | `content_types: ["biometric"]` |
| Abs. 4.1 | Deepfake disclosure | Deployer | `deepfake_disclosure: true` + `content_types` |
| Abs. 4.4 | AI text for public interest disclosure | Deployer | `ats_tier` + `human_oversight` |
| Abs. 4.5 | Exemption for human-reviewed content | Deployer | `human_oversight: true` + `editorial_responsibility` |
| Abs. 5 | Clear, distinguishable, accessible | Both | Client widget (RECOMMENDED) + WCAG 2.1 AA |
| Abs. 6 | Chapter III unaffected | — | N/A |
| Abs. 7 | AI Office codes of practice | — | Future alignment |

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
| `content_types` | array of strings | OPTIONAL | Content types: `text`, `images`, `video`, `audio`, `code`, `biometric` |
| `ats_tier` | string | RECOMMENDED | ATS tier: `ATS-0` through `ATS-5` |
| `ats_extent` | string | OPTIONAL | E-scale: `E0` through `E4` |
| `human_oversight` | boolean | OPTIONAL | Whether human oversight exists |
| `editorial_responsibility` | string | OPTIONAL | Person/entity with editorial control (Art. 50 Abs. 4 exemption) |
| `deepfake_disclosure` | boolean | OPTIONAL | Whether scope contains AI-generated deepfake content (Art. 50 Abs. 4) |
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

The ATS Framework (January 2026, [Meaningfulness Media Group](https://github.com/ATS-Framework)) standardizes the declaration of AI involvement in content creation.

| Tier | Role Name | Human Role | Description |
|---|---|---|---|
| `ATS-0` | Unaugmented (Traditional Artisan) | Sole author | No generative AI functions used |
| `ATS-1` | Augmented (Architect) | Author; AI refines | AI used for refinement, analysis, or research only |
| `ATS-1T` | Transformative (Translator) | Author; AI translates | AI used only for one-to-one translation |
| `ATS-2` | Co-Creative (Producer) | Editor; AI drafts fragments | AI drafts local fragments (sentences, paragraphs) |
| `ATS-3` | Generative (Director) | Reviewer; AI drafts structure | AI drafts structural units (scenes, chapters) |
| `ATS-4` | Autonomous (Editor) | Oversight; AI generates | AI generates from detailed outlines or agentic systems |
| `ATS-5` | Fully Autonomous (Publisher) | None | AI generates and publishes autonomously |

> **Bright Line:** ATS-2 marks the boundary between "reactive use" (ATS-0, ATS-1) and "generative use" (ATS-2+), where AI generates first-pass token sequences.

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

### 8.2 Source Code Declaration (RECOMMENDED)

HTML files SHOULD include a structured comment block at the top of the document declaring the AI transparency status. This provides human-readable transparency without any visible UI element:

```html
<!--
  ╔══════════════════════════════════════════════════════╗
  ║  AI TRANSPARENCY PROTOCOL — Source Code Declaration  ║
  ║                                                      ║
  ║  Tier:    ATS-2 (Co-Creative)                        ║
  ║  Extent:  E2 (significant AI generation)             ║
  ║  Scope:   /blog/*                                    ║
  ║  Status:  EU AI Act Art. 50 compliant                ║
  ║                                                      ║
  ║  Manifest: /.well-known/ai-transparency.json         ║
  ╚══════════════════════════════════════════════════════╝
-->
```

This pattern is RECOMMENDED because:

- **Zero cost** — no scripts, no styles, no performance impact
- **Auditor-friendly** — visible in "View Source" and DevTools
- **Crawler-parseable** — structured text in a predictable format
- **Complements Layer 1** — the JSON manifest remains the canonical source

### 8.3 Disclosure Guidance by ATS Tier

| ATS Tier | Visible Disclosure | Recommended Method | Legal Basis |
| --- | --- | --- | --- |
| ATS-0 | ❌ Not required | Source Code Declaration only | No AI content → nothing to disclose |
| ATS-1 / ATS-1T | ⚡ Optional | Byline: `AI-assisted` | Minor AI involvement, good practice |
| ATS-2 / ATS-3 | ✅ Recommended | Byline: `✨ AI co-created (ATS-2)` | Art. 50 Abs. 5 — "clear and distinguishable" |
| ATS-4 / ATS-5 | ✅ **Required** | Byline: `✨ AI-generated (ATS-4)` | Art. 50 Abs. 2+5 — fully AI-generated content |

> [!IMPORTANT]
> For ATS-4 and ATS-5 content, a visible disclosure to the end user is a **legal obligation** under Art. 50 Abs. 5. A source code comment or JSON manifest alone is not sufficient — the information must be presented "in a clear and distinguishable manner" to the natural person.

**Example byline for ATS-3 content:**

```html
<p class="ai-byline">✨ This article was drafted with AI assistance (ATS-3)</p>
```

> [!TIP]
> **Editorial Exemption (Art. 50 Abs. 5):** The AI Act exempts AI-generated content from disclosure obligations when "the content has undergone a process of human review or editorial control and a natural or legal person holds editorial responsibility." ATP's `human_oversight` + `editorial_responsibility` fields provide machine-readable proof of this exemption — a unique capability no other standard offers.

## 9. Client-Side Widget (RECOMMENDED)

> **IMPORTANT:** Art. 50 does NOT require a pop-up, banner, or opt-in consent dialog. Unlike the GDPR (cookie banners), the AI Act requires only **transparency** — the user must be able to *see* the information, not *accept* it.

Art. 50 Abs. 2 requires **machine-readable** marking (fulfilled by the JSON manifest). Art. 50 Abs. 5 additionally requires that disclosure information is presented in a **"clear and distinguishable manner"** and conforms to **accessibility requirements**.

While the law does not mandate a specific UI element, an inline contextual badge is the RECOMMENDED best practice for fulfilling Art. 50 Abs. 5.

### 9.1 Design Principles

The widget MUST follow the **Contextual UI** pattern (inline, not overlay):

- **NO `position: fixed` overlays** — the badge injects into the document flow
- **Inline injection** — placed after a logical anchor (heading, byline, article meta)
- **Progressive disclosure** — shows minimal info first (`✨ AI co-created · ATS-2`), expands on click
- **Chamäleon theming** — inherits host site typography via `font-family: inherit`
- **White-label ready** — all colors configurable via CSS custom properties

### 9.2 Industry Conventions

| Pattern | Best For | Example |
|---|---|---|
| ✨ Sparkle icon | Universal AI indicator | `✨ AI-assisted` next to heading |
| Byline integration | Blogs, news | `Author: Jane Doe · ✨ AI co-created` |
| Footer disclaimer | Corporate, SEO | `Transparenzhinweis gem. EU AI Act: …` |
| Micro-copy | Chatbots | `KI kann Fehler machen.` |

### 9.3 CSS Custom Properties (Theming)

Implementors SHOULD expose CSS custom properties for white-label deployment:

```css
:root {
  --atp-bg: #f3f4f6;          /* Badge background */
  --atp-text: #374151;         /* Badge text color */
  --atp-accent: #6d28d9;       /* Focus outline, links */
  --atp-radius: 4px;           /* Border radius */
  --atp-font-size: 0.85em;     /* Badge font size */
  --atp-panel-bg: #1f2937;     /* Tooltip background */
  --atp-panel-text: #f9fafb;   /* Tooltip text */
}
```

### 9.4 Injection Modes

| Mode | Attribute | Behavior |
|---|---|---|
| Auto-detect | *(default)* | Finds `article header`, `.byline`, `h1` |
| Explicit anchor | `data-atp-anchor="h1"` | Injects after specified CSS selector |
| Footer | `data-atp-position="footer"` | Appends as discrete footnote |

### 9.5 Technical Requirements

- MUST use Shadow DOM for style isolation
- MUST comply with WCAG 2.1 AA (Art. 50 Abs. 5)
- MUST support keyboard navigation (Enter, Space, Escape)
- MUST include `aria-expanded` state tracking
- MUST include `focus-visible` styles
- MUST provide a `<noscript>` fallback for CSP-restricted environments
- SHOULD display the matched ATS tier, human oversight, and EU AI Act compliance
- SHOULD support `deepfake_disclosure` and `editorial_responsibility` fields

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
- [ATS Framework — Authorship Transparency Statement](https://github.com/ATS-Framework/ATS-Framework) (v1.0, Meaningfulness Media Group)
- [IETF RFC 7230 — HTTP/1.1 Message Syntax](https://tools.ietf.org/html/rfc7230)
- [IETF OETP Draft — Open Ethics Transparency Protocol](https://datatracker.ietf.org/doc/draft-lukianets-open-ethics-transparency-protocol/)
- [C2PA — Coalition for Content Provenance and Authenticity](https://c2pa.org)
- [W3C TDMRep — Text and Data Mining Reservation Protocol](https://www.w3.org/community/tdmrep/)
- [JSON Schema — json-schema.org](https://json-schema.org)
