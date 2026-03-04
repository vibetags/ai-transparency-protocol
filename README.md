# AI Transparency Protocol

**Machine-readable AI content transparency for the web.**

> An open-source proposal for how websites can declare their use of AI-generated content — per route, per content type, in a single JSON file.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Schema Version](https://img.shields.io/badge/Schema-v2.0-blue.svg)](schema/v2.0.json)
[![ATS Framework](https://img.shields.io/badge/ATS_Framework-2026-orange.svg)](SPEC.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Author: Sascha Deforth](https://img.shields.io/badge/Author-Sascha%20Deforth-blue.svg)](https://github.com/975SDE)
[![Hope & Glory Studio](https://img.shields.io/badge/by-Hope%20%26%20Glory%20Studio-black.svg)](https://www.hopeandglory.studio)

> [!WARNING]
> **Experimental Project — Not Legal Advice — Not a Recommendation**
>
> This is an experimental open-source project. It does **not** constitute legal advice, a legal recommendation, or a guarantee of regulatory compliance. It is not endorsed by, affiliated with, or approved by the European Union, any EU institution, or any regulatory authority. Whether and how the EU AI Act applies to your situation depends on your specific role, content type, and jurisdiction. **Always consult a qualified legal professional** for compliance advice. Use at your own risk.

---

## Why This Exists

The EU AI Act (Article 50) creates new transparency obligations for AI-generated content, effective **August 2, 2026**.

- **Providers** (OpenAI, Google, etc.) must embed machine-readable markers into AI outputs
- **Deployers** (websites publishing AI content on matters of public interest) must disclose AI involvement to users

Providers will solve their part with watermarking (SynthID) and content credentials (C2PA).

But **Deployers** — the millions of websites using AI for blogs, chatbots, product descriptions — have no standardized way to declare: *"This specific page was AI-assisted. That chatbot is fully autonomous. Our legal pages are human-authored."*

That's the gap this protocol addresses.

## Who Is This For?

| You are... | This helps you... |
|---|---|
| **Web publisher** using AI content tools | Declare AI involvement per URL pattern |
| **News site / public interest publisher** | Meet Art. 50 Abs. 4 disclosure obligations |
| **Enterprise with mixed content** | Different transparency levels per section |
| **Compliance officer** | Machine-readable, schema-validated declarations |
| **Developer / CMS vendor** | Standard format to build tools against |

> **Honest note:** If your website doesn't publish AI-generated text on matters of public interest, Article 50 may not legally require you to disclose. But transparency is good practice — and this makes it trivially easy.

## Quick Start

Create `/.well-known/ai-transparency.json`:

```json
{
  "$schema": "https://ai-transparency-protocol.org/schema/v2.0.json",
  "eu_ai_act": {
    "article_50_compliant": true,
    "effective_date": "2026-08-02",
    "disclosure_method": ["manifest", "http-header"]
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
      "description": "Human-authored, no AI disclosure needed."
    }
  ],
  "transparency_policy_url": "https://example.com/ai-transparency",
  "contact": "compliance@example.com"
}
```

Deploy it. Done. That's the entire implementation.

## The Key Idea: Per-Route Granularity

Most transparency approaches treat an entire website as one unit. But websites aren't monolithic:

```
example.com/
├── /chatbot/*     → Fully autonomous AI (ATS-5)
├── /blog/*        → Human-edited, AI-assisted (ATS-2)  
├── /products/*    → AI-drafted descriptions (ATS-3)
├── /legal/*       → 100% human-authored (ATS-0)
└── /reports/*     → AI-generated, human-reviewed (ATS-4)
```

Each route can have its own ATS tier, its own disclosure level, and its own editorial responsibility declaration. This is what makes `ai-transparency.json` useful — and what no other approach currently offers.

## ATS Tiers (Authorship Transparency Statement)

The [ATS Framework](https://github.com/ATS-Framework/ATS-Framework) (January 2026) defines six tiers of AI involvement:

| Tier | Name | Human Role | Example |
|---|---|---|---|
| **ATS-0** | Unaugmented | Sole author, no AI | Legal pages, Impressum |
| **ATS-1** | Augmented | Author; AI refines | Spell-check, grammar, research |
| **ATS-1T** | Transformative | Author; AI translates | One-to-one translation |
| **ATS-2** | Co-Creative | Editor; AI drafts fragments | AI-assisted blog posts |
| **ATS-3** | Generative | Reviewer; AI drafts structure | AI-drafted newsletters |
| **ATS-4** | Autonomous | Oversight; AI generates | Auto-generated reports |
| **ATS-5** | Fully Autonomous | None | Chatbots, autonomous agents |

> **Bright Line:** ATS-2 is where AI starts generating first-pass content. Below that is "reactive use" only.

## How It Compares

| Feature | This Protocol | C2PA | IETF OETP | llms.txt |
|---|---|---|---|---|
| Web text focus | ✅ Primary | ⚠️ Emerging | ✅ | ❌ |
| Per-route scope | ✅ | ❌ | ❌ | ❌ |
| Editorial exemption | ✅ | ❌ | ❌ | ❌ |
| No crypto required | ✅ | ❌ | ✅ | ✅ |
| JSON Schema validation | ✅ | N/A | ✅ | ❌ |
| 5-min deployment | ✅ | ❌ | ❌ | ✅ |

**Important:** These are complementary, not competing. C2PA handles images/video provenance. SynthID handles watermarking. This protocol handles **site-level web text declarations**. A complete transparency stack may use all three.

## Triple-Layer Labeling

The protocol recommends three layers:

```
Layer 1 — Machine:
  → /.well-known/ai-transparency.json manifest
  → HTTP Headers: AI-Transparency: article-50-compliant
  → HTML: <link rel="ai-transparency" href="/.well-known/ai-transparency.json">

Layer 2 — Source Code:
  → HTML comment block with ATS tier, scope, and compliance status
  → Parseable by auditors and compliance crawlers

Layer 3 — User-Facing:
  → WCAG 2.1 AA transparency badge widget (optional)
  → Byline integration: "Author: Jane Doe · ✨ AI co-created"
```

## Examples

See the [examples/](examples/) directory:

- [Site-wide](examples/site-wide.json) — Simplest case, entire site
- [Mixed Content](examples/mixed-content.json) — AI blog + human legal pages
- [Enterprise](examples/enterprise.json) — Multiple routes with different ATS tiers

## Adoption Path

This is **not an official standard**. It's an open-source proposal hoping to become one.

That's how web conventions work:

| Convention | Official at Launch? | Today |
|---|---|---|
| `robots.txt` | ❌ Private proposal (1994) | ✅ Universal standard |
| `security.txt` | ❌ Indie project | ✅ RFC 9116 |
| `ads.txt` | ❌ IAB initiative | ✅ Industry standard |
| **`ai-transparency.json`** | ❌ Open source (2026) | ⏳ Building momentum |

> **Adoption creates standards. Standards don't create adoption.**

## Validate Your Manifest

Every manifest can be validated against the [JSON Schema](schema/v2.0.json):

```bash
# Using ajv-cli
npx ajv validate -s schema/v2.0.json -d your-manifest.json

# Or just curl and check
curl -s https://your-site.com/.well-known/ai-transparency.json | python3 -m json.tool
```

## EU AI Act Context

- **Article 50** — Transparency obligations for providers and deployers of AI systems
- **Article 50 Abs. 2** — Providers must mark outputs as machine-detectable (Provider obligation)
- **Article 50 Abs. 4** — Deployers must disclose AI text published on matters of public interest
- **Article 50 Abs. 5** — Disclosure must be clear, distinguishable, and accessible (WCAG)
- **Editorial exemption** — If AI text undergoes human review and someone holds editorial responsibility, the Deployer disclosure obligation may not apply

> **⚠️ This is an experiment, not legal advice.** This protocol does not claim to make anyone "Article 50 compliant" and does not constitute a legal recommendation. Compliance is a legal assessment that depends on your specific situation, content type, jurisdiction, and role (Provider vs. Deployer). This protocol provides an experimental, open-source technical mechanism for the disclosure part of that compliance. **Always consult a qualified legal professional.**

## Specification

See [SPEC.md](SPEC.md) for the formal specification, including:
- Complete schema reference
- Article 50 paragraph mapping
- HTTP header conventions
- Source Code Declaration format
- Client-side widget recommendations

## Ethical Principles

See [ETHICS.md](ETHICS.md) — transparency is not optional, complexity hinders compliance, and this protocol should prevent compliance washing, not enable it.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Most wanted:**
- 🌍 Translations of documentation (DE, FR, ES, IT)
- 🔧 CMS plugins (WordPress, Drupal, Shopify)
- 📋 Real-world adoption examples
- 🐛 Schema edge cases and validation improvements
- 📝 Legal review of Article 50 mapping accuracy

## Credits

Created by **[Sascha Deforth](https://www.linkedin.com/in/deforth/)** at [Hope & Glory Studio](https://www.hopeandglory.studio).

- 🔗 [GitHub](https://github.com/975SDE) · [LinkedIn](https://www.linkedin.com/in/deforth/) · [Website](https://www.hopeandglory.studio)

Built on:
- [ATS Framework](https://github.com/ATS-Framework/ATS-Framework) (January 2026, Meaningfulness Media Group)
- [EU AI Act Article 50](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)

## License

MIT — Use freely, attribute kindly.
