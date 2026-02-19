---
description: Deploy ATP website — git commit + push + vercel deploy
---

# Deploy ATP Website

// turbo-all

1. Stage all changes:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git add -A
```

2. Check what changed:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git status
```

3. Commit with message (use a descriptive message based on what changed):
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git commit -m "update: [describe changes]"
```

4. Push to GitHub:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git push
```

5. Deploy to Vercel:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && vercel --prod --yes
```

6. Verify the live site headers:
```bash
curl -sI https://ai-transparency-protocol.vercel.app | head -20
```

7. Verify the AI-Transparency manifest:
```bash
curl -s https://ai-transparency-protocol.vercel.app/.well-known/ai-transparency.json | head -5
```
