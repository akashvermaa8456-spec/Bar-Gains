Param(
  [string]$Message = "Harden auth & UX: disable dev confirm route, require auth for /apply, next-redirect after login, remove duplicate Dashboard logout",
  [string]$Branch = ""
)

# Ensure script runs from repo root where this script exists
Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git is not installed or not in PATH. Install Git: https://git-scm.com/download/win"
  exit 1
}

try {
  if (-not $Branch -or $Branch -eq "") {
    $Branch = git rev-parse --abbrev-ref HEAD
  }
} catch {
  Write-Error "Failed to determine current branch. Ensure this is a git repository."
  exit 1
}

Write-Host "Staging all changes..."
git add .
if ($LASTEXITCODE -ne 0) { Write-Error "git add failed"; exit 1 }

# Prepare commit message and trailer
$commitMsg = $Message
$trailer = "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

Write-Host "Committing with message: $commitMsg"
# Allow commit to fail harmlessly if there's nothing to commit
git commit -m "$commitMsg" -m "$trailer"
if ($LASTEXITCODE -ne 0) {
  Write-Warning "git commit exited non-zero. Possibly nothing to commit.\nCheck 'git status' locally. Exiting without pushing."
  exit 0
}

Write-Host "Pushing to origin/$Branch..."
git push origin $Branch
if ($LASTEXITCODE -ne 0) {
  Write-Error "git push failed. Check remote, branch, and authentication."
  exit 1
}

Write-Host "Done — changes pushed to origin/$Branch."