pragma solidity ^0.5.0;

import "./Account.sol";

import "./Services/DSR.sol";
import "./Services/iDAI.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

// This contract manages interactions to current lending protocols
contract Lending is Account, DSR, iDAI {
    using SafeMath for uint256;
    
    // 1 = DSR, 2 = iDAI
    enum LendingType {
        DSR,
        iDAI
    }
    
    LendingType lendingType = LendingType.DSR;
    
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
    
    function _transfer(address _to, uint256 _value, uint256 _stakePrice, uint256 _duration) internal {
        super._transfer(_to, _value, _duration);
        super._transfer(msg.sender, _stakePrice, _duration);
        
        uint256 total = _value + _stakePrice;
        
        // Transfer DAI (Stake + cost) to contract
        require(daiContract.transferFrom(msg.sender, address(this), total), "Something went wrong");
        
        // Handle transfer of DAI
        _handleInterestToken(total);
    }
    
    //---Interest---
    
    function _handleInterestToken(uint256 _balance) internal {
        if (lendingType == LendingType.DSR) {
            _join(_balance);
        } else if (lendingType == LendingType.iDAI) {
            _mint(_balance);
        }
    }
    
    function _redeemUnderlying(uint256 _balance) internal {
        if (lendingType == LendingType.DSR) {
            _exit(_balance);
        } else if (lendingType == LendingType.iDAI) {
            _burn(address(this), _balance);
        }
    }
    
    function balance() public view returns (uint256) {
        if (lendingType == LendingType.DSR) {
            return _DSRBalance();
        } else if (lendingType == LendingType.iDAI) {
            return _iDaiBalance();
        }
    }
}