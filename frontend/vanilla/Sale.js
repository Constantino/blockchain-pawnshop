/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://xnqjh1qklvb8.usemoralis.com:2053/server";
const appId = "tsFobG1D7u1kGPHSIm3bOvDO43RQ76OJwCoEI6LT";
const _contractAddress="0xa8a2abd290db1d4b7A6F5E00CA9F3d118861dDBd";
Moralis.start({ serverUrl, appId });

const contractAddress  = "0xa8a2abd290db1d4b7A6F5E00CA9F3d118861dDBd"
var tokenId=0;
var tokenAddress="";
var contractType="";
var openingTime=0;
var endTime=0;
var amount=0;


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

async function getNFTsToLend(){  
    const abi =await getMetadata('../../contracts/ABI/Pawnshop.json');
    const options = {
        contractAddress: contractAddress,
        functionName: "getLendings",
        abi: abi,
        params:{},
      }
    var URLx="";
    let ele = document.getElementById('iterative');
    const information =  await Moralis.executeFunction(options)
    console.log(information);
    const informationFiltered = information.filter(x => x.status == "5")
    console.log(informationFiltered)
    for (const index in informationFiltered) {
      URLx= 'https://testnets-api.opensea.io/api/v1/asset/' + information[index].tokenContract +'/'+information[index].tokenId+'/';
      //console.log(URLx);
      var metadata="";
      //console.log(information[index].tokenContract);
      metadata=getMetadata(URLx); 
      console.log(await metadata);
      await delay(1.2);
      var data="";
      metadata.then(function(result) {
        // here you can use the result of promise
              //console.log(result);
              data= result.asset_contract.image_url;
              if(data !=null){
                //If NFT have image
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src=" '+ result.asset_contract.image_url+'"/> <div class="card-body"> <p class="card-text">' + result.token_id+'</p><p class="card-text">' + result.asset_contract.name +'</p><p class="card-text">' + result.asset_contract.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' +result.asset_contract.address  + '\',\''+ result.asset_contract.schema_name  +"\'," +result.token_id +","+  information[index].amount +"," + information[index].chunkPrice+"," + information[index].openingTime +","+ information[index].closingTime +' )">Buy</button> </div></div></div></div>';
                //To-Do Decode JSON to obtaing image
              
              }
              else
              {
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <canvas width="100%" height="100%" style="border: 1px solid; background-color: #007ad5;"> </canvas> <div class="card-body"> <p class="card-text">' + result.token_id +'</p><p class="card-text">' + result.asset_contract.name +'</p><p class="card-text">' + result.asset_contract.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' + result.asset_contract.address  + '\',\''+ result.asset_contract.schema_name +"\'," +result.token_id +"," + information[index].amount  +"," + information[index].chunkPrice+"," + information[index].openingTime +","+ information[index].closingTime +' )">Buy</button> </div></div></div></div>';
              }
      });
    }
  }
async function getChunkSize()
{
  const abi =await getMetadata('../../contracts/ABI/Pawnshop.json');
    const options = {
        contractAddress: contractAddress,
        functionName: "getLendings",
        abi: abi,
        params:{},
      }
    const information =  await Moralis.executeFunction(options)
}

async function getMetadata(url) 
  {
    let response = await fetch(url);
    let data = await response.json()
    return data;
  }

//GetDate  
async function enable(_tokenAddress,_contractType,_tokenId,_amount,_chunkPrice,_openingTime,_endTime) {
    tokenAddress= _tokenAddress;
    contractType=_contractType;
    tokenId=_tokenId;
    amount=_amount;
    chunkPrice= _chunkPrice;
    openingTime=_openingTime;
    endTime=_endTime;
    amount= amount / (10**18);
    chunkPrice= chunkPrice/ (10**18);
    document.getElementById('chunkAmount').innerHTML ="<strong>" + amount.toString() + "ETH" + "</strong>";
    document.getElementById('chunkPrice').innerHTML ="<strong>" + chunkPrice.toString() + "ETH" + "</strong>";
    document.getElementById('openingTime').innerHTML ="<strong>" + await unixTimeToDate(openingTime) + "</strong>";
    document.getElementById('endTime').innerHTML =  "<strong>" +await unixTimeToDate(endTime)+ "</strong>";

}

function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

async function unixTimeToDate(unixTimestamp)
{
  const milliseconds = unixTimestamp * 1000

  const dateObject = new Date(milliseconds)

  let day = dateObject.getDate()
  let month = dateObject.getMonth() + 1
  let year = dateObject.getFullYear()
  let finalDate="";
  if(month < 10){
    finalDate=day + "/" + "0" + month + "/" + year;
  }else{
    finalDate=day + "/" + month + "/" + year;
  }
  return finalDate; 
 
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
async function lendConfirm()
{
  var amountETH = document.getElementById('amountETH').value;
  let result = await usdToWei();
  document.getElementById('amountETHER').innerHTML = '<strong>Amount (ETH):</strong>' + amountETH;
  document.getElementById('amountETHToUSD').innerHTML = '<strong>Amount (USD):</strong>' + amountETH * (result/ (10**18));
  document.getElementById('chainlinkETHUSD').innerHTML = '<strong>ETH/USD:</strong>' + result/ (10**18);
}
async function Buy(){

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
    functionName: "Buy",
    abi: abi,
    params:{
      _amount:amountWEI.toString(),
      _tokenId:tokenId
    },
  }
  //uint256 _amount, uint256 _expirationTerm, uint256 _debtTerm, uint256 _tokenId, address _tokenContract
  const buy =  await Moralis.executeFunction(options)

}


async function onlyNumberKey(evt) {        
  // Only ASCII character in that range allowed
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
  {
      return false;
  }
}
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = getNFTsToLend;