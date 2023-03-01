//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error Product__NotOwner();
error ProductContract__ContractClosed();

/**
 * @title Contract
 * @dev store IPFS hash of a file
 */
contract StepChainContract {
    address public immutable i_owner;
    string public i_company_name;
    string public i_chain_id;
    string public i_chain_step;

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert Product__NotOwner();
        _;
    }

    constructor(string memory chain_id, string memory chain_step, string memory company_name) {
        i_owner = msg.sender;
        i_chain_id = chain_id;
        i_chain_step = chain_step;
        i_company_name = company_name;
    }

    struct Multihash {
        string file_name;
        bytes1 hash_function;
        bytes1 size;
        bytes32 hash;
    }

    struct ParentInfoBytes {
        address parent_contract;
        bytes32 product_id;
    }

    struct ParentInfo {
        address parent_contract;
        string product_id;
    }

    event emitBatch(
        string indexed idx_category,
        string indexed idx_product_id,
        string category,
        string product_id,
        ParentInfo[] parent,
        string product_name,
        string uom,
        uint256 quantity
    );

    function publishBatch(
        string memory category,
        string memory product_id,
        ParentInfo[] memory parent,
        string memory product_name,
        string memory uom,
        uint256 quantity
    ) public onlyOwner {
        emit emitBatch(
            category,
            product_id,
            category,
            product_id,
            parent,
            product_name,
            uom,
            quantity
        );
    }

    event emitBatchBytes(
        bytes32 indexed idx_category,
        bytes32 indexed idx_product_id,
        bytes32 category,
        bytes32 product_id,
        ParentInfoBytes[] parent,
        bytes32 product_name,
        bytes32 uom,
        uint256 quantity
    );

    function publishBatchBytes(
        bytes32 category,
        bytes32 product_id,
        ParentInfoBytes[] memory parent,
        bytes32 product_name,
        bytes32 uom,
        uint256 quantity
    ) public onlyOwner {
        emit emitBatchBytes(
            category,
            product_id,
            category,
            product_id,
            parent,
            product_name,
            uom,
            quantity
        );
    }

    event MultiCidStructStoredInTheLog(
        string indexed idx_category,
        string indexed idx_product_id,
        string category,
        string product_id,
        Multihash[] multi
    );

    function multiStoreCidStructInTheLog(
        string memory category,
        string memory product_id,
        Multihash[] memory multi
    ) public onlyOwner {
        emit MultiCidStructStoredInTheLog(category, product_id, category, product_id, multi);
    }

    event MultiCidStructStoredInTheLogBytes(
        bytes32 indexed idx_category,
        bytes32 indexed idx_product_id,
        bytes32 category,
        bytes32 product_id,
        Multihash[] multi
    );

    function multiStoreCidStructInTheLogBytes(
        bytes32 category,
        bytes32 product_id,
        Multihash[] memory multi
    ) public onlyOwner {
        emit MultiCidStructStoredInTheLogBytes(category, product_id, category, product_id, multi);
    }
}
