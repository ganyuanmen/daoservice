'use strict';
const Dao_register = require('./interface/Dao_register');
const Dao_app = require('./interface/Dao_app');
const Dao_erc20s = require('./interface/Dao_erc20s');
const Dao_logo = require('./interface/Dao_logo');
const Dao_iadd = require('./interface/Dao_iadd');
const Dao_uToken = require('./interface/Dao_uToken');
const Dao_eventSum = require('./interface/Dao_eventSum');
const Dao_value = require('./interface/Dao_value');
const Dao_appInfo = require('./interface/Dao_appInfo');
const daismAddress = require('./data/address');

class DaoApi {
    unsub() {
        this.dao_register.unsub();
        this.dao_app.unsub();
        this.dao_logo.unsub();
        this.dao_erc20s.unsub();
        this.dao_iadd.unsub();
        this.dao_uToken.unsub();
        this.dao_eventSum.unsub();

    }

    get dao_appInfo() { if (!this.dao_appInfo_obj) this.dao_appInfo_obj = new Dao_appInfo(this.web3, this.selectedAccount,daismAddress[this.network]['appInfo']); return this.dao_appInfo_obj; }
    get dao_value() { if (!this.dao_value_obj) this.dao_value_obj = new Dao_value(this.web3, this.selectedAccount,daismAddress[this.network]['value']); return this.dao_value_obj; }
    get dao_register() { if (!this.dao_register_obj) this.dao_register_obj = new Dao_register(this.web3, this.selectedAccount,this.dao_value,daismAddress[this.network]['register']); return this.dao_register_obj; }
    get dao_app() { if (!this.dao_app_obj) this.dao_app_obj = new Dao_app(this.web3, this.selectedAccount,daismAddress[this.network]['app']); return this.dao_app_obj; }
    get dao_logo() { if (!this.dao_logo_obj) this.dao_logo_obj = new Dao_logo(this.web3, this.selectedAccount,daismAddress[this.network]['logo']); return this.dao_logo_obj; }
    get dao_erc20s() { if (!this.dao_erc20s_obj) this.dao_erc20s_obj = new Dao_erc20s(this.web3, this.selectedAccount,daismAddress[this.network]['erc20s']); return this.dao_erc20s_obj; }
    get dao_iadd() { if (!this.dao_iadd_obj) this.dao_iadd_obj = new Dao_iadd(this.web3, this.selectedAccount,daismAddress[this.network]['iadd']); return this.dao_iadd_obj; }
    get dao_uToken() { if (!this.dao_uToken_obj) this.dao_uToken_obj = new Dao_uToken(this.web3, this.selectedAccount,daismAddress[this.network]['uToken']); return this.dao_uToken_obj; }
    get dao_eventSum() { if (!this.dao_eventSum_obj) this.dao_eventSum_obj = new Dao_eventSum(this.web3, this.selectedAccount,daismAddress[this.network]['eventSum']); return this.dao_eventSum_obj; }
 
    get version(){return '1.0.16';}

    constructor(_web3, _selectAccount,_network) {
        this.web3 = _web3;
        this.selectedAccount = _selectAccount;
        this.network=_network

        this.dao_register_obj=null;
        this.dao_app_obj=null;
        this.dao_erc20s_obj=null;
        this.dao_logo_obj=null;
        this.dao_iadd_obj=null;
        this.dao_uToken_obj=null;
        this.dao_eventSum_obj=null;
        this.dao_value_obj=null;
        this.dao_appInfo_obj=null;
    }
}


if (typeof window === 'object') {
    window.Daoapi = function (_web3, _selectAccount,_network) {
        return new DaoApi(_web3, _selectAccount,_network)
    }

    window.Daoapi.default = window.Daoapi;
}

module.exports = DaoApi