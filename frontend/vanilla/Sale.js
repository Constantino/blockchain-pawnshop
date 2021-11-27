/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://xnqjh1qklvb8.usemoralis.com:2053/server";
const appId = "tsFobG1D7u1kGPHSIm3bOvDO43RQ76OJwCoEI6LT";
Moralis.start({ serverUrl, appId });
let tokenAddress= '0x2e7a22E789D94B3B7A3e7c64f02e2036CA9cF097'
let tokenAddressLowered = tokenAddress.toLowerCase()


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
    const options = { chain: 'rinkeby', address: '0x38c335725fb4dd53a1581bbaeb1a2389adffed87' };
    let userNFTs = await Moralis.Web3API.account.getNFTs(options);
    console.log(userNFTs)
    //let ele = document.getElementById('iterative');
    //let information = userNFTs
      //for (const index in information) {
       //ele.innerHTML +='<div class="col"> <div class="card shadow-sm"> <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"> <title>Placeholder</title> <rect width="100%" height="100%" fill="#55595c"/> <text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text> </svg> <div class="card-body"> <p class="card-text">' + information[index].attributes.token_id +'</p><p class="card-text">' + information[index].attributes.name +'</p><p class="card-text">' + information[index].attributes.symbol +'</p><div class="d-flex justify-content-between align-items-center"> <div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary">View</button> <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button></div><small class="text-muted">9 mins</small> </div></div></div></div>';    }
  
      
      
    }



  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-auction").onclick = auction;
  document.getElementById("btn-balance").onclick = balance;
  document.getElementById("btn-myBalance").onclick = myBalance;
