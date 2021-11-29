//Begin
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Pawnshop.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData)
        external
        returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

contract Counter is KeeperCompatibleInterface {
    uint256 public counter; // Public counter variable

    // Use an interval in seconds and a timestamp to slow execution of Upkeep
    //60 seconds
    uint256 public immutable interval;
    uint256 public lastTimeStamp; //My counter was updated

    //**
    address public contractBAddress;

    //**

    constructor(uint256 updateInterval, address _contractBAddress) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        counter = 0;
        contractBAddress = _contractBAddress;
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        performData = checkData;
    }

    //When checkUpKeep its already to launch, this task is executed
    function performUpkeep(bytes calldata) external override {
        lastTimeStamp = block.timestamp;
        Pawnshop pawnShop = Pawnshop(contractBAddress);
        pawnShop.statusUpdater(lastTimeStamp);

        
    }
}


