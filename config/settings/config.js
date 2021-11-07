const path = require('path');
const dotenv = require('dotenv').config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});

module.exports = {
    development: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || '127.0.0.1',
    },
    production: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        HOST: process.env.HOST || '127.0.0.1',
    }
    
}