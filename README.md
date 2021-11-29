# blockchain-pawnshop
# blockchain-pawnshop
About the project :
We used a Chainlink Keeper to maintain our decentralized application and update important values for our contract and execute certain actions.
Some of the actions were the following:
- Take the timestamp from the Keeper to call our function to transfer the NFT in case the person we lent did not pay on time and we hold it in our contract.

You can see the evidence from the Keeper:
https://keepers.chain.link/kovan/1790


![Keeper](https://user-images.githubusercontent.com/28800239/143809338-1e76286a-5088-40e6-addb-035dd0d3c18b.png)

We also used a Price Feed chainlink to improve the user experience and make the result in dollars and intuitive.


Branches:
main : This code has references to Open Sea, but unfortunately in Kovan it does not work to show the NFT data, so we migrated to KovanProject to avoid problems using the chainlink Keeper.

kovanProject: You will see that there are no depedencies with OpenSea and it is because of the problem that it is not compatible with Kovan.

video: It is the final branch that we use to record the video.

We know that this code can be improved and we gave our best effort at the time possible, we will continue working on other hackhaton and continue using the services of chainlink, moralis and alchemy.

