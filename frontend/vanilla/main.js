/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://eplrzhxmsawi.usemoralis.com:2053/server";
const appId = "pUNHFsDneuqyIWs6wGA3z0eM8GgtOU0VzryS9gBk";
Moralis.start({ serverUrl, appId });
var tokenId=0;
var tokenAddress="";
var contractType="";
//<------------------->
var amount=0;
var moneyDay=0;
var debtDay=0;
//<------------------->
var information = []

/* TODO: Add Moralis Authentication code */
async function login() {
    let user = Moralis.User.current();
    
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
          console.log(user.get("username"));
        })
        .catch(function (error) {
          console(error);
        });
    }
  }
async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
  }

async function balance(){
  const user = Moralis.User.current();
  const userAddress = user.get("ethAddress");

// create a query on the EthTransactions collection
  const collection = "EthNFTOwners";
  const query = new Moralis.Query(collection);

// get all the transactions sent by the current user
  query.equalTo("owner_of", userAddress);

// run the query
  const results = await query.find();
  //console.log(results)
    var URLx="";
    let ele = document.getElementById('iterative');
    information = results;
    

    for (const index in information) {
      
      if(information[index].attributes.contract_type=="ERC721")
      {
      URLx= 'https://testnets-api.opensea.io/api/v1/asset/' + information[index].attributes.token_address  +'/'+information[index].attributes.token_id+'/';
      var metadata="";
      metadata=getMetadata(URLx); 
      await delay(1.2);
      var data="";
      metadata.then(function(result) {
        // here you can use the result of promise
              data= result.image_url;
              console.log(data)
              if(data !=""){
                //If NFT have image
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src=" +result.image_url +"/> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' +information[index].attributes.token_address  + '\',\''+ information[index].attributes.contract_type +"\'," +information[index].attributes.token_id+' )">Enable</button> </div></div></div></div>';
              }
              else
              {
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <canvas width="100%" height="100%" style="border: 1px solid; background-color: #007ad5;"> </canvas> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' +information[index].attributes.token_address  + '\',\''+ information[index].attributes.contract_type +"\'," +information[index].attributes.token_id+' )">Enable</button> </div></div></div></div>';
              }
      });
      }
      }
     
      
    
  }
function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}
async function getMetadata(url) 
  {
    let response = await fetch(url);
    let data = await response.json()
    return data;
  }

async function transfer(){
  console.log("TokenId:" + tokenId);
  console.log("TokenAddress:" + tokenAddress);
  const receiver = "0xce104060ecdabFe6139B248bA20c54e03C5bE376"   //Hardcoded - Nuestro contrato
  const options = {type: contractType.toLowerCase(),  
  receiver: receiver,
  contractAddress: tokenAddress,
  tokenId: tokenId
  }
  let result = await Moralis.transfer(options)
  }

async function pawn(){
  amount = document.getElementById('amount').value;
  var dateMoney = document.getElementById('datemoney').value;
  var datePayDebt = document.getElementById('datepaydebt').value;
  moneyDay = getNumberOfDays(Date.now(), dateMoney);
  moneyDay= moneyDay + 1;
  
  debtDay = getNumberOfDays(Date.now(), datePayDebt);
  debtDay= debtDay + 1
  debtDay = getNumberOfDays(Date.now(), datePayDebt);
  debtDay= debtDay + 1

  let result = await usdToWei();
  let conversion=0;
  //ETH to Wei
  conversion= ((amount * 10**18 )/ result) * 10**18 ;
  
  
  console.log("Amount in Wei:" + conversion);
  console.log("Expiration term:" + moneyDay);
  console.log("Debt term:" + debtDay);
  console.log("TokenId:" + tokenId);
  console.log("TokenAddress:" + tokenAddress);
  var usdWei= await usdToWei(amount);
  //Cuanto quiere
  //Cambia el ABI
  const ABI = [
    [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_rate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_chunkSize",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "NFTRecieved",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_expirationTerm",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_debtTerm",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_tokenContract",
            "type": "address"
          }
        ],
        "name": "borrow",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getChunkSize",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getLendings",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "borrower",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "chunkPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "debt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "fund",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "dailyInterestRate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "openingTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "reviewingTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "closingTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "debtTerm",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "address payable",
                    "name": "account",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct Pawnshop.Participant[]",
                "name": "participants",
                "type": "tuple[]"
              },
              {
                "internalType": "enum Pawnshop.Status",
                "name": "status",
                "type": "uint8"
              }
            ],
            "internalType": "struct Pawnshop.Lending[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_lendingId",
            "type": "uint256"
          }
        ],
        "name": "lend",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_operator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "onERC721Received",
        "outputs": [
          {
            "internalType": "bytes4",
            "name": "",
            "type": "bytes4"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_lendingId",
            "type": "uint256"
          }
        ],
        "name": "pay",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_chunkSize",
            "type": "uint256"
          }
        ],
        "name": "setChunkSize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_rate",
            "type": "uint256"
          }
        ],
        "name": "setDailyInterestRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "statusUpdater",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  ]
  const options = {
    contractAddress: "0xce104060ecdabFe6139B248bA20c54e03C5bE376",//"Nuestro contrato"
    functionName: "borrow",
    abi: ABI,
    params:{
      _amount:conversion,
      _expirationTerm:dateMoney,
      _debtTerm:debtDay,
      _tokenId:tokenId,
      _tokenContract:tokenAddress//"Contrato del token"
    },
  }
  const addCount =  await Moralis.executeFunction(options)
}

async function onlyNumberKey(evt) {        
  // Only ASCII character in that range allowed
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
  {
      return false;
  }
}

async function enable(_tokenAddress,_contractType,_tokenId) {
  tokenAddress= _tokenAddress;
  contractType=_contractType;
  tokenId=_tokenId;
}



function getNumberOfDays(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays;
}

async function usdToWei()
{
  const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
  const web3 = new Web3("https://eth-rinkeby.alchemyapi.io/v2/U-LGMY7cgdXhQ6TPuaRHI8Mr3BC1zKag")
  //Cambia el abi
  const abi = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];  
  const priceFeed = new web3.eth.Contract(abi, addr);
  var promise;
  promise=priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        return roundData.answer * 10000000000;
        
    })
  return promise;
}

async function pawnConfirm()
{
  var amount = document.getElementById('amount').value;
  let result = await usdToWei();
  let conversion=0;
  conversion= ((amount * 10**18 )/ result) ;
  document.getElementById('amountETH').innerHTML = '<strong>Amount (ETH):</strong>' + conversion;
  document.getElementById('curencyAmount').innerHTML = '<strong>Amount (USD):</strong>' + amount;
  document.getElementById('chainlinkETHUSD').innerHTML = '<strong>ETH/USD:</strong>' + result/ (10**18);
}

async function readJSON(jsonURL)
{
  fetch()
                .then(res => res.json())
                .then(data => {
                  return data;
                })
                .catch(err => console.error(err));
}
  document.getElementById("btn-pawnx").onclick = pawn;
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = balance;
  document.getElementById("btn-transfer").onclick = transfer;
  document.getElementById("btn-pawnConfirm").onclick = pawnConfirm;
  //-------------------------------------------------------------//
  document.getElementById("btn-enable").onclick = enable;


 
  