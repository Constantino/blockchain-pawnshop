/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://eplrzhxmsawi.usemoralis.com:2053/server";
const appId = "pUNHFsDneuqyIWs6wGA3z0eM8GgtOU0VzryS9gBk";
const _contractAddress="0x2952bCA6E39B358d1336ff9aA19e9335903B8b65";
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
              console.log(result);
              data= result.token_metadata;
              if(data !=null){
                //If NFT have image
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src=" '+ result.token_metadata +'"/> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' +information[index].attributes.token_address  + '\',\''+ information[index].attributes.contract_type +"\'," +information[index].attributes.token_id+' )">Enable</button> </div></div></div></div>';
                //To-Do Decode JSON to obtaing image
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
  const receiver = _contractAddress  //Hardcoded - Nuestro contrato
  const options = {type: contractType.toLowerCase(),  
  receiver: receiver,
  contractAddress: tokenAddress,
  tokenId: tokenId
  }
  let result = await Moralis.transfer(options)
  }

async function pawn(){
  document.getElementById('btn-pawnxC').style.display = "none";
  document.getElementById('btn-pawnx').style.display = "none";
  document.getElementById('btn-waitPawn').style.display = "block";
  //amount = document.getElementById('amount').value;
  var dateMoney = document.getElementById('datemoney').value;
  var datePayDebt = document.getElementById('datepaydebt').value;
  moneyDay = getNumberOfDays(Date.now(), dateMoney);
  moneyDay= moneyDay + 1;
  
  debtDay = getNumberOfDays(Date.now(), datePayDebt);
  debtDay= debtDay + 1;
  let amountWEI = document.getElementById('amountETH').value * 10 ** 18;
  
  console.log("WEI:" + amountWEI);
  console.log("Expiration term:" + moneyDay);
  console.log("Debt term:" + debtDay);
  console.log("TokenId:" + tokenId);
  console.log("TokenAddress:" + tokenAddress);
  //Cuanto quiere
  //Cambia el ABI
  const abi =await getMetadata('../../contracts/ABI/Pawnshop.json');

  const options = {
    contractAddress: _contractAddress,//"Nuestro contrato"
    functionName: "borrow",
    abi: abi,
    params:{
      _amount:amountWEI.toString(),
      _expirationTerm:moneyDay,
      _debtTerm:debtDay,
      _tokenId:tokenId,
      _tokenContract:tokenAddress//"Contrato del token"
    },
  }
  //uint256 _amount, uint256 _expirationTerm, uint256 _debtTerm, uint256 _tokenId, address _tokenContract
  const addCount =  await Moralis.executeFunction(options)
  $('#exampleModal').modal('hide');
  $('#myModal2').modal('hide');
  document.getElementById('btn-pawnxC').style.display = "none";
  document.getElementById('btn-pawnx').style.display = "none";
  document.getElementById('btn-waitPawn').style.display = "none";
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
  const abi =await getMetadata('../../contracts/ABI/ChainlinkPriceFeed.json');
  //./main.js
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
  /*
  USD to ETH - Not possible in this hackhaton
  var amount = document.getElementById('amount').value;
  let result = await usdToWei();
  let conversion=0;
  conversion= ((amount * 10**18 )/ result) ;
  document.getElementById('amountETH').innerHTML = '<strong>Amount (ETH):</strong>' + conversion;
  document.getElementById('curencyAmount').innerHTML = '<strong>Amount (USD):</strong>' + amount;
  document.getElementById('chainlinkETHUSD').innerHTML = '<strong>ETH/USD:</strong>' + result/ (10**18);
  */
  var amountETH = document.getElementById('amountETH').value;
  let result = await usdToWei();
  document.getElementById('amountETHER').innerHTML = '<strong>Amount (ETH):</strong>' + amountETH;
  document.getElementById('amountETHToUSD').innerHTML = '<strong>Amount (USD):</strong>' + amountETH * (result/ (10**18));
  document.getElementById('chainlinkETHUSD').innerHTML = '<strong>ETH/USD:</strong>' + result/ (10**18);
}


  document.getElementById("btn-pawnx").onclick = pawn;
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = balance;
  document.getElementById("btn-transfer").onclick = transfer;
  document.getElementById("btn-pawnConfirm").onclick = pawnConfirm;
  //-------------------------------------------------------------//
  document.getElementById("btn-enable").onclick = enable;


 
  