# AI Transparency Protocol

**The pragmatic bridge between EU AI Act Article 50 and web reality.**

> A machine-readable JSON manifest for AI content transparency — the "Poor Man's C2PA" that web publishers can actually deploy.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Schema Version](https://img.shields.io/badge/Schema-v2.0-blue.svg)](schema/v2.0.json)
[![ATS Framework](https://img.shields.io/badge/ATS-2026-orange.svg)](SPEC.md)

> **Part of the Complete AI Interface Layer** — This protocol handles **Defense** (legal compliance, Art. 50). For **Offense** (AI search visibility, brand positioning), see [VibeTags™ & AgenticContext™](https://github.com/vibetags/vibetags-spec).

---

## The Problem

The EU AI Act Article 50 takes effect **August 2, 2026** with fines up to **€15 million**. Every website using AI-generated content must provide machine-readable and human-readable transparency disclosures.

Current solutions miss the mark:

| Approach | Problem |
|---|---|
| **llms.txt / W3C TDMRep** | Inbound focus — tells scrapers what NOT to train on. Doesn't solve the Art. 50 *outbound* disclosure obligation |
| **C2PA (Content Credentials)** | Cryptographic overkill — requires certificate infrastructure. Designed for images/video, not AI-generated text |
| **IETF OETP Draft** | Massively overloaded — demands model training details and data labeling. Unusable for normal web publishers |

## The Solution

A single JSON file at `/.well-known/ai-transparency.json` that:

- ✅ **Fulfills Article 50** — machine-readable AI content disclosure
- ✅ **Per-route granularity** — chatbot (ATS-5) vs. blog (ATS-2) vs. legal pages (ATS-0)
- ✅ **ATS Framework compatible** — January 2026 Authorship Transparency Statement tiers
- ✅ **Validatable** — `$schema` reference for automated compliance checking
- ✅ **5-minute deployment** — no crypto, no certificates, no infrastructure
- ✅ **SEO-safe** — granular scope prevents search engines from penalizing human content

## Quick Start

Create `/.well-known/ai-transparency.json`:

```json
{
  "$schema": "https://ai-transparency-protocol.org/schema/v2.0.json",
  "eu_ai_act": {
    "article_50_compliant": true,
    "effective_date": "2026-08-02",
    "disclosure_method": ["http-header", "client-widget", "manifest"]
  },
  "policies": [
    {
      "scope": "/chatbot/*",
      "content_types": ["text"],
      "ats_tier": "ATS-5",
      "ats_extent": "E4",
      "human_oversight": false
    },
    {
      "scope": "/blog/*",
      "content_types": ["text", "images"],
      "ats_tier": "ATS-2",
      "ats_extent": "E2",
      "human_oversight": true
    },
    {
      "scope": ["/impressum", "/agb", "/datenschutz"],
      "ats_tier": "ATS-0",
      "description": "Strictly human-authored, no AI disclosure required."
    }
  ],
  "transparency_policy_url": "https://example.com/ai-transparency",
  "contact": "compliance@example.com",
  "generator": "TrueSource AI Middleware",
  "x-asimov-laws": "acknowledged"
}
```

That's it. You're Article 50 compliant.

## ATS Tiers (Authorship Transparency Statement)

The ATS Framework (January 2026, [Meaningfulness Media Group](https://github.com/ATS-Framework)) defines **six tiers of AI involvement** in content creation:

| Tier | Role Name | Human Role | Example |
|---|---|---|---|
| **ATS-0** | Unaugmented (Traditional Artisan) | Sole author, no AI | Legal pages, Impressum |
| **ATS-1** | Augmented (Architect) | Author; AI refines/analyzes | Spell-check, grammar, research |
| **ATS-1T** | Transformative (Translator) | Author; AI translates only | One-to-one translation |
| **ATS-2** | Co-Creative (Producer) | Editor; AI drafts fragments | AI-assisted blog posts |
| **ATS-3** | Generative (Director) | Reviewer; AI drafts structure | AI-drafted newsletters |
| **ATS-4** | Autonomous (Editor) | Oversight; AI generates from outlines | Auto-generated reports |
| **ATS-5** | Fully Autonomous (Publisher) | None; AI generates & publishes | Chatbots, autonomous agents |

> **Bright Line:** ATS-2 marks the threshold where AI generates first-pass token sequences ("generative use"). ATS-0 and ATS-1 are "reactive use" only.

## E-Scale (AI Contribution Extent)

| Level | AI Contribution | Typical Use |
|---|---|---|
| **E0** | < 1% | Pure human content |
| **E1** | 1–25% | Minor AI assistance |
| **E2** | 26–50% | AI co-creation |
| **E3** | 51–90% | AI-primary with human review |
| **E4** | > 90% | Fully autonomous AI |

## Triple-Layer Labeling

The protocol recommends a three-layer approach:

```text
Layer 1 (Machine):
  → HTTP Headers: AI-Transparency, AI-Content-Policy, AI-Generated-Content
  → /.well-known/ai-transparency.json manifest
  → HTML Auto-Discovery: <link rel="ai-transparency" href="/.well-known/ai-transparency.json">

Layer 2 (Human — JavaScript):
  → WCAG 2.1 AA transparency badge widget
  → Keyboard navigation (Enter/Space/Escape)

Layer 3 (Human — Fallback):
  → <noscript> text-link for CSP-blocked environments
  → Works without JavaScript
```

### HTML Auto-Discovery

Add to your site's `<head>` for crawler discovery (like RSS feeds or favicons):

```html
<link rel="ai-transparency" href="/.well-known/ai-transparency.json">
```

## HTTP Headers

Complement the manifest with response headers:

```http
AI-Transparency: article-50-compliant
AI-Content-Policy: https://example.com/ai-transparency
AI-Generated-Content: true
```

> **Note:** We intentionally avoid `Content-Credentials` to prevent namespace collision with the C2PA standard (Adobe, Microsoft).

### CORS (Required for Scanners)

The manifest route **must** allow cross-origin access for EU audit tools, browser extensions, and compliance scanners:

```http
Access-Control-Allow-Origin: *
Content-Type: application/json
```

## Examples

See the [examples/](examples/) directory:

- [Site-wide](examples/site-wide.json) — Simplest case, entire site
- [Mixed Content](examples/mixed-content.json) — AI blog + human legal pages
- [Enterprise](examples/enterprise.json) — Full ATS policies with 3 routes

## Comparison

| Feature | This Protocol | C2PA | IETF OETP | llms.txt |
|---|---|---|---|---|
| Text content | ✅ | ⚠️ Emerging | ✅ | ❌ |
| Per-route scope | ✅ | ❌ | ❌ | ❌ |
| ATS tiers | ✅ | ❌ | Partial | ❌ |
| No crypto needed | ✅ | ❌ | ✅ | ✅ |
| Art. 50 compliant | ✅ | ✅ | Partial | ❌ |
| 5-min deployment | ✅ | ❌ | ❌ | ✅ |
| SEO-safe | ✅ | N/A | ❌ | N/A |
| JSON Schema | ✅ | N/A | ✅ | ❌ |

## Tooling

**TrueSource AI Middleware** generates this manifest automatically along with platform-specific configs for:

Cloudflare Workers · Vercel Edge · Nginx · Apache · AWS Lambda@Edge · WordPress · Netlify · Shopify

```python
from ai_bot_middleware import AIBotMiddleware

m = AIBotMiddleware(ai_content_policies=[
    {"scope": "/chatbot/*", "ats_tier": "ATS-5", "ats_extent": "E4"},
    {"scope": "/blog/*", "ats_tier": "ATS-2", "human_oversight": True},
    {"scope": "/impressum", "ats_tier": "ATS-0"},
])
manifest = m.generate_ai_transparency_manifest(audit_data)
```

## Specification

See [SPEC.md](SPEC.md) for the formal specification.

## Legal Context

- **EU AI Act** — [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- **Article 50** — Transparency obligations for AI content providers
- **Article 99** — Fines up to €15,000,000 or 3% of global annual turnover
- **European Accessibility Act (EAA)** — Accessibility deadline June 28, 2025

## The Complete AI Web Ecosystem

> While this protocol handles your **Outbound Compliance** (defense against €15M fines), check out our sister project [VibeTags™ & AgenticContext™](https://github.com/vibetags/vibetags-spec) to optimize how AI agents perceive and recommend your brand (**Inbound LLM Optimization**).

| | Offense (Growth) | Defense (Legal) |
|---|---|---|
| **Protocol** | VibeTags™ & AgenticContext™ | AI Transparency Protocol |
| **Problem** | 35% of searches go to AI — brand invisible | €15M fines for missing AI disclosure |
| **Solution** | Emotional + contextual triggers in Schema.org | `ai-transparency.json` manifest + headers |
| **Repo** | [vibetags-spec](https://github.com/vibetags/vibetags-spec) | This repo |

## Credits

Created by [Sascha Deforth](https://www.linkedin.com/in/deforth/) at [Antigravity Ventures](https://www.hopeandglory.studio).

Built on:
- [ATS Framework](https://github.com/ATS-Framework/ATS-Framework) (January 2026, Meaningfulness Media Group)
- [EU AI Act Article 50](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [IETF RFC 7230](https://tools.ietf.org/html/rfc7230) HTTP/1.1 Message Syntax

## Easter Egg

> *The EU AI Act is, at its core, Europe's bureaucratic implementation of Isaac Asimov's Three Laws of Robotics (1942). We thought it only fitting to acknowledge that. If your compliance scanner finds `x-asimov-laws: acknowledged` in a manifest — someone on the team has read their classics.* 🤖

## License

MIT — Use freely, attribute kindly.
