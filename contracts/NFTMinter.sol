
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract mintNFT is ERC721("newMint", "NMT") {
    uint nftNumber = 1;

    function mint() public{ 
        //_safeMint(0x177C4e9d168f3C655F9593B09D3D6C61ff92115A , nftNumber);
        _safeMint(msg.sender, nftNumber);
        nftNumber += 1;
        
    }
}
