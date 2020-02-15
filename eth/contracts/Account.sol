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

// A protocol that keeps track of the balance of an account.
// The account balance can be timelocked for the contract owner to earn interest for the duration
contract Account is Timestamp {
    
    struct LockedBalance {
        uint256 balance; // The underlying balance
        uint256 timestamp; // The block number of when this balance will be available to be withdrawn
    }

    // Keeps track of an array of LockedBalance per account
    mapping (address => LockedBalance[]) accountBalance;

    //---Interface---
    
    // Get the total balance of an address
    function getAccountBalance(address _address) external view returns (uint256) {
        uint256 totalBalance;
        LockedBalance[] memory wrappedBalance = accountBalance[_address];
        for (uint i = 0; i < wrappedBalance.length; i++) {
            totalBalance += wrappedBalance[i].balance;
        }
        return totalBalance;
    }
    
    // Get the balance that is withdrawable
    function getWithdrawableBalance(address _address) external view returns (uint256) {
        uint256 totalBalance;
        LockedBalance[] memory wrappedBalance = accountBalance[_address];
        for (uint i = 0; i < wrappedBalance.length; i++) {
            if (block.timestamp > wrappedBalance[i].timestamp) {
                totalBalance += wrappedBalance[i].balance;
            }
        }
        return totalBalance;
    }
    
    // Withdraw returns the user's current balance that is not timelocked
    // Prepares the balance to be withdrawn
    function _withdraw() internal returns (uint256) {
        uint256 totalBalance;
        
        LockedBalance[] storage wrappedBalance = accountBalance[msg.sender];
        for (uint i = 0; i < wrappedBalance.length; i++) {
            if (block.timestamp > wrappedBalance[i].timestamp) {
                totalBalance += wrappedBalance[i].balance;
                
                // Protect against reentrancy 
                delete wrappedBalance[i];
            }
        }
        
        require(totalBalance > 0,"No balance to withdraw");
        return totalBalance;
    }
    
    /** 
     * Transfer a balance to an address
     * @param _to       The address of the recipient
     * @param _value    The amount of token to send
     * @param _duration The amount of time in seconds till the DAI can be unlocked
     */
    function _transfer(address _to, uint256 _value, uint256 _duration) internal {
        uint256 timestamp = getFutureTimestamp(_duration);        
        accountBalance[_to].push(LockedBalance(_value, timestamp));
    }
}