#!/bin/bash
# Prepare computer for live session
# Uses osascript/Finder for proper macOS permissions

DESKTOP="$HOME/Desktop"
TARGET_NAME="ארגון_קבצים"

# Check free disk space (warn if less than 10GB)
FREE_BYTES=$(df -k "$HOME" | tail -1 | awk '{print $4}')
FREE_GB=$((FREE_BYTES / 1024 / 1024))

if [ "$FREE_GB" -lt 10 ]; then
    echo "⚠️  WARNING: Low disk space! Only ${FREE_GB}GB free (recommended: 10GB+)"
else
    echo "✓ Disk space OK: ${FREE_GB}GB free"
fi

# Use osascript to move files via Finder (handles macOS permissions properly)
# Renames duplicates instead of skipping or overwriting
RESULT=$(osascript << 'EOF'
tell application "Finder"
    set desktopFolder to path to desktop folder
    set targetName to "ארגון_קבצים"

    -- Create target folder if it doesn't exist
    if not (exists folder targetName of desktopFolder) then
        make new folder at desktopFolder with properties {name:targetName}
    end if

    set targetFolder to folder targetName of desktopFolder
    set movedCount to 0

    -- Get all items except target folder
    set itemsToMove to every item of desktopFolder whose name is not targetName

    repeat with anItem in itemsToMove
        set itemName to name of anItem
        set baseName to itemName
        set counter to 1

        -- Check if item exists in target, if so rename with counter
        repeat while (exists item baseName of targetFolder)
            if itemName contains "." then
                set AppleScript's text item delimiters to "."
                set nameParts to text items of itemName
                set AppleScript's text item delimiters to ""
                if (count of nameParts) > 1 then
                    set nameWithoutExt to (items 1 thru -2 of nameParts) as string
                    set ext to last item of nameParts
                    set baseName to nameWithoutExt & "_" & counter & "." & ext
                else
                    set baseName to itemName & "_" & counter
                end if
            else
                set baseName to itemName & "_" & counter
            end if
            set counter to counter + 1
        end repeat

        -- Rename if needed before moving
        if baseName is not itemName then
            set name of anItem to baseName
        end if

        try
            move anItem to targetFolder
            set movedCount to movedCount + 1
        on error errMsg
            -- Log error but continue with other files
            log "Failed to move " & itemName & ": " & errMsg
        end try
    end repeat

    return movedCount
end tell
EOF
)

echo "Desktop cleaned. $RESULT items moved to: $DESKTOP/$TARGET_NAME"
