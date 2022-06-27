const iadd_abi=require('../data/iadd_abi');
const daolog = require("../utils");
class Dao_iadd
{
    utokenTotokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.u2tObj=this.contract.events.UToToken({filter: {},fromBlock: maxBlockNumber+1}, function (_error, data) {
            if(!data || !data.returnValues) {
                daolog.log("utokenTotokenEvent error");
                return;
            }
            _this.web3.eth.getBlock(data.blockNumber).then(ee=>{
                callbackFun.call(null,{                  
                    "address": data.address,
                    "blockHash": data.blockHash,
                    "blockNumber": data.blockNumber,
                    "transactionHash": data.transactionHash,
                    "transactionIndex":data.transactionIndex,
                    "data": {
                        "from": data.returnValues.spender,
                        "to": data.returnValues.to,
                        "swap_time":ee.timestamp,
                        "tokenId":data.returnValues.id,
                        "utokenWei":data.returnValues.uAmount,
                        "tokenWei":data.returnValues.tokenAmount,
                        "utoken":parseFloat(_this.web3.utils.fromWei(data.returnValues.uAmount,'ether')).toFixed(4),
                        "token":parseFloat(_this.web3.utils.fromWei(data.returnValues.tokenAmount,'ether')).toFixed(4)
                    },
                    "event": "utokenTotokenEvent"})
            })
        })
    }

    tokenToUtokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.t2uObj=this.contract.events.TokenToU({filter: {}, fromBlock: maxBlockNumber+1}, function (_error, data) {  
            if(!data || !data.returnValues) {
                daolog.log("tokenToUtokenEvent error");
                return;
            }   
            _this.web3.eth.getBlock(data.blockNumber).then(ee=>{
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "from": data.returnValues.spender,
                    "to": data.returnValues.to,
                    "swap_time":ee.timestamp,
                    "tokenId":data.returnValues.id,
                    "utokenWei":data.returnValues.uAmount,
                    "tokenWei":data.returnValues.tokenAmount,
                    "utoken":parseFloat(_this.web3.utils.fromWei(data.returnValues.uAmount,'ether')).toFixed(4),
                    "token":parseFloat(_this.web3.utils.fromWei(data.returnValues.tokenAmount,'ether')).toFixed(4)
                },
                "event": "tokenToUtokenEvent"})
            })
        })
    }

    tokenTotokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
      
        this.t2tObj=this.contract.events.ETokenToToken({filter: {}, fromBlock: maxBlockNumber+1}, function (_error, data) {  
            if(!data || !data.returnValues) {
                daolog.log("tokenTotokenEvent error");
                return;
            }   
            _this.web3.eth.getBlock(data.blockNumber).then(ee=>{
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "from": data.returnValues.spender,
                    "to": data.returnValues.to,
                    "swap_time":ee.timestamp,
                    "fromTokenId":data.returnValues.id,
                    "toTokenId":data.returnValues.swapid,
                    "fromtokenWei":data.returnValues.tokenAmount,
                    "toTokenWei":data.returnValues.swapTokenAmount,
                    "fromToken":parseFloat(_this.web3.utils.fromWei(data.returnValues.tokenAmount,'ether')).toFixed(4),
                    "toToken":parseFloat(_this.web3.utils.fromWei(data.returnValues.swapTokenAmount,'ether')).toFixed(4)
                },
                "event": "tokenTotokenEvent"})
            })
        })
    }

    getReal(v){
        var b=v.split('');
        for(var i=1;i<b.length;i++)
             {
                 if(b[i]!='0')
                 break               
             }
        return v.substr(i);

    }

    async getPool(_id) {
        if(!this.contract)  this.contract=new this.web3.eth.Contract(this.abi,this.address , {from: this.selectedAccount});
        let result= await this.contract.methods.getPool(_id).call({from: this.selectedAccount});
        return {utoken: this.web3.utils.fromWei(this.getReal(result.uToken),'ether'),utokenWei:this.getReal(result.uToken)};
    
    }
       
    unsub()
    {
        try{
            if(this.u2tObj && this.u2tObj.unsubscribe){this.u2tObj.unsubscribe();}
            if(this.t2uObj && this.t2uObj.unsubscribe){this.t2uObj.unsubscribe();}
            if(this.t2tObj && this.t2tObj.unsubscribe){this.t2tObj.unsubscribe();}
            this.u2tObj=null;
            this.t2uObj=null;
            this.t2tObj=null;
        }catch(e){console.log(e);}
    }

    constructor(_web3,_selectAccount,_address) {
        this.web3=_web3;
        this.selectedAccount=_selectAccount;
        this.u2tObj=undefined;
        this.t2uObj=undefined;
        this.t2tObj=undefined;
        this.contract=undefined;

        this.address=_address;
     
        this.abi=iadd_abi.abi
       }
   }
   
   module.exports=Dao_iadd