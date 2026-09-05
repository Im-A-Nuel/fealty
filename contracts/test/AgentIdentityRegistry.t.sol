// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AgentIdentityRegistry.sol";

contract AgentIdentityRegistryTest is Test {
    AgentIdentityRegistry registry;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        registry = new AgentIdentityRegistry();
    }

    function test_RegisterAgent() public {
        vm.prank(alice);
        uint256 agentId = registry.register();

        assertEq(agentId, 1);
        assertEq(registry.getAgent(agentId), alice);
        assertEq(registry.ownerOf(agentId), alice);
        assertEq(registry.agentIdOf(alice), 1);
    }

    function test_RegisterMultipleAgents() public {
        vm.prank(alice);
        uint256 idA = registry.register();

        vm.prank(bob);
        uint256 idB = registry.register();

        assertEq(idA, 1);
        assertEq(idB, 2);
    }

    function test_RevertIfAlreadyRegistered() public {
        vm.prank(alice);
        registry.register();

        vm.prank(alice);
        vm.expectRevert(AgentIdentityRegistry.AlreadyRegistered.selector);
        registry.register();
    }

    function test_RevertGetAgentNotFound() public {
        vm.expectRevert(AgentIdentityRegistry.AgentNotFound.selector);
        registry.getAgent(999);
    }

    function test_AgentIdOfUnregistered() public view {
        assertEq(registry.agentIdOf(alice), 0);
    }
}
