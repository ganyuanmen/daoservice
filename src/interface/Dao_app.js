const daolog = require("../utils");
const app_abi = require('../data/app_abi');
class Dao_app {

    async getAddress(_index, _version) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.selectedAccount });
        let result = await this.contract.methods.getAddress(_index, _version).call({ from: this.selectedAccount });
        return result;
    }
    

    async getVersionInfo(_index, _version) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.selectedAccount });
        let result = await this.contract.methods.getVersionInfo(_index, _version).call({ from: this.selectedAccount });
        return result;
    }

    async getAppInfo(_index) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.selectedAccount });
        let result = await this.contract.methods.getAppInfo(_index).call({ from: this.selectedAccount });
        return result;
    }

    addAppEvent(maxBlockNumber, callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.selectedAccount });
        this.addappObj = this.contract.events.AddApp({ filter: {}, fromBlock: maxBlockNumber + 1, }, async function (_error, data) {
            if (!data || !data.returnValues) {
                daolog.log("addAppEvent error");
                return;
            }

            let _address = await _this.getAddress(data.returnValues.index, '1')
            let _desc = await _this.getAppInfo(data.returnValues.index)
            // let _time=await  _this.web3.eth.getBlock(data.blockNumber)
            // let _account=await _this.web3.eth.getTransactionReceipt(data.transactionHash)
            callbackFun.call(null, {
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex": data.transactionIndex,
                "data": {
                    "indexRec": data.returnValues.indexRec,
                    "name": data.returnValues.name,
                    "index": data.returnValues.index,
                    "appAddress": _address?_address:'',
                    "manager": await daolog.getAccount(_this.web3,data.transactionHash),
                    "desc":_desc && _desc.desc?_desc.desc:'' ,
                    "time":await daolog.getTime(_this.web3,data.blockNumber)
                },
                "event": "addAppEvent"
            })
        })
    }

    unsub() {
        try {
            if (this.addappObj && this.addappObj.unsubscribe) {this.addappObj.unsubscribe();}
            this.addappObj = null;
        }catch (e) {console.log(e);}
    }
  

    constructor(_web3, _selectAccount,_address) {
        this.web3 = _web3;
        this.selectedAccount = _selectAccount;
        this.contract = undefined;

        this.addappObj = undefined;

        this.address =_address;
        this.abi = app_abi.abi
    }
}

module.exports = Dao_app