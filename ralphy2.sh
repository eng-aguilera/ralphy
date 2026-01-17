#!/usr/bin/env bash

# ============================================
# Ralphy2 - Simple Autonomous AI Coding Loop
# Based on: https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum
# ============================================

set -e

VERSION="1.0.0"

# Colors
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4); CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" BLUE="" CYAN="" BOLD="" RESET=""
fi

# Defaults
PRD_FILE="PRD.json"
PROGRESS_FILE="progress.txt"
MAX_ITERATIONS=10
USE_DOCKER=false
MOUNT_CLAUDE_CONFIG=true   # Mount ~/.claude into Docker for MCP servers
MOUNT_DOCKER_SOCKET=false  # Mount Docker socket for running containers (e.g., agent-browser)
AI_ENGINE="claude"
DRY_RUN=false
PROJECT_NAME=""  # Optional name for Docker container

usage() {
  cat <<EOF
${BOLD}Ralphy2${RESET} v${VERSION} - Simple Autonomous AI Coding Loop

${BOLD}USAGE:${RESET}
  ./ralphy2.sh [OPTIONS] [iterations]

${BOLD}OPTIONS:${RESET}
  -p, --prd FILE        PRD file (default: PRD.json)
  -d, --docker          Run in Docker sandbox (safe for AFK)
  --name NAME           Name for Docker container (for parallel runs)
  --no-mount-config     Don't mount ~/.claude into Docker
  --mount-docker        Mount Docker socket (for agent-browser, etc.)
  -e, --engine ENGINE   AI engine: claude, opencode (default: claude)
  -n, --dry-run         Show prompt without executing
  -h, --help            Show this help

${BOLD}MODES:${RESET}
  Default (sandbox)   OS-level sandbox + restricted tools (recommended)
  Docker (-d)         Full container isolation (for AFK/unattended runs)

${BOLD}EXAMPLES:${RESET}
  ./ralphy2.sh                    # Run 10 iterations (sandbox mode)
  ./ralphy2.sh 5                  # Run 5 iterations (sandbox mode)
  ./ralphy2.sh -d 20              # Run 20 iterations in Docker (full isolation)
  ./ralphy2.sh -n                 # Dry run - show prompt

${BOLD}PRD FORMAT:${RESET}
  {
    "context": { "name": "...", "description": "..." },
    "tasks": [
      { "category": "feature", "description": "...", "steps": [...], "passes": false }
    ]
  }
EOF
  exit 0
}

log_info()    { echo "${BLUE}[INFO]${RESET} $*"; }
log_success() { echo "${GREEN}[OK]${RESET} $*"; }
log_warn()    { echo "${YELLOW}[WARN]${RESET} $*"; }
log_error()   { echo "${RED}[ERROR]${RESET} $*" >&2; }

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -p|--prd) PRD_FILE="$2"; shift 2 ;;
    -d|--docker) USE_DOCKER=true; shift ;;
    --name) PROJECT_NAME="$2"; shift 2 ;;
    --no-mount-config) MOUNT_CLAUDE_CONFIG=false; shift ;;
    --mount-docker) MOUNT_DOCKER_SOCKET=true; shift ;;
    -e|--engine) AI_ENGINE="$2"; shift 2 ;;
    -n|--dry-run) DRY_RUN=true; shift ;;
    -h|--help) usage ;;
    [0-9]*) MAX_ITERATIONS="$1"; shift ;;
    *) log_error "Unknown option: $1"; exit 1 ;;
  esac
done

# Validate PRD file
if [[ ! -f "$PRD_FILE" ]]; then
  log_error "PRD file not found: $PRD_FILE"
  exit 1
fi

# Check for jq
if ! command -v jq &>/dev/null; then
  log_error "jq is required. Install with: brew install jq"
  exit 1
fi

# Create progress file if missing
if [[ ! -f "$PROGRESS_FILE" ]]; then
  log_warn "Creating $PROGRESS_FILE..."
  echo "# Progress Log" > "$PROGRESS_FILE"
  echo "# Created: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$PROGRESS_FILE"
  echo "" >> "$PROGRESS_FILE"
fi

# Get remaining task count
get_remaining_count() {
  jq '[.tasks[] | select(.passes == false)] | length' "$PRD_FILE" 2>/dev/null || echo 0
}

# Get current commit hash (empty if not a git repo or no commits)
get_commit_hash() {
  git rev-parse HEAD 2>/dev/null || echo ""
}

# Check if new commits were made since given hash
verify_commit() {
  local before_hash="$1"
  local after_hash
  after_hash=$(get_commit_hash)

  # Not a git repo
  if [[ -z "$after_hash" ]]; then
    log_warn "Not a git repository - skipping commit verification"
    return 0
  fi

  # No commits before (new repo)
  if [[ -z "$before_hash" ]]; then
    log_success "Commit created: ${after_hash:0:7}"
    return 0
  fi

  # Compare hashes
  if [[ "$before_hash" == "$after_hash" ]]; then
    log_warn "No commit created for this task!"
    return 1
  else
    local commit_msg
    commit_msg=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "")
    log_success "Commit: ${after_hash:0:7} - ${commit_msg:0:50}"
    return 0
  fi
}

# Mark task as complete
mark_task_complete() {
  local task_desc="$1"
  local tmpjson
  tmpjson=$(mktemp)
  # Use startswith for fuzzy matching (first 50 chars) to handle slight variations
  local match_prefix="${task_desc:0:50}"
  jq --arg prefix "$match_prefix" '
    (.tasks[] | select(.description | startswith($prefix))).passes = true
  ' "$PRD_FILE" > "$tmpjson" && mv "$tmpjson" "$PRD_FILE"
  log_success "Marked complete: ${task_desc:0:50}..."
}

# Build the prompt
build_prompt() {
  local context all_tasks

  context=$(jq -r '
    .context |
    "PROJECT: \(.name // "Unnamed")\n" +
    "DESCRIPTION: \(.description // "No description")\n" +
    (if .techStack then "TECH STACK: \(.techStack | join(", "))\n" else "" end)
  ' "$PRD_FILE" 2>/dev/null || echo "")

  all_tasks=$(jq -r '
    [.tasks[] | select(.passes == false)] |
    to_entries |
    map("[\(.key + 1)] \(.value.category | ascii_upcase): \(.value.description)\n    Steps: \(.value.steps | join("; "))") |
    join("\n\n")
  ' "$PRD_FILE" 2>/dev/null || echo "")

  cat <<EOF
@${PRD_FILE} @${PROGRESS_FILE}

${context}

REMAINING TASKS:
${all_tasks}

INSTRUCTIONS:
1. Review ALL remaining tasks above.
2. Pick the HIGHEST PRIORITY task to work on next. Consider:
   - Dependencies (what must be done first?)
   - Foundation before features
   - Current state of the codebase
3. Implement that task completely.
4. Run feedback loops (types, tests, lint) and fix any issues.
5. Append your progress to ${PROGRESS_FILE}.
6. Make a git commit with a descriptive message.

RULES:
- ONLY work on ONE task per iteration.
- Do NOT modify ${PRD_FILE}.
- Do NOT proceed if tests/types/lint fail. Fix issues first.
- Keep changes small and focused.

When done, output EXACTLY this format:
<completed>EXACT task description you completed</completed>

If ALL tasks in the PRD are done, output: <promise>ALL_COMPLETE</promise>
EOF
}

# Run AI command
run_ai() {
  local prompt="$1"

  case "$AI_ENGINE" in
    claude)
      if [[ "$USE_DOCKER" == true ]]; then
        # Docker sandbox: safe to allow everything - container is isolated
        local docker_opts=""

        # Mount Claude config for MCP servers
        if [[ "$MOUNT_CLAUDE_CONFIG" == true ]] && [[ -d "$HOME/.claude" ]]; then
          docker_opts="$docker_opts -v $HOME/.claude:/root/.claude:ro"
        fi

        # Mount git config for commits
        if [[ -f "$HOME/.gitconfig" ]]; then
          docker_opts="$docker_opts -v $HOME/.gitconfig:/root/.gitconfig:ro"
        fi

        # Mount SSH keys for git push
        if [[ -d "$HOME/.ssh" ]]; then
          docker_opts="$docker_opts -v $HOME/.ssh:/root/.ssh:ro"
        fi

        # Mount GitHub CLI config for gh commands
        if [[ -d "$HOME/.config/gh" ]]; then
          docker_opts="$docker_opts -v $HOME/.config/gh:/root/.config/gh:ro"
        fi

        # Mount Docker socket for running containers (agent-browser, etc.)
        if [[ "$MOUNT_DOCKER_SOCKET" == true ]]; then
          docker_opts="$docker_opts --mount-docker-socket"
        fi

        # Name the container for easier tracking in parallel runs
        if [[ -n "$PROJECT_NAME" ]]; then
          docker_opts="$docker_opts --name $PROJECT_NAME"
        fi

        docker sandbox run $docker_opts claude -p "$prompt" --dangerously-skip-permissions
      else
        # Sandbox mode: restricted tools + OS-level sandbox (if enabled via /sandbox)
        # Tool restrictions provide defense in depth
        # Enable OS-level sandbox with: claude /sandbox
        claude -p "$prompt" --allowedTools "Edit,Write,Read,Glob,Grep,Bash,TodoWrite,WebFetch,WebSearch,mcp__playwright__*"
      fi
      ;;
    opencode)
      echo "$prompt" | opencode
      ;;
    *)
      log_error "Unknown engine: $AI_ENGINE"
      exit 1
      ;;
  esac
}

# ============================================
# MAIN LOOP
# ============================================

remaining=$(get_remaining_count)
log_info "Starting Ralphy2 v${VERSION}"
if [[ -n "$PROJECT_NAME" ]]; then
  log_info "Project: $PROJECT_NAME | PRD: $PRD_FILE"
else
  log_info "PRD: $PRD_FILE | Engine: $AI_ENGINE"
fi
if [[ "$USE_DOCKER" == true ]]; then
  docker_features=""
  [[ "$MOUNT_CLAUDE_CONFIG" == true ]] && [[ -d "$HOME/.claude" ]] && docker_features="MCP"
  [[ -f "$HOME/.gitconfig" ]] && docker_features="${docker_features:+$docker_features+}git"
  [[ -d "$HOME/.ssh" ]] && docker_features="${docker_features:+$docker_features+}ssh"
  [[ -d "$HOME/.config/gh" ]] && docker_features="${docker_features:+$docker_features+}gh"
  [[ "$MOUNT_DOCKER_SOCKET" == true ]] && docker_features="${docker_features:+$docker_features+}docker"
  log_info "Mode: Docker (full isolation, ${docker_features:-basic})"
else
  log_info "Mode: Sandbox (OS-level + restricted tools)"
fi
log_info "Tasks remaining: $remaining | Max iterations: $MAX_ITERATIONS"
echo ""

if [[ "$remaining" -eq 0 ]]; then
  log_success "All tasks already complete!"
  exit 0
fi

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  remaining=$(get_remaining_count)

  if [[ "$remaining" -eq 0 ]]; then
    log_success "All tasks complete!"
    break
  fi

  echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo "${CYAN}Iteration $i/$MAX_ITERATIONS${RESET} | Remaining: $remaining tasks"
  echo "${BOLD}AI will pick highest priority task...${RESET}"
  echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""

  prompt=$(build_prompt)
  commit_before=$(get_commit_hash)

  if [[ "$DRY_RUN" == true ]]; then
    log_info "DRY RUN - Would send prompt:"
    echo "---"
    echo "$prompt"
    echo "---"
    exit 0
  fi

  # Run AI and capture output
  result=$(run_ai "$prompt" 2>&1) || true

  echo "$result"

  # Check for completion signals
  if [[ "$result" == *"<promise>ALL_COMPLETE</promise>"* ]]; then
    log_success "PRD complete! All tasks finished."
    exit 0
  fi

  # Extract completed task from <completed>...</completed> tag
  if [[ "$result" =~ \<completed\>(.+)\</completed\> ]]; then
    completed_task="${BASH_REMATCH[1]}"
    mark_task_complete "$completed_task"
    # Verify commit was created
    verify_commit "$commit_before"
  else
    log_warn "No <completed> tag found. Task may not have finished."
  fi

  echo ""
done

remaining=$(get_remaining_count)
if [[ "$remaining" -gt 0 ]]; then
  log_warn "Reached max iterations. $remaining tasks remaining."
else
  log_success "All tasks complete!"
fi

echo ""
echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo "${GREEN}Ralphy2 finished${RESET}"
echo "Completed: $(($(jq '[.tasks[] | select(.passes == true)] | length' "$PRD_FILE"))) tasks"
echo "Remaining: $(get_remaining_count) tasks"
echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
