@echo off
set /p msg="Enter commit message: "

npm run build
git add .
git commit -m "%msg%"
git push -u origin main
pause