const daolog = require("../utils");
const eventSum_abi=require('../data/eventSum_abi');
class Dao_eventSum
{
   
  async  execEvent(maxBlockNumber,callbackFun) {

        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.execobj=this.contract.events.Exec({filter: {}, fromBlock: maxBlockNumber+1}, async function (_error, data) {
         
            if(!data || !data.returnValues) {
                daolog.log("execEvent error");
                return;
            }
            // let _from='';
            // let addressObj=await  _this.web3.eth.getTransactionReceipt(data.transactionHash);
            // if(!addressObj) addressObj=await  _this.web3.eth.getTransactionReceipt(data.transactionHash);
            // if(!addressObj) addressObj=await  _this.web3.eth.getTransactionReceipt(data.transactionHash);
            // if(addressObj && addressObj.from) _from=addressObj.from;
            // let _timestamp=(new Date()).getTime().toString().substring(0,10)
            // let timeObj= await _this.web3.eth.getBlock(data.blockNumber);
            // if(!timeObj)  timeObj= await _this.web3.eth.getBlock(data.blockNumber);
            // if(timeObj && timeObj.timestamp) _timestamp=timeObj.timestamp;
 
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "proDel": data.returnValues.index,
                    "voteDel":data.returnValues.voteDel,
                    "address":await daolog.getAccount(_this.web3,data.transactionHash),
                    "time":await daolog.getTime(_this.web3,data.blockNumber)
                },
                "event": "execEvent"})
            })
    }

    unsub()
    {
        try{
            if(this.execobj && this.execobj.unsubscribe){this.execobj.unsubscribe();}
            this.execobj=null;
        } catch(e){console.log(e);}
    }
    constructor(_web3,_selectAccount,_address) {
        this.web3=_web3;
        this.selectedAccount=_selectAccount;
        this.contract=undefined;    
      
        this.execobj=undefined;

        this.address=_address;
        this.abi=eventSum_abi.abi
    }
}

module.exports=Dao_eventSum