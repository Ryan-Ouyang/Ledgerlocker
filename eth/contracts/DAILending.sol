pragma solidity ^0.5.0;

import "./Account.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// This contract manages interactions to current lending protocols
contract DAILending is Account {
    
    IERC20 daiContract = IERC20(address(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e));

    function withdraw() internal returns (uint256) {
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
        // Put the paid amount into compound here
        // cToken.mint.value(msg.value)();
    }
    
    function _redeemUnderlying(uint256 _balance) internal {
        // require(cToken.redeemUnderlying(_balance) == 0, "something went wrong");
    }
}