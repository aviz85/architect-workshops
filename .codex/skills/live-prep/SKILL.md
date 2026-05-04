---
name: live-prep
description: "Clean desktop for live session. Use for: prepare for live, clean desktop, get ready for streaming."
---

# Live Prep

Prepares the desktop for a live session by moving all files and folders into a designated organization folder.

## Workflow

Run the cleanup script:

```bash
bash /Users/aviz/architect-workshops/.codex/skills/live-prep/scripts/clean_desktop.sh
```

This will:
1. Check free disk space and warn if less than 10GB
2. Create `~/Desktop/ארגון_קבצים` if it doesn't exist
3. Move all desktop items (files and folders) into that folder
4. Handle duplicates by renaming (adds `_1`, `_2`, etc.) - never overwrites or deletes
5. Uses Finder/osascript for proper macOS permissions

After running, the desktop will be clean and ready for screen sharing.
