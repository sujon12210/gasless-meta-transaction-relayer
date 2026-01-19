const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./config.json");
const { signMetaTxRequest } = require("./eip712_utils");

async function main() {
    const [_, user] = await ethers.getSigners(); // User who wants to tx without gas
    const forwarder = await ethers.getContractAt("MinimalForwarder", config.forwarder);
    const token = await ethers.getContractAt("RecipientToken", config.token);

    console.log(`User ${user.address} preparing gasless transfer...`);

    // 1. Construct the function call (Transfer 50 tokens)
    // We encode the function data exactly as we would for a normal tx
    const data = token.interface.encodeFunctionData("transfer", [
        "0x000000000000000000000000000000000000dEaD", // sending to burn address
        ethers.parseEther("50")
    ]);

    // 2. Get Nonce
    const nonce = await forwarder.getNonce(user.address);

    // 3. Create Request Object
    const request = {
        from: user.address,
        to: config.token,
        value: 0,
        gas: 1e6, // Gas limit for the inner execution
        nonce: nonce,
        data: data,
    };

    // 4. Sign Request (EIP-712)
    const signature = await signMetaTxRequest(user, forwarder, request);

    console.log("Signature generated:", signature);
    
    // Save request to file so the "Relayer" script can pick it up
    fs.writeFileSync("signed_request.json", JSON.stringify({ request, signature }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
