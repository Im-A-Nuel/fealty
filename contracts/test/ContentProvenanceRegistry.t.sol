// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AgentIdentityRegistry.sol";
import "../src/ContentProvenanceRegistry.sol";

contract ContentProvenanceRegistryTest is Test {
    AgentIdentityRegistry identity;
    ContentProvenanceRegistry provenance;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    bytes8 constant PHASH = bytes8(hex"a1b2c3d4e5f60718");

    function setUp() public {
        identity = new AgentIdentityRegistry();
        provenance = new ContentProvenanceRegistry(address(identity));
    }

    function test_RegisterContent() public {
        vm.prank(alice);
        uint256 agentId = identity.register();

        vm.prank(alice);
        uint256 contentId = provenance.registerContent(agentId, PHASH);

        assertEq(contentId, 1);

        (uint256 retAgentId, bytes8 retPhash, uint256 ts) = provenance.getContent(contentId);
        assertEq(retAgentId, agentId);
        assertEq(retPhash, PHASH);
        assertGt(ts, 0);
    }

    function test_RevertIfNotAgentOwner() public {
        vm.prank(alice);
        uint256 agentId = identity.register();

        vm.prank(bob);
        vm.expectRevert(ContentProvenanceRegistry.NotAgentOwner.selector);
        provenance.registerContent(agentId, PHASH);
    }

    function test_RevertGetContentNotFound() public {
        vm.expectRevert(ContentProvenanceRegistry.ContentNotFound.selector);
        provenance.getContent(999);
    }

    function test_RegisterMultipleContents() public {
        vm.prank(alice);
        uint256 agentId = identity.register();

        vm.prank(alice);
        uint256 c1 = provenance.registerContent(agentId, PHASH);

        vm.prank(alice);
        uint256 c2 = provenance.registerContent(agentId, bytes8(hex"0102030405060708"));

        assertEq(c1, 1);
        assertEq(c2, 2);
    }
}
