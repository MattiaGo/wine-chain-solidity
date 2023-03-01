// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error Product__NotOwner();
error ProductContract__ContractClosed();

/**
 * @title Contract
 * @dev store IPFS hash of a file
 */
contract TestProductContract {
    /* Type declarations */
    enum ProductContractState {
        OPEN,
        CLOSED
    }
    ProductContractState private s_contractState;

    address public immutable i_owner;

    string public i_product_name;
    string public i_product_ID;
    string public i_contract_type;

    address[] public s_parent_contracts;
    string[] public s_ipfsHashes;

    //uint256 private s_hash_counter = 0;
    //uint256 private s_parent_counter = 0;

    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != i_owner) revert Product__NotOwner();
        _;
    }

    //Events
    //event DocumentLoadedOnIPFS();
    event HashWrittenIntoContract(string[]);

    constructor(
        string memory product_name,
        string memory product_ID,
        string memory contract_type,
        address[] memory parentContracts,
        string[] memory hashes
    ) {
        i_owner = msg.sender;
        i_product_name = product_name;
        i_product_ID = product_ID;
        i_contract_type = contract_type;
        s_contractState = ProductContractState.OPEN;
        s_parent_contracts = parentContracts;
        s_ipfsHashes = hashes;
    }

    //GETTER FOR VARIABLES
    /*function getOwner() public view returns (address) {
        return i_owner;
    }

    function getProductName() public view returns (string memory) {
        return i_product_name;
    }

    function getProductID() public view returns (string memory) {
        return i_product_ID;
    }

    function getContractType() public view returns (string memory) {
        return i_contract_type;
    }
    */

    //DOCUMENT HASH FUNCTIONS -----------
    /*function addHash(string memory hash) public onlyOwner {
        if (s_contractState != ProductContractState.OPEN) {
            revert ProductContract__ContractClosed();
        }

        s_ipfsHashes.push(hash);
        emit DocumentLoadedOnIPFS();
        emit HashWrittenIntoContract(hash);
        //s_hash_counter += 1;
    }*/

    struct Multihash {
        string file_name;
        bytes1 hash_function;
        bytes1 size;
        bytes32 hash;
    }

    Multihash public multihash;

    Multihash[] public multihashes;

    function storeCIDAsStruct(
        string memory file_name,
        bytes1 hash_function,
        bytes1 size,
        bytes32 digest
    ) public onlyOwner {
        multihash = Multihash(file_name, hash_function, size, digest);
    }

    function storeMultiplesCIDAsStruct(Multihash[] memory multi) public onlyOwner {
        uint arrayLength = multi.length;
        for (uint i = 0; i < arrayLength; i++) {
            multihashes.push(multi[i]);
            //s_hash_counter += 1;
        }
    }

    event CIDStructStoredInTheLog(bytes1 hash_function, bytes1 size, bytes32 hash);

    function storeCIDStructInTheLog(bytes1 _hash_function, bytes1 _size, bytes32 _hash) public {
        emit CIDStructStoredInTheLog(_hash_function, _size, _hash);
    }

    event MultiCIDStructStoredInTheLog(Multihash[]);

    function multiStoreCIDStructInTheLog(Multihash[] memory multi) public {
        emit MultiCIDStructStoredInTheLog(multi);
    }

    function addHash(string memory hash) public onlyOwner {
        if (s_contractState != ProductContractState.OPEN) {
            revert ProductContract__ContractClosed();
        }
        s_ipfsHashes.push(hash);

        //emit DocumentLoadedOnIPFS();
        //emit HashWrittenIntoContract(hash);
    }

    function addHashes(string[] memory hashes) public onlyOwner {
        if (s_contractState != ProductContractState.OPEN) {
            revert ProductContract__ContractClosed();
        }
        uint arrayLength = hashes.length;
        for (uint i = 0; i < arrayLength; i++) {
            s_ipfsHashes.push(hashes[i]);
            //s_hash_counter += 1;
        }

        //emit DocumentLoadedOnIPFS();
        emit HashWrittenIntoContract(hashes);
    }

    /*function getHash(uint256 counter) public view returns (string memory) {
        return s_ipfsHashes[counter];
    }*/

    function getAllHashes() public view returns (string[] memory) {
        return s_ipfsHashes;
    }

    /*function getHashCounter() public view returns (uint256) {
        return s_hash_counter;
    }*/

    //Parent CONTRACT FUNCTIONS -----------
    function addParentContract(address parent_contract) public onlyOwner {
        if (s_contractState != ProductContractState.OPEN) {
            revert ProductContract__ContractClosed();
        }
        s_parent_contracts.push(parent_contract);
        //s_parent_counter += 1;
    }

    function addParentContracts(address[] memory parent_contracts) public onlyOwner {
        if (s_contractState != ProductContractState.OPEN) {
            revert ProductContract__ContractClosed();
        }
        uint arrayLength = parent_contracts.length;
        for (uint i = 0; i < arrayLength; i++) {
            s_parent_contracts.push(parent_contracts[i]);
            //s_hash_counter += 1;
        }
    }

    /*function getParentContract(uint256 counter) public view returns (address) {
        return s_parent_contract[counter];
    }*/

    function getAllParentContracts() public view returns (address[] memory) {
        return s_parent_contracts;
    }

    /*function getParentCounter() public view returns (uint256) {
        return s_parent_counter;
    }*/

    //CLOSE CONTRACT
    function closeContract() public onlyOwner {
        s_contractState = ProductContractState.CLOSED;
    }

    /*function getContractState() public view returns (ProductContractState) {
        return s_contractState;
    }*/
}
