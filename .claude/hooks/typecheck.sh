#!/usr/bin/env bash
# Stop: run the typecheck. On errors, exit 2 so Claude sees them and fixes
# them; on a second stop attempt in a row, report only, to avoid a loop.
active=$(jq -r '.stop_hook_active // false')
cd "$CLAUDE_PROJECT_DIR" || exit 0
if output=$(yarn typecheck 2>&1); then
  exit 0
fi
echo "yarn typecheck failed:" >&2
echo "$output" | tail -40 >&2
[ "$active" = "true" ] && exit 0
exit 2
