// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AIModelMarketplace
 * @dev Marketplace for AI models on HyperNova Chain
 */
contract AIModelMarketplace is Ownable, ReentrancyGuard {
    // Token used for payments
    IERC20 public paymentToken;
    
    // Fee percentage (in basis points, 100 = 1%)
    uint256 public feePercentage = 250; // 2.5%
    
    // Model struct
    struct AIModel {
        address owner;
        string name;
        string description;
        string modelHash; // IPFS or other content-addressable storage hash
        uint256 price;
        uint256 createdAt;
        bool isActive;
        string[] tags;
        uint256 totalSales;
        uint256 totalRatings;
        uint256 ratingSum;
    }
    
    // Access record
    struct AccessRecord {
        uint256 expiresAt;
        bool hasAccess;
    }
    
    // Model ID counter
    uint256 private nextModelId = 1;
    
    // Mapping from model ID to model data
    mapping(uint256 => AIModel) public models;
    
    // Mapping from model ID to user address to access record
    mapping(uint256 => mapping(address => AccessRecord)) public modelAccess;
    
    // Mapping from user address to purchased model IDs
    mapping(address => uint256[]) public userPurchases;
    
    // Events
    event ModelListed(uint256 indexed modelId, address indexed owner, string name, uint256 price);
    event ModelPurchased(uint256 indexed modelId, address indexed buyer, uint256 price);
    event ModelRated(uint256 indexed modelId, address indexed rater, uint256 rating);
    event ModelUpdated(uint256 indexed modelId, string name, string description, uint256 price);
    event ModelRemoved(uint256 indexed modelId);
    
    /**
     * @dev Constructor
     * @param _paymentToken Address of the token used for payments
     */
    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev List a new AI model
     * @param _name Model name
     * @param _description Model description
     * @param _modelHash Model hash (IPFS or other)
     * @param _price Access price in tokens
     * @param _tags Array of tags
     * @return modelId The ID of the newly listed model
     */
    function listModel(
        string memory _name,
        string memory _description,
        string memory _modelHash,
        uint256 _price,
        string[] memory _tags
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_modelHash).length > 0, "Model hash cannot be empty");
        
        uint256 modelId = nextModelId++;
        
        models[modelId] = AIModel({
            owner: msg.sender,
            name: _name,
            description: _description,
            modelHash: _modelHash,
            price: _price,
            createdAt: block.timestamp,
            isActive: true,
            tags: _tags,
            totalSales: 0,
            totalRatings: 0,
            ratingSum: 0
        });
        
        emit ModelListed(modelId, msg.sender, _name, _price);
        
        return modelId;
    }
    
    /**
     * @dev Purchase access to a model
     * @param _modelId Model ID
     * @param _duration Access duration in seconds
     */
    function purchaseAccess(uint256 _modelId, uint256 _duration) external nonReentrant {
        AIModel storage model = models[_modelId];
        require(model.isActive, "Model is not active");
        
        uint256 price = model.price;
        require(price > 0, "Model is not for sale");
        
        // Calculate fee
        uint256 fee = (price * feePercentage) / 10000;
        uint256 sellerAmount = price - fee;
        
        // Transfer payment
        require(paymentToken.transferFrom(msg.sender, address(this), price), "Payment failed");
        require(paymentToken.transfer(model.owner, sellerAmount), "Transfer to seller failed");
        
        // Update access record
        modelAccess[_modelId][msg.sender] = AccessRecord({
            expiresAt: block.timestamp + _duration,
            hasAccess: true
        });
        
        // Update user purchases
        userPurchases[msg.sender].push(_modelId);
        
        // Update model stats
        model.totalSales++;
        
        emit ModelPurchased(_modelId, msg.sender, price);
    }
    
    /**
     * @dev Rate a model
     * @param _modelId Model ID
     * @param _rating Rating (1-5)
     */
    function rateModel(uint256 _modelId, uint256 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(hasAccess(_modelId, msg.sender), "Must have access to rate");
        
        AIModel storage model = models[_modelId];
        require(model.isActive, "Model is not active");
        
        model.totalRatings++;
        model.ratingSum += _rating;
        
        emit ModelRated(_modelId, msg.sender, _rating);
    }
    
    /**
     * @dev Update model details
     * @param _modelId Model ID
     * @param _name New name
     * @param _description New description
     * @param _price New price
     */
    function updateModel(
        uint256 _modelId,
        string memory _name,
        string memory _description,
        uint256 _price
    ) external {
        AIModel storage model = models[_modelId];
        require(msg.sender == model.owner, "Not the owner");
        
        if (bytes(_name).length > 0) {
            model.name = _name;
        }
        
        model.description = _description;
        model.price = _price;
        
        emit ModelUpdated(_modelId, model.name, model.description, model.price);
    }
    
    /**
     * @dev Remove a model from the marketplace
     * @param _modelId Model ID
     */
    function removeModel(uint256 _modelId) external {
        AIModel storage model = models[_modelId];
        require(msg.sender == model.owner || msg.sender == owner(), "Not authorized");
        
        model.isActive = false;
        
        emit ModelRemoved(_modelId);
    }
    
    /**
     * @dev Check if a user has access to a model
     * @param _modelId Model ID
     * @param _user User address
     * @return True if the user has access
     */
    function hasAccess(uint256 _modelId, address _user) public view returns (bool) {
        AccessRecord memory record = modelAccess[_modelId][_user];
        
        // Owner always has access
        if (models[_modelId].owner == _user) {
            return true;
        }
        
        return record.hasAccess && record.expiresAt > block.timestamp;
    }
    
    /**
     * @dev Get model details
     * @param _modelId Model ID
     * @return Model details
     */
    function getModel(uint256 _modelId) external view returns (
        address owner,
        string memory name,
        string memory description,
        uint256 price,
        uint256 createdAt,
        bool isActive,
        uint256 totalSales,
        uint256 averageRating
    ) {
        AIModel storage model = models[_modelId];
        
        uint256 avgRating = 0;
        if (model.totalRatings > 0) {
            avgRating = model.ratingSum / model.totalRatings;
        }
        
        return (
            model.owner,
            model.name,
            model.description,
            model.price,
            model.createdAt,
            model.isActive,
            model.totalSales,
            avgRating
        );
    }
    
    /**
     * @dev Get model tags
     * @param _modelId Model ID
     * @return Array of tags
     */
    function getModelTags(uint256 _modelId) external view returns (string[] memory) {
        return models[_modelId].tags;
    }
    
    /**
     * @dev Get user purchases
     * @param _user User address
     * @return Array of model IDs
     */
    function getUserPurchases(address _user) external view returns (uint256[] memory) {
        return userPurchases[_user];
    }
    
    /**
     * @dev Set fee percentage
     * @param _feePercentage New fee percentage (in basis points)
     */
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee too high"); // Max 10%
        feePercentage = _feePercentage;
    }
    
    /**
     * @dev Withdraw accumulated fees
     * @param _amount Amount to withdraw
     */
    function withdrawFees(uint256 _amount) external onlyOwner {
        require(paymentToken.transfer(owner(), _amount), "Transfer failed");
    }
}