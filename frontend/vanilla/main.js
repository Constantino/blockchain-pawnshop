/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://eplrzhxmsawi.usemoralis.com:2053/server";
const appId = "pUNHFsDneuqyIWs6wGA3z0eM8GgtOU0VzryS9gBk";
Moralis.start({ serverUrl, appId });

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
  console.log(results)
  }

async function transfer(){
    // sending a token with token id = 1
  const options = {type: "erc721",  
  receiver: "0xd659f00DC394a1e2F775F8F9168046C123514DB7",
  contractAddress: "0xe128abbb6ff91f9b6faa7cd062d92101fdab4806",
  tokenId: 6}
  let result = await Moralis.transfer(options)
  }


  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = balance;
  document.getElementById("btn-transfer").onclick = transfer;
