$basePath = "backend\src"

# 1. Replace Content in Files
Write-Host "Replacing content in Java files..."
Get-ChildItem -Path $basePath -Recurse -Filter "*.java" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $newContent = $content -replace "package com.applytrack", "package com.applyfollow" `
                           -replace "import com.applytrack", "import com.applyfollow"
    
    if ($content -ne $newContent) {
        Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated: $($_.Name)"
    }
}

# 2. Rename Directories
Write-Host "Renaming directories..."
$mainOld = "backend\src\main\java\com\applytrack"
$mainNew = "backend\src\main\java\com\applyfollow"

if (Test-Path $mainOld) {
    Move-Item -Path $mainOld -Destination $mainNew
    Write-Host "Moved main package to $mainNew"
} else {
    Write-Host "Main package path not found or already moved."
}

$testOld = "backend\src\test\java\com\applytrack"
$testNew = "backend\src\test\java\com\applyfollow"

if (Test-Path $testOld) {
    Move-Item -Path $testOld -Destination $testNew
    Write-Host "Moved test package to $testNew"
} else {
    Write-Host "Test package path not found or already moved."
}
