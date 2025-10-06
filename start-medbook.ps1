Write-Host "Starting MedBook Application..." -ForegroundColor Green

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'd:\MedScheduler\backend'; npm install; npm run dev"

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'd:\MedScheduler\frontend'; npm install; npm run dev"

Write-Host ""
Write-Host "MedBook Application Started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

Read-Host -Prompt "Press Enter to exit"