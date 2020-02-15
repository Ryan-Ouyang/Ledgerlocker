pragma solidity ^0.5.0;
import "./Lending.sol";


// Generic Non-transferrable reputation management tied to voting behaviour
contract Reputation is Lending {

    // The reputation balance of every address
    mapping (address => uint256) repBalance;
} 