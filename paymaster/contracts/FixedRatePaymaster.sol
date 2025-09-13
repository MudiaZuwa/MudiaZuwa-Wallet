// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@account-abstraction/contracts/interfaces/PackedUserOperation.sol";
import "hardhat/console.sol";


contract FixedRatePaymaster is BasePaymaster {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;     // ERC20 used for payment
    uint256 public immutable rate;     // tokens per 1 wei of gas

    event TokensCharged(address indexed sender, uint256 amount, uint256 gasUsed);
    event TokensWithdrawn(address indexed to, uint256 amount);

    constructor(address _entryPoint, address _token, uint256 _rate) 
        BasePaymaster(IEntryPoint(_entryPoint)) 
    {
        token = IERC20(_token);
        rate = _rate;
    }



    // calculate required token amount (upper bound)
  function _validatePaymasterUserOp(
    PackedUserOperation calldata userOp,
    bytes32, /* userOpHash */
    uint256 requiredPreFund
) internal view override returns (bytes memory context, uint256 validationData) {

        uint256 tokenRequired = requiredPreFund * rate;
        address sender = userOp.sender;

        // check allowance + balance
        if (token.allowance(sender, address(this)) < tokenRequired) {
            return ("", 1); // fail validation
        }
        if (token.balanceOf(sender) < tokenRequired) {
            return ("", 1); // fail validation
        }

        // pass context to postOp
        return (abi.encode(sender), 0);
    }

    // after tx is executed, actually pull the tokens
  function _postOp(
    PostOpMode,
    bytes calldata context,
    uint256 actualGasCost,
    uint256 /* actualUserOpFeePerGas */
) internal override {
    address sender = abi.decode(context, (address));
    uint256 tokensToCharge = actualGasCost * rate;

    token.safeTransferFrom(sender, address(this), tokensToCharge);

    emit TokensCharged(sender, tokensToCharge, actualGasCost);
}

    // allow owner to withdraw tokens
    function withdrawTokens(address to) external onlyOwner {
        uint256 bal = token.balanceOf(address(this));
        token.safeTransfer(to, bal);
        emit TokensWithdrawn(to, bal);
    }

    // allow owner to top-up ETH for gas
    receive() external payable {}
}