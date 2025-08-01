// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract RebirthVault {
    address public immutable purposeVault;

    event Received(address indexed sender, uint256 amount);
    event TokensFlushed(address indexed token, uint256 amount);

    constructor(address _purposeVault) {
        require(_purposeVault != address(0), "Zero vault");
        purposeVault = _purposeVault;
    }

    receive() external payable {
        (bool sent, ) = purposeVault.call{value: msg.value}("");
        require(sent, "ETH forward failed");
        emit Received(msg.sender, msg.value);
    }

    function flushTokens(address token) external {
        require(token != address(0), "Zero token");
        uint256 bal = IERC20(token).balanceOf(address(this));
        require(bal > 0, "Nothing to flush");
        require(IERC20(token).transfer(purposeVault, bal), "Token transfer failed");
        emit TokensFlushed(token, bal);
    }
}