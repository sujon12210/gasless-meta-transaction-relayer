// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Example Token that supports gasless transfers via the Forwarder.
 */
contract RecipientToken is ERC20, ERC2771Context, Ownable {
    constructor(address trustedForwarder)
        ERC20("Gasless Token", "GASLESS")
        ERC2771Context(trustedForwarder)
        Ownable(msg.sender)
    {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Override msg.sender to handle the meta-transaction logic automatically
    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
    
    // We overriding Context, so we need this
    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
