---
description: Deploy ATP website — git commit + push + vercel deploy
---

# Deploy ATP Website

// turbo-all

Deployt alle Änderungen auf GitHub UND aktualisiert die Live-Website auf Vercel.

1. Stage all changes:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git add -A
```

2. Check what changed:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git status --short
```

3. Commit with a descriptive message based on the changes (look at the status output):
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git -c commit.gpgsign=false commit -m "update: [describe changes based on git status]"
```
> [!NOTE]
> If the commit hangs, use the MCP GitKraken `git_add_or_commit` tool as fallback.

4. Push to GitHub:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && git push
```
> [!NOTE]
> If push hangs, use the MCP GitKraken `git_push` tool as fallback.

5. Deploy to Vercel production:
```bash
cd /Users/info/Desktop/ai-transparency-protocol && vercel --prod --yes
```

6. Verify the live site responds and has correct headers:
```bash
curl -sI https://ai-transparency-protocol.vercel.app | grep -E "(HTTP|ai-transparency|content-type)"
```

7. Confirm deployment is complete. Report the Vercel URL and verification results to the user.
