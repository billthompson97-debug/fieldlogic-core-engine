Write-Host "FieldLogic local update starting..." -ForegroundColor Cyan

Write-Host "Pulling latest code from GitHub..." -ForegroundColor Yellow
git pull

if ($LASTEXITCODE -ne 0) {
  Write-Host "Git pull failed. Stop here and review the error above." -ForegroundColor Red
  exit 1
}

Write-Host "Applying local database migrations..." -ForegroundColor Yellow
npm run db:migrate:local

if ($LASTEXITCODE -ne 0) {
  Write-Host "Database migration failed. Stop here and review the error above." -ForegroundColor Red
  exit 1
}

Write-Host "Update complete." -ForegroundColor Green
Write-Host "Next step: run npm run dev" -ForegroundColor Cyan
