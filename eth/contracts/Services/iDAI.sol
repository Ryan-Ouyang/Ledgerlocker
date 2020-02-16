pragma solidity ^0.5.0;
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract iDAIInterface {
    function mint(address receiver, uint256 depositAmount) external returns (uint256 mintAmount); 
    function burn(address receiver, uint256 burnAmount) external returns (uint256 loanAmountPaid);
    function assetBalanceOf(address _owner) public view returns (uint256);
}

contract iDAI {
    iDAIInterface  public iDaiContract = iDAIInterface(address(0x6c1E2B0f67e00c06c8e2BE7Dc681Ab785163fF4D));
    IERC20 daiContract = IERC20(address(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa));

    function _mint(uint256 _depositAmount) internal {
        daiContract.approve(address(iDaiContract), _depositAmount);
        iDaiContract.mint(address(this), _depositAmount);
    }
    
    function _burn(address _receiver, uint256 _burnAmount) internal {
        iDaiContract.burn(_receiver, _burnAmount);
    }
    
    function _iDaiBalance() internal view returns (uint256) {
        return iDaiContract.assetBalanceOf(address(this));
    }
}