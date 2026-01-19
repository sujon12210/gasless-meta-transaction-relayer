# Gasless Meta-Transaction Relayer

![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)
![Standard](https://img.shields.io/badge/EIP-2771-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

**Gasless Meta-Transactions** solve the "cold start" problem in Web3. Instead of a user signing a transaction and paying gas, they sign a message (off-chain). A "Relayer" (backend server) takes this signature and submits the transaction to the blockchain, paying the gas fee.

## Architecture (EIP-2771)

1.  **Trusted Forwarder**: A contract that verifies the user's signature.
2.  **Recipient Contract**: The DApp contract (e.g., a Token) that trusts the Forwarder.
3.  **Relayer**: A script/server that wraps the user's request into a blockchain transaction.

## Workflow

1.  **Sign**: User signs a structured message (EIP-712) expressing intent (e.g., "Transfer 10 tokens").
2.  **Send**: User sends the signature + data to the Relayer API (HTTP).
3.  **Execute**: Relayer validates the request and submits it to the Forwarder contract.
4.  **Verify**: Forwarder recovers the signer address and calls the Recipient Contract.

## Usage

```bash
# 1. Install
npm install

# 2. Deploy Forwarder & Target Contract
npx hardhat run deploy.js --network localhost

# 3. User generates a signature (Off-chain)
node sign_request.js

# 4. Relayer submits the transaction
node relay_tx.js
