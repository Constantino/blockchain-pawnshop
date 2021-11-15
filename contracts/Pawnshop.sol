// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Pawnshop{
    
    uint256 dailyInterestRate;
    
    constructor(uint256 _rate){
        dailyInterestRate = _rate;
    }
    
    enum Status { Open, Locked, Paid, Terminated }
    
    uint256 counter;
    
    mapping(address => Participation[]) lenders;
    mapping(address => uint256[]) borrowers;
    
    struct Participation {
        uint256 lendingId;
        uint256 amount;
    }
    
    struct Lending {
        uint256 id;
        uint256 amount;
        uint256 debt;
        uint256 openingTime;
        uint256 closingTime;
        uint256 nftId;
        address nftContract;
        Status status;
    }
    
    Lending[] public lendings;
    
    
    function setDailyInterestRate(uint256 _rate) public {
        dailyInterestRate = _rate;
    }
    
    function borrow(uint256 _amount, uint256 _term, uint256 _tokenId, address _tokenContract) public returns(uint256){
        uint256 openingTime = block.timestamp;
        uint256 closingTime = openingTime+86400*_term;
        uint256 debt = _amount + _term*dailyInterestRate;
        uint256 id = counter;
        lendings.push(Lending(id, _amount, debt, openingTime, closingTime, _tokenId, _tokenContract, Status.Open));
        counter++;
        borrowers[msg.sender].push(id);
        
        return id;
    }
    
    function getLendings() public view returns (Lending[] memory) {
        return lendings;
    }

    
    function lend(uint256 _lendingId) public {
            
            
    }
    
    function pay(uint256 _lendingId) public {
        // real_term = block.timestamp - openingTime
        // debt = amount+real_term * dailyInterestRate;
        // require amount == debt
        // change status
    }
    
    // TODO
    // Change lending status
    // Custody of NFTs
    // Give back the nft
    // Payments to partipant lenders
    // Auction of nft
    
}