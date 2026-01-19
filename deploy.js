const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with:", deployer.address);

    // 1. Deploy Forwarder
    const Forwarder = await ethers.getContractFactory("MinimalForwarder");
    const forwarder = await Forwarder.deploy();
    await forwarder.waitForDeployment();
    const forwarderAddr = await forwarder.getAddress();
    console.log("MinimalForwarder deployed at:", forwarderAddr);

    // 2. Deploy Recipient Token (Trusting the Forwarder)
    const Token = await ethers.getContractFactory("RecipientToken");
    const token = await Token.deploy(forwarderAddr);
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log("RecipientToken deployed at:", tokenAddr);

    // Save Config
    const config = { forwarder: forwarderAddr, token: tokenAddr };
    fs.writeFileSync("config.json", JSON.stringify(config));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
