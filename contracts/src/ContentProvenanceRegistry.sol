// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AgentIdentityRegistry.sol";

/// @notice Registry that binds a 64-bit perceptual hash to an agent identity on Monad.
contract ContentProvenanceRegistry {
    AgentIdentityRegistry public immutable identityRegistry;

    uint256 private _nextContentId = 1;

    struct ContentRecord {
        uint256 agentId;
        bytes8 phash;
        uint256 timestamp;
    }

    // contentId => ContentRecord
    mapping(uint256 => ContentRecord) private _records;

    event ContentRegistered(
        uint256 indexed contentId,
        uint256 indexed agentId,
        bytes8 phash
    );

    error NotAgentOwner();
    error AgentNotRegistered();
    error ContentNotFound();

    constructor(address _identityRegistry) {
        identityRegistry = AgentIdentityRegistry(_identityRegistry);
    }

    /// @notice Register a perceptual hash tied to an agent identity.
    /// @param agentId The agent that owns this content.
    /// @param phash   64-bit perceptual hash of the content file (bytes8).
    /// @return contentId The newly assigned content ID.
    function registerContent(uint256 agentId, bytes8 phash)
        external
        returns (uint256 contentId)
    {
        // Only the agent's owner EOA can register content for it
        address owner = identityRegistry.getAgent(agentId);
        if (msg.sender != owner) revert NotAgentOwner();

        contentId = _nextContentId++;
        _records[contentId] = ContentRecord({
            agentId: agentId,
            phash: phash,
            timestamp: block.timestamp
        });

        emit ContentRegistered(contentId, agentId, phash);
    }

    /// @notice Retrieve content record by contentId.
    function getContent(uint256 contentId)
        external
        view
        returns (uint256 agentId, bytes8 phash, uint256 timestamp)
    {
        ContentRecord storage r = _records[contentId];
        if (r.timestamp == 0) revert ContentNotFound();
        return (r.agentId, r.phash, r.timestamp);
    }
}
