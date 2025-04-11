require('dotenv').config();

module.exports = {
    // Speech Service Configuration
    speech: {
        region: process.env.AZURE_SPEECH_REGION || 'eastasia',
        subscriptionKey: process.env.AZURE_SPEECH_KEY || '3169dff8eb2e4b899157cfcee2a68e4f',
        endpoint: process.env.AZURE_SPEECH_ENDPOINT || 'https://eastasia.api.cognitive.microsoft.com/'
    },

    // App Service Configuration
    appService: {
        name: process.env.AZURE_APP_NAME,
        resourceGroup: process.env.AZURE_RESOURCE_GROUP,
        subscriptionId: process.env.AZURE_SUBSCRIPTION_ID
    },

    // Database Configuration (if using Azure MySQL)
    database: {
        host: process.env.AZURE_DB_HOST,
        user: process.env.AZURE_DB_USER,
        password: process.env.AZURE_DB_PASSWORD,
        database: process.env.AZURE_DB_NAME,
        ssl: true
    },

    // Azure Storage (for files and images)
    storage: {
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        container: process.env.AZURE_STORAGE_CONTAINER || 'hospital-files'
    }
}; 