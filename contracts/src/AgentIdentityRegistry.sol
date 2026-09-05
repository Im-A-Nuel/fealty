// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Registry that mints a unique agentId (uint256) bound to a passkey-derived EOA.
/// Identity is represented as a non-transferable NFT following the ERC-8004 pattern.
contract AgentIdentityRegistry {
    uint256 private _nextAgentId = 1;

    // agentId => owner address
    mapping(uint256 => address) private _owners;

    // owner address => agentId (0 = not registered)
    mapping(address => uint256) private _agentIds;

    event AgentRegistered(uint256 indexed agentId, address indexed owner);

    error AlreadyRegistered();
    error ZeroAddress();
    error AgentNotFound();
    error CallerMustBeOwner();

    /// @notice Register a new agent identity bound to msg.sender.
    /// @return agentId The newly minted agent ID.
    function register() external returns (uint256 agentId) {
        if (msg.sender == address(0)) revert ZeroAddress();
        if (_agentIds[msg.sender] != 0) revert AlreadyRegistered();

        agentId = _nextAgentId++;
        _owners[agentId] = msg.sender;
        _agentIds[msg.sender] = agentId;

        emit AgentRegistered(agentId, msg.sender);
    }

    /// @notice Spec-compatible overload: register on behalf of an address.
    /// Safer than a pure open register(address) — owner must be msg.sender itself,
    /// so no one can register an address without that address's own transaction.
    /// @dev owner parameter is accepted for ABI compatibility with SCHEMA.md but
    ///      must equal msg.sender; reverts otherwise.
    function register(address owner) external returns (uint256 agentId) {
        if (owner == address(0)) revert ZeroAddress();
        if (owner != msg.sender) revert CallerMustBeOwner();
        if (_agentIds[owner] != 0) revert AlreadyRegistered();

        agentId = _nextAgentId++;
        _owners[agentId] = owner;
        _agentIds[owner] = agentId;

        emit AgentRegistered(agentId, owner);
    }

    /// @notice Returns the owning address of an agentId.
    function getAgent(uint256 agentId) external view returns (address) {
        address owner = _owners[agentId];
        if (owner == address(0)) revert AgentNotFound();
        return owner;
    }

    /// @notice ERC-721-style owner lookup.
    function ownerOf(uint256 agentId) external view returns (address) {
        address owner = _owners[agentId];
        if (owner == address(0)) revert AgentNotFound();
        return owner;
    }

    /// @notice Returns the agentId registered for an address (0 if none).
    function agentIdOf(address owner) external view returns (uint256) {
        return _agentIds[owner];
    }
}
