const Router = require('@koa/router');
const router = new Router();
const Web3 = require('web3');

const web3 = new Web3(process.env.INFURA_URL);

// Routes will go here
router.get('/eth/api/v1/transaction/:id',async (ctx, next) => {
   
    try {

        const transaction = await web3.eth.getTransaction(ctx.params.id);
        const chainId = await web3.eth.getChainId();
      
        
        blockHeight = transaction.blockNumber;
        ins_address = transaction.from;
        ins_value = `-${transaction.value}`;
        outs_address = transaction.to;
        outs_value = transaction.value;
        hash = transaction.hash;
        if(transaction.blockNumber)
        state = 'confirmed';
        else if(transaction.blockNumber == null)
        state = 'pending';
        currency = 'ETH';
        if(chainId == 1)
        chain = "ETH.main";
        else 
        chain = "ETH.test";
        depositType = "account";

    //  Account Transfers    
        ctx.body = {
            'block': { 
                 blockHeight    
            },'outs':[
                {
                    "address":outs_address, "value":outs_value
                }
            ],'ins':[
                {
                    "address":ins_address, "value":ins_value
                }
            ],
            hash,
            currency,
            chain,
            state,
            depositType

        }
     
   

//  Erc20 Token transfers
        if(transaction.value==0){
            web3.eth.getTransaction(ctx.params.id).then(console.log)
            web3.eth.getTransactionReceipt(ctx.params.id).then(console.log)       
            //console.log(transaction.input);
            input_string = transaction.input;
            const userAddress = '0x'+ input_string.substring(34,74);
            outs_address = userAddress;
            //console.log(input_string.substring(34,74));
            const hex_token_value = '0x'+ input_string.substring(118,138);
            const token_value = await web3.utils.hexToNumberString(hex_token_value);
            outs_value = token_value;
            ins_value = `-${token_value}`;
            //console.log(token_value);
            //console.log(outs_value);
           // const input = await web3.utils.hexToNumberString(transaction.input);
           // console.log(input);
           const tokenAddress = transaction.to;
           depositType = "Contract",

           ctx.body = {
            'block': { 
                 blockHeight    
            },'outs':[
                {
                    "address":outs_address, "value":outs_value, "type":"token","coinspecific":{
                        "tokenAddress":tokenAddress
                    }
                }
            ],'ins':[
                {
                    "address":ins_address, "value":ins_value,  "type":"token","coinspecific":{
                        "tokenAddress":tokenAddress
                    }
                }
            ],
            hash,
            currency,
            state,
            depositType,
            chain

        }
     

            }

       
     } catch(e) {
        console.log(e);
        ctx.status = 500;
        ctx.body = {
          error: 'internal server error'
        };
      }
});


  module.exports = router;