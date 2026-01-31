'use client'

import { InputForm } from "@/components/UI/InputFeild";
import { useState } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constant";
import { useChainId, useConfig, useAccount } from "wagmi";
import { readContract } from '@wagmi/core';

export default function AirDropForm() {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amount, setAmmount] = useState("");
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found !!");
            return 0;
        }
        const responce = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })

        return responce as number

    }

    async function handleSubmit() {
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const ApprovedAmount = await getApprovedAmount(tSenderAddress);
        console.log(ApprovedAmount);
    }


    return (
        <div>
            <InputForm
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
            />

            <InputForm
                label="Recipients"
                placeholder="0x12345,0x789456"
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
            />

            <InputForm
                label="Amount"
                placeholder="100 ,200"
                value={amount}
                onChange={e => setAmmount(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
            >
                Send Airdrop
            </button>
        </div>
    )
}

// account id of anvil
// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512