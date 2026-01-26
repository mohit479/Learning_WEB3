import {
    createWalletClient,
    custom,
    createPublicClient,
    parseEther,
    defineChain,
    formatEther,
    type WalletClient,
    type PublicClient,
    type Address,
    type Chain
} from "viem";
import { contractAddress, cofeeAbi } from "./constants-ts";

// 1. Cast DOM elements to their specific types for property access (like .value)
const connectButton = document.getElementById('connectButton') as HTMLButtonElement;
const fundButton = document.getElementById('fundButton') as HTMLButtonElement;
const ethAmount = document.getElementById('ethAmount') as HTMLInputElement;
const balanceButton = document.getElementById('getBallance') as HTMLButtonElement;
const withdrawButton = document.getElementById('withdrawButton') as HTMLButtonElement;

// 2. Define types for your clients
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

// Extend the Window interface to recognize ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}

async function connect(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = "Install MetaMask first";
    }
}

async function fund(): Promise<void> {
    if (typeof window.ethereum !== "undefined" && ethAmount.value) {
        walletClient = createWalletClient({ transport: custom(window.ethereum) });

        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        connectButton.innerHTML = "Connected!";
        publicClient = createPublicClient({ transport: custom(window.ethereum) });

        // simulateContract provides better error catching before sending the tx
        const { request } = await publicClient.simulateContract({
            address: contractAddress as Address,
            abi: cofeeAbi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount.value)
        });

        const hash = await walletClient.writeContract(request);
        console.log("Transaction Hash:", hash);
    } else {
        connectButton.innerHTML = "Install MetaMask first";
    }
}

async function withdraw(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({ transport: custom(window.ethereum) });
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({ transport: custom(window.ethereum) });

        const { request } = await publicClient.simulateContract({
            address: contractAddress as Address,
            abi: cofeeAbi,
            functionName: "withdraw",
            account: connectedAccount,
            chain: currentChain,
        });

        const hash = await walletClient.writeContract(request);
        console.log("Withdraw Hash:", hash);
    }
}

async function getBalance(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({ transport: custom(window.ethereum) });
        const balance = await publicClient.getBalance({
            address: contractAddress as Address
        });
        console.log("Contract Balance:", formatEther(balance));
    }
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
    const chainId = await client.getChainId();
    return defineChain({
        id: chainId,
        name: "Custom Chain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"],
            },
        },
    });
}

// 3. Assign event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;