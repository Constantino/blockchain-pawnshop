// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFTHandler.sol";

contract Pawnshop is NFTHandler{
    
    uint256 dailyInterestRate;
    address owner;
    uint256 chunkSize;
    
    constructor(uint256 _rate, uint256 _chunkSize){
        dailyInterestRate = _rate;
        chunkSize = _chunkSize;
        owner = msg.sender;
    }
    
    enum Status { Review, Open, Locked, ReadyToRefund, ReadyToPayInterest, Paid, Terminated }
    enum ParticipantType { Borrower, Lender }
    
    uint256 counter;
    
    struct Participant {
        address payable account;
        uint256 amount;
    }
    
    struct Lending {
        address payable borrower;
        uint256 amount;
        uint256 chunkPrice;
        uint256 debt;
        uint256 fund;
        
        uint256 dailyInterestRate;
        
        uint256 openingTime;
        uint256 reviewingTime;
        uint256 closingTime;
        uint256 startTime;
        uint256 endTime;
        uint256 debtTerm;
        
        uint256 tokenId;
        address tokenContract;
        
        Participant[] participants;
        
        Status status;
    }
    
    Lending[] lendings;
    
    
    function setDailyInterestRate(uint256 _rate) public {
        dailyInterestRate = _rate;
    }
    
    function setChunkSize(uint256 _chunkSize) public {
        chunkSize = _chunkSize;
    }
    
    function borrow(uint256 _amount, uint256 _expirationTerm, uint256 _debtTerm, uint256 _tokenId, address _tokenContract) 
        public {
        require(_amount >= chunkSize, "Amount requested is too small."); // TODO: Review Size vs Price
        require(_amount%chunkSize == 0, "Please provide an amount in multiples of the chunk size.");
        require(_expirationTerm > 1, "Please provide an expiration term greater than 1 day.");
        require(_debtTerm > 1, "Please provide a debt term greater than 1 day.");
        
        uint256 openingTime = block.timestamp;
        uint256 reviewingTime = block.timestamp+86400; // now + 1 day
        // closingTime equals openingTime + X days
        uint256 closingTime = openingTime+86400*_expirationTerm;
        
        uint256 chunkPrice = chunkNFT(_amount);
        uint256 id = counter;
        
        lendings[id].borrower = payable(msg.sender);
        lendings[id].amount = _amount;
        lendings[id].chunkPrice = chunkPrice;
        
        lendings[id].dailyInterestRate = dailyInterestRate;
        
        lendings[id].openingTime = openingTime;
        lendings[id].reviewingTime = reviewingTime;
        lendings[id].closingTime = closingTime;
        
        lendings[id].debtTerm = _debtTerm;
        
        lendings[id].tokenId = _tokenId;
        lendings[id].tokenContract = _tokenContract;
        
        lendings[id].status = Status.Review;
        
        counter++;
    }
    
    function getChunkSize() view public returns(uint256) {
        return chunkSize;
    }
    
    function chunkNFT(uint256 _amount) view private returns(uint256) {
        require(_amount%chunkSize == 0, "Please provide an amount in multiples of the chunk size.");
        uint256 chunkPrice = _amount/chunkSize;
        
        return chunkPrice;
    }
    
    function getLendings() public view returns (Lending[] memory) {
        return lendings;
    }

    
    function lend(uint256 _lendingId) public payable {
        require(lendings[_lendingId].status == Status.Open, "Lending opportunity is not open.");
        require(msg.value >= lendings[_lendingId].chunkPrice, "Please provide an amount in multiples of the chunk size.");
        require(msg.value%lendings[_lendingId].chunkPrice == 0, "Please provide an amount in multiples of the chunk size.");
        require(msg.value <= (lendings[_lendingId].amount - lendings[_lendingId].fund), "Contribution to the fund exceeds amount requested by borrower.");
        
        lendings[_lendingId].fund += msg.value;
        
        if(lendings[_lendingId].fund == lendings[_lendingId].amount) {
            lockLending(_lendingId);
        }
        
        lendings[_lendingId].participants.push(Participant(payable(msg.sender), msg.value));
        
    }
    
    function lockLending(uint256 _lendingId) private {
        require(lendings[_lendingId].fund == lendings[_lendingId].amount, "Cannot lock lending.");
        
        lendings[_lendingId].status = Status.Locked;
        lendings[_lendingId].startTime = block.timestamp;
        lendings[_lendingId].endTime = lendings[_lendingId].startTime + 86400*lendings[_lendingId].debtTerm;
        uint256 interest = lendings[_lendingId].debtTerm*lendings[_lendingId].dailyInterestRate;
        lendings[_lendingId].debt = lendings[_lendingId].amount + interest;
    }
    
    function statusUpdater() external {
        
        uint256 currentTimestamp = block.timestamp;
        uint256 lendingsLength = lendings.length;
        
        for(uint256 id; id < lendingsLength; id++) {
            
            Status status = lendings[id].status;
            
            if(status == Status.Review) {
                
                ERC721 xContract = ERC721(lendings[id].tokenContract);
                address currentOwner = xContract.ownerOf(lendings[id].tokenId);
                
                // if user transfered the NFT to the pawnshop, then set lending status to Open to receive funding
                if(currentOwner == address(this)){
                    lendings[id].status = Status.Open;
                } else {
                    // Otherwise, check if reviewing time has been exceeded, to terminate lending
                    if(currentTimestamp > lendings[id].reviewingTime) {
                        lendings[id].status = Status.Terminated;
                    }
                }
            
            } else if(status == Status.Open) {
                // If lending is open and did not complete funding on time, then terminate lending and return funds
                if(currentTimestamp >= lendings[id].closingTime){
                    lendings[id].status = Status.Terminated;
                    // Return funds to participants
                    returnFunds(id);
                    returnNFT(id);
                }        
            } else if(status == Status.Locked) {
                // If lending is locked and user did not pay on time, then terminate lending
                if(currentTimestamp >= lendings[id].endTime){
                    lendings[id].status = Status.Terminated;
                }
            } 
        }
        
        
    }
    
    function returnFunds(uint256 _lendingId) private {
        uint256 participantsLen = lendings[_lendingId].participants.length;
        if(participantsLen > 0) {
            for(uint256 i; i < participantsLen; i++) {
                lendings[_lendingId].participants[i].account.transfer(lendings[_lendingId].participants[i].amount);
            }
        }
    }
    
    function returnNFT(uint256 _lendingId) private {
        psTransferNFT(lendings[_lendingId].borrower, lendings[_lendingId].tokenId, lendings[_lendingId].tokenContract);
    }
    
    
    function pay(uint256 _lendingId) public payable {
        
        require(msg.value == lendings[_lendingId].debt, "Insufficient payment.");
        require(lendings[_lendingId].status == Status.Locked);
        require(block.timestamp < lendings[_lendingId].endTime, "Payment not allowed, end time reached.");
        lendings[_lendingId].status = Status.Paid;
        distributePayments(_lendingId);
        returnNFT(_lendingId);
        lendings[_lendingId].status = Status.Terminated;
    }
    
    function distributePayments(uint256 _lendingId) private {
        // TODO
    }
    
    // TODO
    // Payments to partipant lenders
    // Fees business model
    
}
