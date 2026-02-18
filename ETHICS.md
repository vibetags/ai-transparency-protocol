# Ethics Statement

## Purpose

The AI Transparency Protocol exists to bridge the gap between legislative requirements and practical web deployment. We believe:

### 1. Transparency Is Not Optional

AI-generated content is inherently neither good nor bad. But users have a fundamental right to know when they are interacting with or consuming AI-generated content. This is not just a legal requirement — it is an ethical imperative.

### 2. Complexity Prevents Compliance

The biggest barrier to transparency is not willingness but complexity. Solutions that require cryptographic infrastructure, model training documentation, or enterprise-grade tooling will only be adopted by the largest companies. The rest of the web — the 99% — will remain opaque.

We choose pragmatism over perfection: a simple JSON file that any web publisher can deploy in 5 minutes.

### 3. Granularity Prevents Harm

Declaring an entire website as "AI-generated" when only a chatbot uses AI is both inaccurate and harmful. It creates SEO penalties, legal ambiguity, and user distrust. Per-route policies with ATS tiers enable truthful, precise disclosure.

### 4. Open Standards Protect Everyone

This protocol is published under MIT license because:
- Compliance tools should not be proprietary moats
- Interoperability requires open specifications
- Small businesses need free access to compliance infrastructure
- Auditors need predictable, standardized formats

### 5. Accessibility Is Non-Negotiable

Transparency disclosures that are not accessible to people with disabilities are not transparent at all. WCAG 2.1 AA compliance is a requirement, not an optional feature. The European Accessibility Act (EAA) reinforces this — accessibility is law.

### 6. No Compliance Washing

This protocol must not be misused to claim compliance without genuine transparency. A manifest that declares `article_50_compliant: true` while hiding AI usage is worse than no manifest at all. Implementations SHOULD be verifiable through automated checks.

## Our Commitment

We commit to:
- Keeping this specification open, free, and vendor-neutral
- Evolving the schema based on regulatory guidance and community feedback
- Supporting interoperability with emerging standards (C2PA, ATS, OETP)
- Never gatekeeping compliance behind paid features
- Maintaining backward compatibility across schema versions

---

*"The best standard is one that makes doing the right thing easier than doing the wrong thing."*
