pragma solidity ^0.5.0;

// Generic Non-transferrable reputation management tied to voting behaviour
contract Reputation {

    // The reputation balance of every address
    mapping (address => uint256) repBalance;
    
    //
    struct Proposal {
        address recipient;
        
    }
    
    constructor() public {
        
    }
    
    function createVote() public {
        
    }
} 