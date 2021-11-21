// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


pragma solidity ^0.8.0;

contract TokenReceiver is IERC721Receiver//, ERC721("newMint", "NMT")
{
address  operador;
address de;
uint256 idToken;
bytes datos;

address private token;
uint balanceNFT = 0;

    constructor() {
    }

    function transfer(address to, uint256 tokenId) public {
       // IERC721(token).safeTransferFrom(address(this), to, tokenId);
       ERC721 myContract = ERC721(0x2e7a22E789D94B3B7A3e7c64f02e2036CA9cF097);//Need to automate this, geting address token automatically(contract that minted it)
       myContract.safeTransferFrom(address(this), to, tokenId);
    }
    
    function viewValance() public view returns(uint){
            return balanceNFT;
    }
    event NFTRecieved(
        address from,
        uint256 tokenId,
        address operator,
        bytes data
        );
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {
        balanceNFT += 1;
        operador = operator;
        de = from;
        idToken = tokenId;
        emit NFTRecieved(from, tokenId,operator, data); 
        return this.onERC721Received.selector;
    }
    function fundContract(uint  amount) public payable returns(uint){
        return amount;
    }
    function viewOperator() public view returns(address){
        return operador;
    }
    function viewFrom() public view returns(address){
        return de;
    }
    function viewTokenID() public view returns(uint256){
        return idToken;
    }
}