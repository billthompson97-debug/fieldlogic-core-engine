$BaseUrl = "http://localhost:8787"

Write-Host "FieldLogic runtime test starting..." -ForegroundColor Cyan

function Test-Endpoint {
  param(
    [string]$Name,
    [string]$Uri
  )

  Write-Host "Testing $Name..." -ForegroundColor Yellow

  try {
    $response = Invoke-WebRequest -Uri $Uri -UseBasicParsing
    Write-Host "PASS: $Name" -ForegroundColor Green
    return $response.Content
  }
  catch {
    Write-Host "FAIL: $Name" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    return $null
  }
}

Test-Endpoint -Name "Root Runtime" -Uri "$BaseUrl/"
Test-Endpoint -Name "Daily Brief Text" -Uri "$BaseUrl/runtime/daily-brief-text"
Test-Endpoint -Name "Daily Action List" -Uri "$BaseUrl/runtime/daily-action-list"
Test-Endpoint -Name "Urgent Jobs" -Uri "$BaseUrl/runtime/urgent-jobs"
Test-Endpoint -Name "Operations Owner View" -Uri "$BaseUrl/runtime/owner/operations"
Test-Endpoint -Name "Service Owner View" -Uri "$BaseUrl/runtime/owner/service"
Test-Endpoint -Name "Production Owner View" -Uri "$BaseUrl/runtime/owner/production"
Test-Endpoint -Name "Action Outcomes" -Uri "$BaseUrl/runtime/action-outcomes"

Write-Host "Runtime test complete." -ForegroundColor Cyan
Write-Host "If all tests show PASS, FieldLogic local runtime is healthy." -ForegroundColor Green
