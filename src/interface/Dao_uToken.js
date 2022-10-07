const uToken_abi=require('../data/uToken_abi');
const daolog = require("../utils");
 class Dao_uToken
{
    swapEvent(maxBlockNumber,callbackFun) {
      
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.swapObj=this.contract.events.Swap({filter: {},fromBlock: maxBlockNumber+1}, function (_error, data) {
            if(!data || !data.returnValues) {
                daolog.log("swapEvent error");
                return;
            }
          
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "address": data.returnValues[0],
                    "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[1],'ether')).toFixed(4), 
                    "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(4),
                    "swapTime":data.returnValues[3]
                },
                "event": "swapEvent"
            })
        })
    }

    swapToEvent(maxBlockNumber,callbackFun) {
      
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.swapobjTo=this.contract.events.SwapTo({filter: {},fromBlock: maxBlockNumber+1},async function (_error, data) {
            if(!data || !data.returnValues) {
                daolog.log("swapEvent error");
                return;
            }
           // _this.web3.eth.getTransactionReceipt(data.transactionHash).then(eobj=>{
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "address":await daolog.getAccount(_this.web3,data.transactionHash),
                    "to": data.returnValues[1],
                    "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(4), 
                    "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[3],'ether')).toFixed(4),
                    "swapTime":data.returnValues[4]
                },
                "event": "swapToEvent"})
          // })
        })
    }

    swapDethEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.dethswapObj=this.contract.events.SwapDETHTo({filter: {}, fromBlock: maxBlockNumber+1}, function (_error, data) {
            if(!data || !data.returnValues) {
                daolog.log("swapDethEvent error");
                return;
            }
           // console.log(data)
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "fromAddress": data.returnValues[0],
                    "toAddress": data.returnValues[1],
                    "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(4),
                    "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[3],'ether')).toFixed(4),
                    "swapTime":data.returnValues[4]
                },
                "event": "swapDethEvent"
            })
        })
    }

       
    unsub()
    {
        try{
            if(this.swapObj && this.swapObj.unsubscribe)
            {
                this.swapObj.unsubscribe();
            }
            if(this.dethswapObj && this.dethswapObj.unsubscribe)
            {
                this.dethswapObj.unsubscribe();
            }
            if(this.swapobjTo && this.swapobjTo.unsubscribe)
            {
                this.swapobjTo.unsubscribe();
            }
            this.swapObj=null;
            this.dethswapObj=null;
            this.swapobjTo=null;
        }
        catch(e){
            console.log(e);
        }
    }

    setAddress(_address)
    {
        this.address=_address;
    }
    setAbi(_abi)
    {
        this.abi=_abi;
    }
    constructor(_web3,_selectAccount,_address) {
        daolog.log("utoken start....");
        this.web3=_web3;
        this.contract=undefined;
        this.swapObj=undefined;
        this.swapobjTo=undefined;
        this.dethswapObj=undefined;
        this.selectedAccount=_selectAccount;
        this.address=_address;
        this.abi=uToken_abi.abi
      }
  }
  
  module.exports=Dao_uToken