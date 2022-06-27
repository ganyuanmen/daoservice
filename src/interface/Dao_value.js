const value_abi=require('../data/value_abi');
class Dao_value
{
 
   async  getOrg(org_id) {    
    if(!this.contract)  this.contract=new this.web3.eth.Contract(this.abi,this.address , {from: this.selectedAccount});   
    let result = await this.contract.methods.getOrg(org_id).call({from: this.selectedAccount});
    return result;
}


    constructor(_web3,_selectAccount,_address) {
        this.web3=_web3;
        this.selectedAccount=_selectAccount;
        this.contract=undefined;    
    
        this.address=_address;
        this.abi=value_abi.abi
    }
}

module.exports=Dao_value