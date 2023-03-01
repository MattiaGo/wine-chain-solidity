# wine-chain-solidity

Solidity smart contract for a wine blockchain

### Prerequisites

-   Solc compiler
-   Npm
-   Node.js
-   Ganache
-   Metamask

### Installation

Clone the wine-chain-solidity folder from Github.

From the wine-chain-solidity folder execute the command:

```bash
npm install --force
```

### Ganache Setup

-   Download the Ganache application and start a new workspace using the quickstart button.
-   Copy an account private key to a .env file inside the wine-chain-solidity folder under the “PRIVATE_KEY” variable. (see .env example file)
    Check in the Ganache Application that RPC SERVER matches the value at line 37 of the hardhat.config.js file in the wine-chain-solidity folder.

### Metamask Setup

-   Install the Metamask chrome extension and create an account importing the same private key copied in the Ganache Setup.

### (Optional) To publish test values to the blockchain run the following commands in this order:

```bash
yarn hardhat deploy --network ganache
yarn hardhat run scripts/createEventBatches.js --network ganache
yarn hardhat run scripts/createFakeHash.js --network ganache
```

Note: for simplicity, these test data are all published from the same account (therefore by the same private key). In a real scenario, each smart contract will have to correspond to a different owner, so to a different private key.
