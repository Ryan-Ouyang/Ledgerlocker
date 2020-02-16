pragma solidity ^0.5.0;

import "./Account.sol";
import "./Services/DSR.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

// This contract manages interactions to current lending protocols
contract Lending is Account, DSR {
    using SafeMath for uint256;
    
    // DAI ERC20 Smart Contract 
    IERC20 daiContract = IERC20(address(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa));

    // Get the available balance that the admin earned
    function getAdminAccountBalance() public view returns (uint256) {
        
        // Get total DAI available to be redeemed from DSR
        uint256 balance = balance();
        
        return balance - totalUserBalance; 
    }
    
    // Withdraw the interest earned
    function adminWithdraw() public onlyOwner {
        uint256 balance = getAdminAccountBalance();
        
        _redeemUnderlying(balance);
        
        // Send DAI to User
        require(daiContract.transfer(msg.sender, balance), "Something went wrong");
    }
    
    // Withdraw the current locked balance
    function withdraw() public {
        uint256 totalBalance = _withdraw();
        
        _redeemUnderlying(totalBalance);
        
        // Send DAI to User
        require(daiContract.transfer(msg.sender, totalBalance), "Something went wrong");
    }
    
    function _transfer(address _to, uint256 _value, uint256 _duration) internal {
        super._transfer(_to, _value, _duration);
        
        // Transfer DAI to contract
        require(daiContract.transferFrom(msg.sender, address(this), _value), "Something went wrong");
        
        // Handle transfer of DAI
        _handleInterestToken(_value);
    }
    
    function _handleInterestToken(uint256 _balance) internal {
        //DSR
        _join(_balance);
    }
    
    function _redeemUnderlying(uint256 _balance) internal {
        //DSR
        _exit(_balance);
    }
}