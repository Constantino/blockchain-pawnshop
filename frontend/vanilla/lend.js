/* TODO: Add Moralis init code */
/* Moralis init code */
const serverUrl = "https://xnqjh1qklvb8.usemoralis.com:2053/server";
const appId = "tsFobG1D7u1kGPHSIm3bOvDO43RQ76OJwCoEI6LT";
Moralis.start({ serverUrl, appId });
const ABI = [
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
                        "internalType": "address",
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
        "name": "getParticipants",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
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
const contractAddress  = "0xa8a2abd290db1d4b7A6F5E00CA9F3d118861dDBd"

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
    const options = {
        contractAddress: "0xa8a2abd290db1d4b7A6F5E00CA9F3d118861dDBd",
        functionName: "getLendings",
        abi: ABI,
        params:{},
      }
    const NFTsToLend =  await Moralis.executeFunction(options)
    console.log(NFTsToLend)
    }

async function lend(){
    const options = {
        contractAddress: contractAddress,
        functionName: "lend",
        abi: ABI,
        msgValue: "200000000",
        params:{
            _lendingId: "1",
        },
    }
    const lendMoney = await Moralis.executeFunction(options)
}

  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;
  document.getElementById("btn-balance").onclick = getNFTsToLend;
  document.getElementById("btn-lend").onclick = lend;