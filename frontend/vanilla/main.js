/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://eplrzhxmsawi.usemoralis.com:2053/server";
const appId = "pUNHFsDneuqyIWs6wGA3z0eM8GgtOU0VzryS9gBk";
Moralis.start({ serverUrl, appId });
var tokenId=0;
var tokenAddress="";
var contractType="";
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
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src=" +result.image_url +"/> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="pawn(\'' +information[index].attributes.token_address  + '\',\''+ information[index].attributes.contract_type +"\'," +information[index].attributes.token_id+' )">Enable</button> </div></div></div></div>';
              }
              else
              {
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <canvas width="100%" height="100%" style="border: 1px solid; background-color: #007ad5;"> </canvas> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="pawn(\'' +information[index].attributes.token_address  + '\',\''+ information[index].attributes.contract_type +"\'," +information[index].attributes.token_id+' )">Enable</button> </div></div></div></div>';
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
  const receiver = "0xce104060ecdabFe6139B248bA20c54e03C5bE376"   //Hardcoded - Nuestro contrato
  const options = {type: contractType.toLowerCase(),  
  receiver: receiver,
  contractAddress: tokenAddress,
  tokenId: tokenId
  }
  let result = await Moralis.transfer(options)
  }

async function interaction(){
  const ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token_address",
          "type": "address"
        }
      ],
      "name": "storeTokenAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "viewTokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const options = {
    contractAddress: "0xEE995dc1D7793a1674c8D97d0111816C8bcfB12E",
    functionName: "storeTokenAddress",
    abi: ABI,
    params:{
      token_address: "0xEE995dc1D7793a1674c8D97d0111816C8bcfB12E"
      //attribute1
      //attribute2
    },
  }
  const addCount =  await Moralis.executeFunction(options)
}

function onlyNumberKey(evt) {        
  // Only ASCII character in that range allowed
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
  return true;
}

async function save() {
  const amount = document.getElementById('amount').value;
  const dateMoney = document.getElementById('datemoney').value;
  const datePayDebt = document.getElementById('datepaydebt').value;
  var moneyDay = getNumberOfDays(Date.now(), dateMoney);
  var moneyDay= moneyDay + 1;
  
  var debtDay = getNumberOfDays(Date.now(), datePayDebt);
  var debtDay= debtDay + 1;
  transfer(amount);
}

async function pawn(_tokenAddress,_contractType,_tokenId) {
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

  document.getElementById("btn-save").onclick = save;
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = balance;


 