/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://8fn3mvvwwjxf.usemoralis.com:2053/server";
const appId = "UglFwQM02SHSpEGv17ffGsChAXPUmr4BkJjgpeYU ";
const _contractAddress="0x8cFc75FeF3194872FaB7364959FC69D207a22aC9";
Moralis.start({ serverUrl, appId });
var tokenId=0;
var tokenAddress="";
var contractType="";
var openingTime=0;
var endTime=0;
var amount=0;
let lendingId=0;
var xtotalAmountChunks=0;
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
    const abi =await getMetadata('./content/ABI/Pawnshop.json');
    const options = {
        contractAddress: _contractAddress,
        functionName: "getLendings",
        abi: abi,
        params:{},
      }
    var URLx="";
    let ele = document.getElementById('iterative');
    let information =  await Moralis.executeFunction(options)
    //---console.log(information);
    let newinformation=information.filter(x=>
      x.status=='1'
      );
    console.log(newinformation);
    information=newinformation;
    for (const index in information) {
      dataxImage= ""; //Image
      let debtTerm= information[index].debtTerm!=0?information[index].debtTerm:"";
      let dailyInterestRate= information[index].dailyInterestRate!=0?information[index].dailyInterestRate:0;
      closingTime=information[index].closingTime!=undefined?await unixTimeToDate(information[index].closingTime):"";
        // here you can use the result of promise
        //data= information[index].attributes.token_uri;
              if(dataxImage !=null){
                //If NFT have image
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src=" '+  dataxImage+'"/> <div class="card-body"> <p class="card-text">Token Id:' +  information[index].tokenId+'</p><p class="card-text">Contract Name:' + information[index].token_address +'</p><p class="card-text">Symbol:' + information[index].symbol +'</p><p class="card-text">dailyInterestRate:' + dailyInterestRate +'</p><p class="card-text">Debt Term:' + debtTerm +'</p><p class="card-text">Closing Time:' + closingTime +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' +information[index].token_address + '\',\''+ information[index].contract_type +" \ '," +information[index].tokenId +","+ information[index].amount +"," + information[index].chunkPrice+"," + information[index].openingTime +","+ information[index].closingTime+","+ information[index].id +' ) ">Lend</button> </div></div></div></div>';
                //To-Do Decode JSON to obtaing image
              }
              else
              {
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <canvas width="100%" height="100%" style="border: 1px solid; background-color: #007ad5;"> </canvas> <div class="card-body"> <p class="card-text">Token Id:' + information[index].tokenId+'</p><p class="card-text">Contract Name:' + information[index].token_address+'</p><p class="card-text">Symbol:' +  information[index].symbol +'</p><p class="card-text">dailyInterestRate:' + dailyInterestRate  +'</p><p class="card-text">Debt Term:' + debtTerm +'</p><p class="card-text">Closing Time:' + closingTime +'</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="enable(\'' + information[index].token_address + '\',\''+ information[index].contract_type +" \ '," +information[index].attributes.tokenId +"," + information[index].amount +"," + information[index].chunkPrice+"," + information[index].openingTime +","+ information[index].closingTime+","+ information[index].id +' ) ">Lend</button> </div></div></div></div>';
              }
    }
  }
async function getChunkSize()
{
  const abi =await getMetadata('./content/ABI/Pawnshop.json');
    const options = {
        contractAddress: _contractAddress,
        functionName: "getChunkSize",
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
async function enable(_tokenAddress,_contractType,_tokenId,_amount,_chunkPrice,_openingTime,_endTime,_lendingId) {
    tokenAddress= _tokenAddress;
    contractType=_contractType;
    tokenId=_tokenId;
    amount=_amount;
    chunkPrice= _chunkPrice;
    openingTime=_openingTime;
    endTime=_endTime;
    lendingId=_lendingId;

    console.log("LendingId x:" + _lendingId);
    document.getElementById('chunkAmount').innerHTML ="<strong>" + amount.toString() + " WEI" + "</strong>";
    document.getElementById('chunkPrice').innerHTML ="<strong>" + chunkPrice.toString()  + " WEI" + "</strong>";
    document.getElementById('chunkSize').innerHTML ="<strong>" + amount/chunkPrice + "</strong>";
    //To-Do - WEI To ETH
    
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
  const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331"
  const web3 = new Web3("https://eth-kovan.alchemyapi.io/v2/C2NURICoXsxwnjUpRyaIPfC-H319846C")
  //Cambia el abi
  const abi =await getMetadata('./content/ABI/ChainlinkPriceFeed.json');
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
  var amountChunks = document.getElementById('amountChunks').value;
  let result = await usdToWei();
  let totalAmountChunks= (amountChunks * chunkPrice)/(10**18);
  xtotalAmountChunks= totalAmountChunks;
  document.getElementById('xchunkAmount').innerHTML = '<strong>Amount (ETH):</strong>' +  totalAmountChunks.toString();
  document.getElementById('xchunkPrice').innerHTML = '<strong>Amount (USD):</strong>' +  (totalAmountChunks * (result /((10**18)))).toString();
  document.getElementById('xchunkSize').innerHTML = '<strong>ETH/USD:</strong>' + (result/ (10**18)).toString();
  console.log("Save:" + lendingId);
  if((totalAmountChunks * (10**18))  >amount)
  {
      alert("You may not buy more chunks than allowed.");
  }

}

async function lend(){
  document.getElementById('btn-lendxC').style.display = "none";
  document.getElementById('btn-lendx').style.display = "none";
  document.getElementById('btn-waitLend').style.display = "block";
  
  const abi =await getMetadata('./content/ABI/Pawnshop.json');

  lendingId=lendingId.toString();
  console.log("Final"+  lendingId.toString());
  console.log("Amount"+  xtotalAmountChunks*(10**18));
  xtotalAmountChunks= xtotalAmountChunks*(10**18);
  const options = {
    contractAddress: _contractAddress,//"Nuestro contrato"
    functionName: "lend",
    abi: abi,
    params:{
      _lendingId: lendingId
    },
    msgValue: xtotalAmountChunks
  }
  console.log(options);
  const addCount =  await Moralis.executeFunction(options);
  $('#exampleModal').modal('hide');
  $('#myModal').modal('hide');
  document.getElementById('btn-lendxC').style.display = "none";
  document.getElementById('btn-lendx').style.display = "none";
  document.getElementById('btn-lendPawn').style.display = "none";
}


async function onlyNumberKey(evt) {        
  // Only ASCII character in that range allowed
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
  {
      return false;
  }
}

Number.prototype.toFixedSpecial = function(n) {
  var str = this.toFixed(n);
  if (str.indexOf('e+') === -1)
    return str;

  // if number is in scientific notation, pick (b)ase and (p)ower
  str = str.replace('.', '').split('e+').reduce(function(b, p) {
    return b + Array(p - b.length + 2).join(0);
  });
  
  if (n > 0)
    str += '.' + Array(n + 1).join(0);
  
  return str;
};

document.getElementById("btn-balance").onclick = getNFTsToLend;
  document.getElementById("btn-lendx").onclick = lend;
  document.getElementById("btn-lendConfirm").onclick = lendConfirm;
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
