var config = {
    version: 124,
    title: 'MineFi',
    apiurl: 'https://mineapit.filgame.xyz/api/v1/',
    // apiurl: 'http://localhost:54958/api/v1/',
}
config.isOnline = true //控制是否正式
if (config.isOnline) {
    config.apiurl = 'https://mineapi.filgame.xyz/api/v1/'
    // config.myapi = 'https://mineapi.filgame.xyz/api/v1/'
}

module.exports = config
