const logo_abi=require('../data/logo_abi');
const daolog = require("../utils");
const JSZip= require('jszip')

 class Logos {
    async getLogo(id) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.selectedAccount });
        let re = await this.contract.methods.getFile(id).call({ from: this.selectedAccount });
        let result = await this._getLogo(re[0], re[1]);
        return { src: result };
    }
    async _getLogo(_type, _fileStr) {

        let result = await this.get_real_file(_type, _fileStr);
        return result;
    }


    get_real_file(file_type, bytesStr) {

        let p = new Promise(function (resolve, reject) {
            let len = bytesStr.length / 2 - 1;
            let array = new Uint8Array(len);
            for (let k = 0; k < len; k++) {
                array[k] = parseInt(bytesStr.substr(2 + k * 2, 2), 16);
            }
            if (file_type == 'zip') {
             
                let new_zip = new JSZip();

                new_zip.loadAsync(Buffer.from(array.buffer))
                    .then(function (mzip) {

                        let fname = Object.keys(mzip.files)[0];

                        mzip.file(fname).async("nodebuffer").then(blob => {
                            let _a = fname.split('.');
                            let _b = _a[_a.length - 1];
                            if (_b == 'svg') {
                                resolve('data:image/svg+xml;base64,' + blob.toString('base64'))
                            } else {
                                resolve('data:image/' + _b + ';base64,' + blob.toString('base64'))
                            }

                        });
                    });

            } else {
                resolve('data:image/' + file_type + ';base64,' + Buffer.from(array.buffer).toString('base64'))
            }
        });
        return p
    }
   

   

   setLogoEvent(maxBlockNumber,callbackFun) {
    const _this = this;
    if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
    this.eventObj1=this.contract.events.SetLogo({filter: {},fromBlock: maxBlockNumber+1}, function (_error, data) {  
        if(!data || !data.returnValues) {
            daolog.log("setLogoEvent error");
            return;
        }
        _this.getLogo(data.returnValues.id).then(e=>{
            callbackFun.call(null, {
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex": data.transactionIndex,
                "data": {
                    "daoId": data.returnValues.id,
                    "src": e.src,
                    "timestamp": data.returnValues.time
                },
                "event": "setLogoEvent"
            })
        })  
    })
   
   }


   changeLogoEvent(maxBlockNumber,callbackFun) {
    const _this = this;
    if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.selectedAccount});
    this.eventObj2=this.contract.events.ChangeLogo({filter: {},fromBlock: maxBlockNumber+1}, function (_error, data) { 
        if(!data || !data.returnValues) {
            daolog.log("changeLogoEvent error");
            return;
        }
        _this.getLogo(data.returnValues.id).then(e=>{
            callbackFun.call(null,{                  
                "address": data.address,
                "blockHash": data.blockHash,
                "blockNumber": data.blockNumber,
                "transactionHash": data.transactionHash,
                "transactionIndex":data.transactionIndex,
                "data": {
                    "daoId": data.returnValues.id,
                    "src":e.src,
                    "timestamp":data.returnValues.time
                },
                "event": "changeLogoEvent"
            })  
        })      
    })
   
   }

   unsub()
        {
            try{
                this.eventObj1.unsubscribe();
                if(this.eventObj2 && this.eventObj2.unsubscribe){this.eventObj2.unsubscribe();}
                if(this.eventObj1 && this.eventObj1.unsubscribe){this.eventObj1.unsubscribe();}
                this.eventObj2=null;
                this.eventObj1=null;
            }catch(e){console.log(e);}
        }
        
    constructor(_web3,_selectAccount,_address) {
        this.web3=_web3;
        this.contract=undefined;

        this.eventObj1=undefined;
        this.eventObj2=undefined

        this.selectedAccount=_selectAccount;
        this.address = _address;
        this.abi=logo_abi.abi

    }
}

module.exports=Logos