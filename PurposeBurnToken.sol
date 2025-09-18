// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IVault {
    function flushTokens(address token) external;
    function purposeVault() external view returns (address);
}

contract PurposeBurnToken is ERC20 {
    address public immutable vault;
    uint256 public constant FEE_BPS = 200; // 2%
    uint256 public constant BPS_DENOM = 10000;

    event BurnRedirect(address indexed from, address indexed vault, uint256 amount);

    constructor(address _vault, string memory name_, string memory symbol_, uint256 supply) ERC20(name_, symbol_) {
        require(_vault != address(0), "Zero vault");
        vault = _vault;
        _mint(msg.sender, supply);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        uint256 burnFee = amount * FEE_BPS / BPS_DENOM;
        uint256 sendAmount = amount - burnFee;
        super._transfer(from, vault, burnFee);
        super._transfer(from, to, sendAmount);
        emit BurnRedirect(from, vault, burnFee);
    }
}