
# 道易程事件监听（daoservice）

daoservice 是一个专门用于监听道易程操作智能合约产生的事件， 返回完成操作后的相应信息。用户可以把这些信息记录于本地数据库上，便于网站的查找和展示。

## 安装 daoservice
```js
npm install daoservice --save
或
yarn add daoservice

```

## 安装依赖包
 > daoservice 依赖 web3.js 和 jszip.js, 需要安装依赖包

```js
npm install web3@1.6.1 --save 或 yarn add web3@1.6.1
npm install jszip --save 或 yarn add jszip
```

## node 使用示例

 ```js
const Web3 = require('web3')
const DaoService = require("daoservice")

var daoservice
var web3

async function run() {
  //取消之前的订阅
  if (daoservice && daoservice.unsub) 
  {
    daoservice.unsub()
  }
  //等待web3关闭
  if (web3 && web3.currentProvider && web3.currentProvider.close) 
  {
    await web3.currentProvider.close();
  }

  web3 = await new Web3("wss://goerli.infura.io/ws/v3/9676a35d629d488fb90d7eac1348c838");
  const selectAcouunt = '0x75EFcbeC4961D6FD3B77F271ce9e5cb7458cb69E'
  let _network="goerli" // 允许取值goerli,ropsten,mainnet,local, 保存在src/data/address.js
  daoservice=new DaoService(web3,selectAcouunt,_network) 

  //daoCreateEvent dao 注册信息
  daoservice.dao_register.daoCreateEvent(0, (data) => {
      console.log(data)
  });

  //setlogo 图片设置
  daoservice.dao_logo.setLogoEvent(0, data => {
      console.log(data);
  })

  //chanelogo 图片修改
  daoservice.dao_logo.changeLogoEvent(0, data => {
      console.log(data);
  })

  // publishtoken 发布token
  daoservice.dao_erc20s.publishTokenEvent(0, data => {
    console.log(data);
  })

  //u2t utoken 兑换 token
  daoservice.dao_iadd.utokenTotokenEvent(0, async data => {
      console.log(data);
  })

  //t2u token 兑换 utoken
  daoservice.dao_iadd.tokenToUtokenEvent(0, async data => {
      console.log(data);
  })
  
  //t2t token 兑换 token
  daoservice.dao_iadd.tokenTotokenEvent(0, async data => {
      console.log(data);
  })
    
  //eth to utoken 
  daoservice.dao_uToken.swapEvent(0, data => {
    console.log(data);
  })

  //eth to utoken
  daoservice.dao_uToken.swapToEvent(0, data => {
    console.log(data);
  })
    
  //DETH to utoken
  daoservice.dao_uToken.swapDethEvent(0, data => {
      console.log(data);
  })

  //execEvent 执行提案
  daoservice.dao_eventSum.execEvent(0,data => {
    console.log(data);
  })
   
  //appadd  上传app
  daoservice.dao_app.addAppEvent(0, async (data) => {
      console.log(data);
  });

}

run()

```


