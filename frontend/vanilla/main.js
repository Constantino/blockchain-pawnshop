/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://eplrzhxmsawi.usemoralis.com:2053/server";
const appId = "pUNHFsDneuqyIWs6wGA3z0eM8GgtOU0VzryS9gBk";
Moralis.start({ serverUrl, appId });

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
                ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src=' +result.image_url +'> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary">View</button> <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button></div><small class="text-muted">9 mins</small> </div></div></div></div>';
              }
              else
              {
                ele.innerHTML +='<div class="col"><div class="card shadow-sm"> <canvas width="100%" height="100%" style="border:1px solid;background-color:#007ad5"> </canvas><div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <div class="btn-group"> <button type="button" class="btn btn-sm btn-outline-secondary">View</button> <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button> </div><small class="text-muted">9 mins</small> </div></div></div></div>';
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
  balance()
  const type = information[0].attributes.contract_type
  const lowType =  type.toLowerCase()
  const receiver = "0xe33F916081c742515c17214a017588fba126Cf8C"
  const contractAdress = information[0].attributes.token_address
  const tokenId = information[0].attributes.token_id

  //console.log(type, receiver, contractAdress, tokenId)

  const options = {type: lowType,  
  receiver: receiver,
  contractAddress: contractAdress,
  tokenId: tokenId}
  let result = await Moralis.transfer(options)
  }


  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = balance;
  document.getElementById("btn-transfer").onclick = transfer;
