# Load environment variables from .env file
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            [System.Environment]::SetEnvironmentVariable($name, $value)
        }
    }
}

# Azure Login (if not already logged in)
Write-Host "Checking Azure login status..."
$loginStatus = az account show 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Logging into Azure..."
    az login
}

# Set subscription
Write-Host "Setting Azure subscription..."
az account set --subscription $env:AZURE_SUBSCRIPTION_ID

# Create Resource Group if it doesn't exist
Write-Host "Creating/checking resource group..."
az group create --name $env:AZURE_RESOURCE_GROUP --location eastasia

# Create MySQL Database
Write-Host "Creating Azure MySQL database..."
az mysql flexible-server create `
    --resource-group $env:AZURE_RESOURCE_GROUP `
    --name $env:AZURE_DB_NAME `
    --admin-user $env:AZURE_DB_USER `
    --admin-password $env:AZURE_DB_PASSWORD `
    --sku-name Standard_B1ms `
    --version 8.0

# Create Storage Account
Write-Host "Creating Azure Storage account..."
az storage account create `
    --name $env:AZURE_STORAGE_NAME `
    --resource-group $env:AZURE_RESOURCE_GROUP `
    --location eastasia `
    --sku Standard_LRS

# Deploy Web App
Write-Host "Deploying web application..."
az webapp up `
    --name $env:AZURE_APP_NAME `
    --resource-group $env:AZURE_RESOURCE_GROUP `
    --plan $env:AZURE_APP_NAME-plan `
    --sku B1

# Configure Web App Settings
Write-Host "Configuring application settings..."
az webapp config appsettings set `
    --name $env:AZURE_APP_NAME `
    --resource-group $env:AZURE_RESOURCE_GROUP `
    --settings `
        AZURE_SPEECH_REGION=$env:AZURE_SPEECH_REGION `
        AZURE_SPEECH_KEY=$env:AZURE_SPEECH_KEY `
        AZURE_SPEECH_ENDPOINT=$env:AZURE_SPEECH_ENDPOINT `
        AZURE_DB_HOST=$env:AZURE_DB_HOST `
        AZURE_DB_USER=$env:AZURE_DB_USER `
        AZURE_DB_PASSWORD=$env:AZURE_DB_PASSWORD `
        AZURE_DB_NAME=$env:AZURE_DB_NAME `
        AZURE_STORAGE_CONNECTION_STRING=$env:AZURE_STORAGE_CONNECTION_STRING

Write-Host "Deployment completed successfully!" 