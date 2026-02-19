# WordPress Plugin Concept: AI Transparency Protocol

> **Status:** Concept / RFC — Not yet in development  
> **Priority:** High (from [Strategic Roadmap](README.md))  
> **Target:** WordPress 6.x+, PHP 8.0+

---

## Overview

A WordPress plugin that generates and serves `/.well-known/ai-transparency.json` directly from the WordPress admin — no manual JSON editing required.

## Plugin Name

**ATP — AI Transparency for WordPress**  
Slug: `atp-ai-transparency`

## Core Features

### Phase 1: MVP (March 2026)

**Settings Page** (`Settings → AI Transparency`)

| Setting | Type | Default | Description |
|---|---|---|---|
| Enable Protocol | Toggle | Off | Serve the manifest |
| Organization Name | Text | Site title | For the manifest header |
| Contact Email | Email | Admin email | Art. 50 contact |
| Default ATS Tier | Dropdown | ATS-2 | Sitewide default |
| Transparency Policy URL | URL | — | Link to policy page |
| Article 50 Compliance | Toggle | false | Self-declaration |

**Global Policy Rules**

Define scope-based policies from the admin:

```
Rule 1: /blog/*     → ATS-2, human_oversight: true
Rule 2: /products/* → ATS-3, human_oversight: true  
Rule 3: /legal/*    → ATS-0
Rule 4: /*          → ATS-1 (fallback)
```

Admin UI: sortable list with drag-and-drop reordering (precedence = order).

**Manifest Generation**

The plugin generates `ai-transparency.json` and serves it at `/.well-known/ai-transparency.json` via a WordPress rewrite rule — no file system access needed.

```php
// Register the rewrite rule
add_action('init', function() {
    add_rewrite_rule(
        '^\.well-known/ai-transparency\.json$',
        'index.php?atp_manifest=1',
        'top'
    );
});

// Serve the manifest
add_action('template_redirect', function() {
    if (get_query_var('atp_manifest')) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('AI-Transparency: article-50-compliant');
        echo json_encode(ATP_Manifest::generate(), JSON_PRETTY_PRINT);
        exit;
    }
});
```

**Auto-Discovery Tag**

Injects `<link rel="ai-transparency">` into `<head>`:

```php
add_action('wp_head', function() {
    echo '<link rel="ai-transparency" href="/.well-known/ai-transparency.json">' . "\n";
});
```

**HTTP Headers**

Adds transparency headers to all responses:

```php
add_action('send_headers', function() {
    if (ATP_Settings::is_enabled()) {
        header('AI-Transparency: article-50-compliant');
    }
});
```

### Phase 2: Per-Post ATS (April 2026)

**Gutenberg Sidebar Panel**

A meta box / sidebar panel on every post/page:

```
┌─────────────────────────────────┐
│  🤖 AI Transparency            │
│                                 │
│  ATS Tier: [ATS-2 ▾]           │
│  AI Extent: [E2 (26-50%) ▾]    │
│  Human Oversight: [✓]          │
│  Editorial Responsibility:      │
│  [Jane Doe, Editor-in-Chief]   │
│                                 │
│  ℹ️ This overrides the global   │
│  policy for this specific post. │
└─────────────────────────────────┘
```

Stored as post meta:

```php
register_post_meta('post', '_atp_ats_tier', [
    'type' => 'string',
    'single' => true,
    'default' => '',  // empty = use global policy
    'show_in_rest' => true,
]);
```

**Dynamic Manifest**

The manifest dynamically includes per-post overrides:

```json
{
  "policies": [
    { "scope": "/blog/*", "ats_tier": "ATS-2" },
    { "scope": "/blog/my-ai-post/", "ats_tier": "ATS-4", "human_oversight": true },
    { "scope": "/legal/*", "ats_tier": "ATS-0" }
  ]
}
```

### Phase 3: Widget & Validation (May 2026)

- **Client-side widget** auto-injected in footer (optional)
- **Schema validation** on manifest save (warns about issues)
- **Dashboard widget** showing ATP compliance status
- **WP-CLI commands** for manifest generation and validation

```bash
wp atp generate    # Output manifest to stdout
wp atp validate    # Validate current manifest against schema
wp atp status      # Show compliance summary
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                WordPress Admin                   │
│                                                  │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Settings     │  │  Gutenberg Sidebar       │ │
│  │  Page         │  │  (per-post ATS meta)     │ │
│  └──────┬───────┘  └────────────┬─────────────┘ │
│         │                       │                │
│         ▼                       ▼                │
│  ┌──────────────────────────────────────────┐   │
│  │         ATP_Manifest::generate()          │   │
│  │  Merges global policies + post overrides  │   │
│  └──────────────────┬───────────────────────┘   │
│                     │                            │
│         ┌───────────┼───────────┐                │
│         ▼           ▼           ▼                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Rewrite  │ │ wp_head  │ │ Headers  │        │
│  │ Rule     │ │ <link>   │ │ Filter   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│       │             │           │                │
└───────┼─────────────┼───────────┼────────────────┘
        ▼             ▼           ▼
  /.well-known/   <link rel=    AI-Transparency:
  ai-transparency  "ai-trans-   article-50-
  .json            parency">    compliant
```

## WordPress-Specific Considerations

| Topic | Approach |
|---|---|
| **Multisite** | Per-site settings, not network-wide |
| **Caching** | Manifest cached as transient, busted on settings save |
| **Permalink Structure** | Works with any permalink structure via rewrite |
| **Classic Editor** | Fallback meta box (not just Gutenberg) |
| **Translation** | i18n ready, `.pot` file included |
| **WPML / Polylang** | Per-language manifest possible |
| **Performance** | Zero frontend impact (JSON served on dedicated route only) |

## Distribution

1. **WordPress.org Plugin Directory** — free, open-source
2. **GitHub Releases** — for early adopters
3. **Composer** — `composer require vibetags/atp-wordpress`

## Competition

| Existing Plugin | What It Does | How ATP Differs |
|---|---|---|
| None found | — | **First mover in this space** |

There are currently **zero WordPress plugins** that generate AI transparency manifests. This is a greenfield opportunity.

## Next Steps

- [ ] Validate concept with 3-5 WordPress site owners
- [ ] Create plugin scaffolding (`wp scaffold plugin atp-ai-transparency`)
- [ ] Build Phase 1 MVP (settings page + manifest generation)
- [ ] Submit to WordPress.org plugin review
- [ ] Write documentation with screenshots

---

*This concept is part of the [AI Transparency Protocol](README.md) strategic roadmap.*
