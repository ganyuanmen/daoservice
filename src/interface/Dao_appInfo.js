
const appInfo_abi = require('../data/appInfo_abi');
class Dao_appInfo
{
    async  getInfo(_daoId,_appindex) {  
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.selectedAccount });
        let result = await this.contract.methods.getInfo(_daoId,_appindex).call({ from: this.selectedAccount });
        return result;

   }

 
   
   constructor(_web3, _selectAccount,_address) {
    this.web3 = _web3;
    this.selectedAccount = _selectAccount;
    this.contract = undefined;
    this.address =_address;
    this.abi =appInfo_abi.abi
    }

}

module.exports=Dao_appInfo