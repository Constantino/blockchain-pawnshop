// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Pawnshop{
    
    uint256 dailyInterestRate;
    address owner;
    uint256 chunkSize;
    
    constructor(uint256 _rate, uint256 _chunkSize){
        dailyInterestRate = _rate;
        chunkSize = _chunkSize;
        owner = msg.sender;
    }
    
    enum Status { Review, Open, Locked, Paid, Terminated }
    enum ParticipantType { Borrower, Lender }
    
    uint256 counter;
    
    mapping(address => Participation[]) participants;
    
    struct Participation {
        uint256 lendingId;
        uint256 amount;
        ParticipantType participantType;
    }
    
    struct Lending {
        uint256 id;
        address borrower;
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
        
        uint256 nftId;
        address nftContract;
        
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
        public returns(uint256){
        require(_amount >= chunkSize, "Amount requested is too small."); // TODO: Review Size vs Price
        require(_amount%chunkSize == 0, "Please provide an amount in multiples of the chunk size.");
        require(_expirationTerm > 1, "Please provide an expiration term greater than 1 day.");
        require(_debtTerm > 1, "Please provide a debt term greater than 1 day.");
        
        uint256 openingTime = block.timestamp;
        uint256 reviewingTime = block.timestamp+86400; // now + 1 day
        // closingTime equals openingTime + X days
        uint256 closingTime = openingTime+86400*_expirationTerm;
        
        uint256 id = counter;
        
        uint256 chunkPrice = chunkNFT(_amount);
        
        // TODO: Receive NFT
        
        lendings.push(Lending(id, msg.sender,_amount, chunkPrice, 0.0001 ether, 0, dailyInterestRate, openingTime, reviewingTime, closingTime, 0, 0, _debtTerm, _tokenId, _tokenContract, Status.Review));
        
        participants[msg.sender].push(Participation(id, _amount, ParticipantType.Borrower));
        counter++;
        
        return id;
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
        
        participants[msg.sender].push(Participation(_lendingId, msg.value, ParticipantType.Lender));
            
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
                if(currentTimestamp >= lendings[id].reviewingTime) {
                    lendings[id].status = Status.Terminated;
                }

            } else if(status == Status.Open) {
                // If lending is open and did not complete funding on time
                if(currentTimestamp >= lendings[id].closingTime){
                    lendings[id].status = Status.Terminated;
                    // Return funds to participants
                    returnFunds(id);
                }        
            } else if(status == Status.Locked) {
                // If lending is locked and user did not pay on time
                if(currentTimestamp >= lendings[id].endTime){
                    lendings[id].status = Status.Terminated;
                }
            } 
        }
        
        
    }
    
    function returnFunds(uint256 _lendingId) private {
        
    }
    
    function terminateLending(uint256 _lendingId) private {
        
        Status status = lendings[_lendingId].status;
        
        if (lendings[_lendingId].status == Status.Open) {
            
        }
        else if(lendings[_lendingId].status == Status.Locked) {
            // TODO: Auction of NFT
        } else if(lendings[_lendingId].status == Status.Review) {
            // TODO: discard lending
        }
        
        lendings[_lendingId].status = Status.Terminated;
    }
    
    function pay(uint256 _lendingId) public payable {
        
        require(msg.value == lendings[_lendingId].debt, "Insufficient payment.");
        require(lendings[_lendingId].status == Status.Locked);
        require(block.timestamp < lendings[_lendingId].endTime, "Payment not allowed, end time reached.");
        lendings[_lendingId].status = Status.Paid;
        // TODO: Distribute payment to lenders
        // TODO: Give back the NFT to borrower
        // terminateLending
    }
    
    function distributePayments() private {
        
    }
    
    // TODO
    // Change lending status
    // Custody of NFTs
    // Give back the nft
    // Payments to partipant lenders
    // Auction of nft
    // Fees de mtto y negocio
    // Evaluar chunk vs share para renombrar
    
    
}
