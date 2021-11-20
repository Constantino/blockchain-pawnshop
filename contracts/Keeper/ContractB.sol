// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

contract ContractB {
    uint256 public lastTimeStamp;

    function setTimeStamp(uint256 _timeStamp) external {
        lastTimeStamp = _timeStamp;
    }

    function getTimeStamp() public view returns (uint256) {
        return lastTimeStamp;
    }
}
