// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentTipJar
 * @dev A simple tip jar for AI agents to receive USDC/ETH tips
 * @author Seafloor 🦞
 */
contract AgentTipJar is Ownable {
    // USDC on Base
    IERC20 public constant USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    
    string public agentName;
    string public agentDescription;
    
    // Track tips
    mapping(address => uint256) public tipsByAddress;
    uint256 public totalTipsUSDC;
    uint256 public totalTipsETH;
    uint256 public tipperCount;
    
    event TipReceived(address indexed from, uint256 amount, bool isUSDC, string message);
    event Withdrawn(address indexed to, uint256 amountUSDC, uint256 amountETH);
    
    constructor(string memory _name, string memory _description) Ownable(msg.sender) {
        agentName = _name;
        agentDescription = _description;
    }
    
    /**
     * @dev Receive ETH tips
     */
    receive() external payable {
        if (tipsByAddress[msg.sender] == 0) {
            tipperCount++;
        }
        tipsByAddress[msg.sender] += msg.value;
        totalTipsETH += msg.value;
        emit TipReceived(msg.sender, msg.value, false, "");
    }
    
    /**
     * @dev Tip with USDC
     * @param amount Amount of USDC (6 decimals)
     * @param message Optional message with tip
     */
    function tipUSDC(uint256 amount, string calldata message) external {
        require(amount > 0, "Amount must be > 0");
        require(USDC.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (tipsByAddress[msg.sender] == 0) {
            tipperCount++;
        }
        tipsByAddress[msg.sender] += amount;
        totalTipsUSDC += amount;
        
        emit TipReceived(msg.sender, amount, true, message);
    }
    
    /**
     * @dev Withdraw all tips (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 usdcBalance = USDC.balanceOf(address(this));
        uint256 ethBalance = address(this).balance;
        
        if (usdcBalance > 0) {
            require(USDC.transfer(owner(), usdcBalance), "USDC transfer failed");
        }
        if (ethBalance > 0) {
            payable(owner()).transfer(ethBalance);
        }
        
        emit Withdrawn(owner(), usdcBalance, ethBalance);
    }
    
    /**
     * @dev Get contract stats
     */
    function getStats() external view returns (
        uint256 usdcBalance,
        uint256 ethBalance,
        uint256 totalUSDC,
        uint256 totalETH,
        uint256 tippers
    ) {
        return (
            USDC.balanceOf(address(this)),
            address(this).balance,
            totalTipsUSDC,
            totalTipsETH,
            tipperCount
        );
    }
}
