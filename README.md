# blockchain-pawnshop
About the project :
</br>
We used a Chainlink Keeper to maintain our decentralized application and update important values for our contract and execute certain actions.
Some of the actions were the following:
- The Keeper sends a timestamp to us and with this timestamp we make different checks, one of them is: 
In the case that the person we lend to does not pay on time, the NFT is retained in our contract and with this it is possible to send it to auction or that a person can buy it so that the lenders can obtain their profits.

You can see the evidence from the Keeper:
https://keepers.chain.link/kovan/1790


![Keeper](https://user-images.githubusercontent.com/28800239/143809338-1e76286a-5088-40e6-addb-035dd0d3c18b.png)
![Keeper chain](https://user-images.githubusercontent.com/28800239/143810158-a369d78e-4918-451a-aaf2-a45686053e8a.png)

We also used a Price Feed chainlink to improve the user experience and make the result in dollars and intuitive.


Branches:
main : This code has references to Open Sea, but unfortunately in Kovan it does not work to show the NFT data, so we migrated to KovanProject to avoid problems using the chainlink Keeper.

kovanProject: You will see that there are no dependencies with OpenSea and it is because of the problem that it is not compatible with Kovan.

video: It is the final branch that we use to record the video.

We know that this code can be improved and we gave our best effort at the time possible, we will continue working on other hackhaton and continue using the services of chainlink, moralis and alchemy.

