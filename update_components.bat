@echo off
echo Updating HTML files with components...

REM List of HTML files to update
set HTML_FILES=privacy.html returns.html shipping.html terms.html payment.html

REM Loop through each HTML file and update it
for %%F in (%HTML_FILES%) do (
    echo Processing %%F...
    
    REM Replace header section with placeholder
    powershell -Command "(Get-Content '%%F') -replace '(?s)<!-- Header -->.*?</header>', '<!-- Header Placeholder -->\r\n<div id=\"header-placeholder\"></div>' | Set-Content '%%F'"
    
    REM Replace footer section with placeholder
    powershell -Command "(Get-Content '%%F') -replace '(?s)<!-- Footer -->.*?</footer>', '<!-- Footer Placeholder -->\r\n<div id=\"footer-placeholder\"></div>' | Set-Content '%%F'"
    
    REM Add component.js script before the closing body tag
    powershell -Command "(Get-Content '%%F') -replace '<script src=\"js/animations.js\"></script>', '<script src=\"js/i18n-config.js\"></script>\r\n    <script src=\"js/i18n.js\"></script>\r\n    <script src=\"js/components.js\"></script>\r\n    <script src=\"js/animations.js\"></script>' | Set-Content '%%F'"
    
    echo %%F updated successfully.
)

echo All HTML files have been updated with components.
pause
