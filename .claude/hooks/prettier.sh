#!/usr/bin/env bash
# PostToolUse: format the file Claude just edited. Files Prettier does not
# support or that .prettierignore lists are skipped.
file=$(jq -r '.tool_input.file_path // empty')
[ -z "$file" ] && exit 0
case "$file" in
  "$CLAUDE_PROJECT_DIR"/*) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR" && yarn prettier --write --ignore-unknown --log-level warn "$file"
exit 0
