// Helper to structure data for EIP-712 signing
const signMetaTxRequest = async (signer, forwarder, input) => {
    const forwarderAddress = await forwarder.getAddress();
    const network = await forwarder.runner.provider.getNetwork();
    const chainId = network.chainId;

    const domain = {
        name: 'MinimalForwarder',
        version: '0.0.1',
        chainId: chainId,
        verifyingContract: forwarderAddress,
    };

    const types = {
        ForwardRequest: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'gas', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'data', type: 'bytes' },
        ],
    };

    return await signer.signTypedData(domain, types, input);
};

module.exports = { signMetaTxRequest };
