pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/ownership/Ownable.sol";

// A generic contract for computing the timestamp 
contract Timestamp is Ownable {
    uint256 secondsPerBlock = 13;

    //---Setter---
    function setSecondsPerBlock(uint256 _seconds) public onlyOwner {
        secondsPerBlock = _seconds;
    }

    /** 
     * Calculates the future block timestamp from the current block timestamp given a duration
     * @param _duration The amount of time in seconds till the future block timestamp
     * @return The future block timestamp
     */ 
    function getFutureTimestamp(uint256 _duration) public view returns (uint256) {
        return block.timestamp + _duration / secondsPerBlock; 
    }
}

// A protocol that 
contract Staking is Timestamp {

    struct LockedBalance {
        uint256 balance; // The underlying balance in DAI
        uint256 timestamp; // The block number of when this balance will be available to be withdrawn
    }

    // Keeps track of an array of LockedBalance per account
    mapping (address => LockedBalance[]) accountBalance;


}