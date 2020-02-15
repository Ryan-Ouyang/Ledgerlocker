pragma solidity ^0.5.0;

import "./Account.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface for Compound's CEther contract
// Minting and redeeming CEther
contract CEther {
    function mint() external payable;
    function redeem(uint redeemTokens) external returns (uint);
    function exchangeRateCurrent() public returns (uint);
    function balanceOfUnderlying(address account) public returns (uint);
    function redeemUnderlying(uint redeemAmount) public returns (uint);
    // Part of the ERC20 Token Standard
    function balanceOf(address owner) external view returns (uint256 balance);
}

// This contract manages interactions to current lending protocols
// TODO: Extend to CDai and DSR 
contract DAILending is Account {
    
    IERC20 daiContract = IERC20(address(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e));

    function withdraw() internal returns (uint256) {
        uint256 totalBalance = _withdraw();
        
        _redeemUnderlying(totalBalance);
        
        // Send DAI to User
        msg.sender.transfer(totalBalance);
    }
    
    function _transfer(address _to, uint256 _value, uint256 _duration) internal {
        super._transfer(_to, _value, _duration);
    }
    
    function _mintCToken() internal {
        // Put the paid amount into compound here
        // cToken.mint.value(msg.value)();
    }
    
    function _redeemUnderlying(uint256 _balance) internal {
        // require(cToken.redeemUnderlying(_balance) == 0, "something went wrong");
    }
}