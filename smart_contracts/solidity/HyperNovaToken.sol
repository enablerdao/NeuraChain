// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HyperNovaToken
 * @dev ERC20 token for HyperNova Chain with governance features
 */
contract HyperNovaToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    
    // Maximum supply
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Governance settings
    uint256 public proposalCount;
    uint256 public votingPeriod = 3 days;
    uint256 public quorum = 10; // 10% of total supply
    
    // Proposal struct
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // Mapping from proposal ID to proposal data
    mapping(uint256 => Proposal) public proposals;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    
    /**
     * @dev Constructor
     * @param initialSupply Initial token supply
     */
    constructor(uint256 initialSupply) ERC20("HyperNova Token", "HNC") {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(GOVERNANCE_ROLE, msg.sender);
        
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Mint new tokens
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Create a new governance proposal
     * @param description Proposal description
     * @return proposalId The ID of the new proposal
     */
    function createProposal(string memory description) public returns (uint256) {
        require(balanceOf(msg.sender) >= 1000 * 10**18, "Must hold at least 1000 tokens to propose");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        
        emit ProposalCreated(proposalId, msg.sender, description);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     * @param proposalId Proposal ID
     * @param support Whether to support the proposal
     */
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 weight = balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit Voted(proposalId, msg.sender, support, weight);
    }
    
    /**
     * @dev Execute a proposal
     * @param proposalId Proposal ID
     */
    function executeProposal(uint256 proposalId) public onlyRole(GOVERNANCE_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 quorumVotes = (totalSupply() * quorum) / 100;
        
        require(totalVotes >= quorumVotes, "Quorum not reached");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
        
        // In a real implementation, this would execute the proposal's actions
    }
    
    /**
     * @dev Set the voting period
     * @param newVotingPeriod New voting period in seconds
     */
    function setVotingPeriod(uint256 newVotingPeriod) public onlyRole(GOVERNANCE_ROLE) {
        require(newVotingPeriod >= 1 days, "Voting period too short");
        require(newVotingPeriod <= 14 days, "Voting period too long");
        
        votingPeriod = newVotingPeriod;
    }
    
    /**
     * @dev Set the quorum percentage
     * @param newQuorum New quorum percentage
     */
    function setQuorum(uint256 newQuorum) public onlyRole(GOVERNANCE_ROLE) {
        require(newQuorum >= 5, "Quorum too low");
        require(newQuorum <= 50, "Quorum too high");
        
        quorum = newQuorum;
    }
    
    /**
     * @dev Hook that is called before any transfer of tokens
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}