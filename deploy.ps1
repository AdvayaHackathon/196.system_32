# Azure Deployment Script
# Prerequisites: Azure CLI must be installed and logged in

# Variables
$resourceGroup = "CareLink1"
$location = "eastasia"
$appName = "carelink3"
$sqlServerName = "carelink3-server"
$sqlDatabaseName = "carelink"
$sqlAdminUser = "carelink_admin"
$sqlAdminPassword = "CareLink@2024"

# Create Resource Group if it doesn't exist
az group create --name $resourceGroup --location $location

# Create Azure SQL Server with public network access
az sql server create `
    --name $sqlServerName `
    --resource-group $resourceGroup `
    --location $location `
    --admin-user $sqlAdminUser `
    --admin-password $sqlAdminPassword `
    --enable-public-network true

# Configure SQL Server firewall to allow Azure services
az sql server firewall-rule create `
    --resource-group $resourceGroup `
    --server $sqlServerName `
    --name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Create SQL Database
az sql db create `
    --name $sqlDatabaseName `
    --resource-group $resourceGroup `
    --server $sqlServerName `
    --edition Basic `
    --capacity 5

# Create App Service Plan
az appservice plan create `
    --name "${appName}-plan" `
    --resource-group $resourceGroup `
    --location $location `
    --sku B1 `
    --is-linux

# Create Web App for Backend
az webapp create `
    --name $appName `
    --resource-group $resourceGroup `
    --plan "${appName}-plan" `
    --runtime "NODE|18-lts"

# Create Web App for Frontend
az webapp create `
    --name "${appName}-frontend" `
    --resource-group $resourceGroup `
    --plan "${appName}-plan" `
    --runtime "NODE|18-lts"

# Get the outbound IP addresses of the App Service
$outboundIPs = az webapp show --name $appName --resource-group $resourceGroup --query "outboundIpAddresses" -o tsv
$outboundIPs = $outboundIPs -split ","

# Add firewall rules for each outbound IP
foreach ($ip in $outboundIPs) {
    $ruleName = "AllowAppService_$($ip -replace '\.', '_')"
    az sql server firewall-rule create `
        --resource-group $resourceGroup `
        --server $sqlServerName `
        --name $ruleName `
        --start-ip-address $ip `
        --end-ip-address $ip
}

# Configure environment variables for backend
$connectionString = "Server=tcp:$sqlServerName.database.windows.net,1433;Initial Catalog=$sqlDatabaseName;Persist Security Info=False;User ID=$sqlAdminUser;Password=$sqlAdminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
az webapp config appsettings set `
    --name $appName `
    --resource-group $resourceGroup `
    --settings "DB_CONNECTION_STRING=$connectionString" @backend/.env

# Configure environment variables for frontend
az webapp config appsettings set `
    --name "${appName}-frontend" `
    --resource-group $resourceGroup `
    --settings @frontend/.env

Write-Host "Azure resources have been created successfully!"
Write-Host "Next steps:"
Write-Host "1. Verify the SQL Server firewall rules are properly configured"
Write-Host "2. Test the database connection from your application"
Write-Host "3. Monitor the application logs for any connection issues" 