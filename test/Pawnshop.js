const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Pawnshop contract", function () {

    let owner;
    let Pawnshop;
    let hardhatPawnshop;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        Pawnshop = await ethers.getContractFactory("Pawnshop");

        hardhatPawnshop = await Pawnshop.deploy(1000,1000);
    });

    it("Get chunk size", async function () {
        
        const chunkSize = await hardhatPawnshop.getChunkSize();

        expect(chunkSize).to.equal(1000);
    });

    it("Request borrow", async function() {
        await hardhatPawnshop.borrow(2000000000, 2, 2, 1, "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb");
        const lendings = await hardhatPawnshop.getLendings();
        expect(lendings.length).to.equal(1);
    });

    it("Set chunk size", async function() {
        await hardhatPawnshop.setChunkSize(10000);
        const chunkSize = await hardhatPawnshop.getChunkSize();
        expect(chunkSize).to.equal(10000);
    })
});