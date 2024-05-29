import { encodeFunctionData } from './encodeFunctionData/encodeFunctionData.js';

export function swapTokenForFUsd(amount, contractAddress) {
    return {
        to: contractAddress,
        value: '0x0',
        data: encodeFunctionData(
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'swap',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            [amount]
        ),
    };
}
