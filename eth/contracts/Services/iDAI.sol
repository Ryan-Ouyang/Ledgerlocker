pragma solidity ^0.5.0;

contract iDAIInterface {
    function mint(address receiver, uint256 depositAmount) external returns (uint256 mintAmount);
    function burn(address receiver, uint256 burnAmount) external returns (uint256 loanAmountPaid);
    function assetBalanceOf(address _owner) public view returns (uint256);
}

contract iDAI {
    iDAIInterface  public iDaiContract = iDAIInterface(address(0x8c7d9256Dd1cea20890c6204022fd75F7aF9BD62));
    
    function _mint(address _receiver, uint256 _depositAmount) internal {
        iDaiContract.mint(_receiver, _depositAmount);
    }
    
    function _burn(address _receiver, uint256 _burnAmount) internal {
        iDaiContract.burn(_receiver, _burnAmount);
    }
    
    function _iDaiBalance() internal view returns (uint256) {
        return iDaiContract.assetBalanceOf(address(this));
    }
}