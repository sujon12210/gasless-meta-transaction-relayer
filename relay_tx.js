const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./config.json");
const packet = require("./signed_request.json");

async function main() {
    const [relayer] = await ethers.getSigners(); // Relayer pays the gas
    const forwarder = await ethers.getContractAt("MinimalForwarder", config.forwarder, relayer);
    const token = await ethers.getContractAt("RecipientToken", config.token, relayer);

    // Setup: Mint tokens to user first so they have something to transfer
    // (In reality, user would already have tokens)
    const amount = ethers.parseEther("100");
    await token.mint(packet.request.from, amount);
    console.log(`Setup: Minted 100 tokens to ${packet.request.from}`);

    console.log(`Relayer ${relayer.address} submitting transaction...`);

    try {
        // Relayer submits the user's request and signature to the forwarder
        const tx = await forwarder.execute(packet.request, packet.signature);
        await tx.wait();
        
        console.log("Transaction Relayed Successfully!");
        
        // Verify Balance change
        const bal = await token.balanceOf(packet.request.from);
        console.log(`User Balance after transfer: ${ethers.formatEther(bal)} (Should be 50)`);
        
    } catch (e) {
        console.error("Relay Failed:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
