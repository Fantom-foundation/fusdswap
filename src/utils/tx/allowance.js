import { encodeFunctionData } from './encodeFunctionData/encodeFunctionData.js';

export function approve(amount, tokenAddress, contractAddress) {
    return {
        to: tokenAddress,
        value: '0x0',
        data: encodeFunctionData(
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [contractAddress, amount]
        ),
    };
}
