const daolog = require("../utils");
const register_abi=require('../data/register_abi');
const org_abi=require('../data/org_abi');
class Dao_register
{
    
async  getInfo(_id) {    
    if(!this.contract)  this.contract=new this.web3.eth.Contract(this.abi,this.address , {from: this.selectedAccount});
    let result = await this.contract.methods.getInfo(_id).call({from: this.selectedAccount});
    return result;
}

   
async  get_A_V(_id,_address) {    
  
    let _contract=new this.web3.eth.Contract(org_abi.abi,_address , {from: this.selectedAccount});
    let result=await _contract.methods.getAccounts_Votes().call({from: this.selectedAccount});
    let _acar=[];
    let _vtar=[];
    for(let i=0;i<result.length;i++)
    {
        if(parseInt(result[i]['vote'])>0) {
         _acar.push(result[i]["account"])
         _vtar.push(result[i]["vote"])
        } else break;
         
    }
   
    return {accounts:_acar,votes:_vtar};
}
   daoCreateEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
        this.installobj=this.contract.events.CreateOrg({
            filter: {}, 
            fromBlock: maxBlockNumber+1
        }, async function (_error, data) {
            if(!data || !data.returnValues) {
                daolog.log("CreateOrgEvent error",_error);
                return;
            }
            let _address=await _this.valuec.getOrg(data.returnValues.daoid);
            let _info=await  _this.getInfo(data.returnValues.daoid)
            let _accounts_votes= await _this.get_A_V(data.returnValues.daoid,_address)
            let _time=await  _this.web3.eth.getBlock(data.blockNumber)
        
   
            callbackFun.call(null,
              {                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "daoId": data.returnValues.daoid,
                    "manager":data.returnValues._manager,
                    "isToken":data.returnValues.token,
                    "name":_info.name,
                    "symbol":_info.symbol,
                    "describe":_info.desc,
                    "accounts_votes":_accounts_votes,
                    "time":_time.timestamp,
                    "address":_address
                }
               ,
               "event": "CreateOrgEvent"}
                )
        })
    }


   unsub()
   {
       try{
           if(this.installobj && this.installobj.unsubscribe) {this.installobj.unsubscribe();}
           this.installobj=null;
       } catch(e){console.log(e);}
   }


    constructor(_web3,_selectAccount,_value,_address) {
        this.web3=_web3;
        this.valuec=_value;
        this.selectedAccount=_selectAccount;
        this.contract=undefined;    

        this.installobj=undefined;
      
        this.address=_address;
        this.abi=register_abi.abi
    }
}

module.exports=Dao_register