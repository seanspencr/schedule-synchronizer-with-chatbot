@echo off
setlocal

if exist ../.env (
    for /f "usebackq tokens=1,* delims==" %%A in ("../.env") do (
        set "%%A=%%B"
    )
) else (
    echo .env file not found!
)

echo My URL is: %SUPABASE_URL%
echo My Key is: %SUPABASE_KEY%
echo My Postgres URL is: %POSTGRES_URL%

rem sqlacodegen --schema=calendar_synchronizer %POSTGRES_URL% > models.py
sqlacodegen --schema=calendar_synchronizer --generator sqlmodels %POSTGRES_URL% > database_model.py

endlocal

