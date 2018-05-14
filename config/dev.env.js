var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    LOCAL_HOST: '"http://localhost:8081"',
    API_HOST: '"http://192.168.255.128:8000/api"',
    APP_NAME: '"知识库"'
})
