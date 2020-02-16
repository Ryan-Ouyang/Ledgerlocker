// https://github.com/makerdao/developerguides/blob/master/dai/dsr-integration-guide/dsr.sol
pragma solidity ^0.5.0;

contract PotLike {
    function chi() external view returns (uint256);
    function dsr() external view returns (uint256);
    function rho() external view returns (uint256);
    function drip() external returns (uint256);
    function join(uint256) external;
    function exit(uint256) external;
    function pie(address) public view returns (uint);

}

contract JoinLike {
    function join(address, uint) external;
    function exit(address, uint) external;
    function vat() public returns (VatLike);
    function dai() public returns (GemLike);

}

contract GemLike {
    function transferFrom(address,address,uint) external returns (bool);
    function approve(address,uint) external returns (bool);
}

contract VatLike {
    function hope(address) external;
    function dai(address) public view returns (uint);

}

contract DSR {

    // Contract interfaces
    PotLike  public pot = PotLike(address(0xEA190DBDC7adF265260ec4dA6e9675Fd4f5A78bb));
    JoinLike public daiJoin = JoinLike(address(0x5AA71a3ae1C0bd6ac27A1f28e1415fFFB6F15B8c));
    GemLike  public daiToken = GemLike(address(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa));
    VatLike  public vat = VatLike(address(0xbA987bDB501d131f766fEe8180Da5d81b34b69d9));

    // Supporting Math functions
    uint constant RAY = 10 ** 27;
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x);
    }
    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x);
    }
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    constructor() public {
        vat.hope(address(0x5AA71a3ae1C0bd6ac27A1f28e1415fFFB6F15B8c));
        vat.hope(address(0xEA190DBDC7adF265260ec4dA6e9675Fd4f5A78bb));

        daiToken.approve(0x5AA71a3ae1C0bd6ac27A1f28e1415fFFB6F15B8c, uint(-1));
    }

    function _join(uint wad) internal {
        uint chi = (now > pot.rho()) ? pot.drip() : pot.chi();
        // daiToken.transferFrom(msg.sender, address(this), wad);
        daiJoin.join(address(this), wad);
        pot.join(mul(wad, RAY) / chi);
    }

    function _exit(uint wad) internal {
        uint chi = (now > pot.rho()) ? pot.drip() : pot.chi();
        pot.exit(mul(wad, RAY) / chi);
        daiJoin.exit(msg.sender, daiJoin.vat().dai(address(this)) / RAY);
    }

    function _exitAll() internal {
        if (now > pot.rho()) pot.drip();
        pot.exit(pot.pie(address(this)));
        daiJoin.exit(msg.sender, daiJoin.vat().dai(address(this)) / RAY);
    }

    uint256 constant ONE = 10 ** 27;

    function rmul(uint x, uint y) internal pure returns (uint z) {
        z = mul(x, y) / ONE;
    }
    
    function rpow(uint x, uint n, uint base) internal pure returns (uint z) {
        assembly {
            switch x case 0 {switch n case 0 {z := base} default {z := 0}}
            default {
                switch mod(n, 2) case 0 { z := base } default { z := x }
                let half := div(base, 2)  // for rounding.
                for { n := div(n, 2) } n { n := div(n,2) } {
                    let xx := mul(x, x)
                    if iszero(eq(div(xx, x), x)) { revert(0,0) }
                    let xxRound := add(xx, half)
                    if lt(xxRound, xx) { revert(0,0) }
                    x := div(xxRound, base)
                    if mod(n,2) {
                        let zx := mul(z, x)
                        if and(iszero(iszero(x)), iszero(eq(div(zx, x), z))) { revert(0,0) }
                        let zxRound := add(zx, half)
                        if lt(zxRound, zx) { revert(0,0) }
                        z := div(zxRound, base)
                    }
                }
            }
        }
    }
    
    function balance() public view returns (uint256) {
       uint256 pie = pot.pie(address(this)); 
       uint256 chi = pot.chi();
       
       // DRIP
       uint256 rho = pot.rho();
       uint256 tmp = rmul(rpow(pot.dsr(), now - rho, ONE), chi);

       return pie * tmp / RAY;
    }
}