const Url = require('url');

const api = 'http://qdev.core.myrtb.net/basis/config?secretkey=E3yN5mGvl4UgwQK7';

const url = Url.parse(api, true);

console.log(url);