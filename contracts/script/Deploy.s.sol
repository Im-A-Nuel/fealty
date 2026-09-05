// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AgentIdentityRegistry.sol";
import "../src/ContentProvenanceRegistry.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        AgentIdentityRegistry identity = new AgentIdentityRegistry();
        console.log("AgentIdentityRegistry deployed at:", address(identity));

        ContentProvenanceRegistry provenance = new ContentProvenanceRegistry(address(identity));
        console.log("ContentProvenanceRegistry deployed at:", address(provenance));

        vm.stopBroadcast();
    }
}
