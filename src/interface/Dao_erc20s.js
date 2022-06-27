const erc20s_abi=require('../data/erc20s_abi');
const daolog = require("../utils");
class Dao_erc20s
{
    async balanceOf(_id,_address) {
        if(!this.contract)  this.contract=new this.web3.eth.Contract(this.abi,this.address , {from: this.selectedAccount});
        let result= await this.contract.methods.balanceOf(_id,_address).call({from: this.selectedAccount});
        return {token: this.web3.utils.fromWei(result,'ether'),tokenWei:result};

    }

    publishTokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;  
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.tObj=this.contract.events.Issue({filter: {},fromBlock: maxBlockNumber+1}, function (_error, data) {   
            if(!data || !data.returnValues) {
                daolog.log("publishTokenEvent error");
                return;
            }        
            callbackFun.call(null, {
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex": data.transactionIndex,
                "data": {
                    "tokenId": data.returnValues.tokenId,
                    "daoId": data.returnValues.id,
                    "timestamp": data.returnValues.time
                },
                "event": "publishTokenEvent"
            })
         })
    }
    unsub()
    {
        try{
            if(this.tObj && this.tObj.unsubscribe){this.tObj.unsubscribe();}
            this.tObj=null;
        }catch(e){console.log(e);}
    }


    constructor(_web3,_selectAccount,_address) {
        this.web3=_web3;
        this.contract=undefined;
        this.tObj=undefined;
        this.selectedAccount=_selectAccount;

        this.address=_address;
        this.abi=erc20s_abi.abi
    }
}

module.exports=Dao_erc20s