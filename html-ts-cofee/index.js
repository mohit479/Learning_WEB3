import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem";
import { contractAddress, cofeeAbi } from "./constants-js.js";

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const ethAmount = document.getElementById('ethAmount');
const balanceButton = document.getElementById('getBallance');
const withdrawButton = document.getElementById('withdrawButton');
const addressInut = document.getElementById("addr");
const getAmountButton = document.getElementById("howMuch");

// NEW: Grab the display elements
const balanceDisplay = document.getElementById('balanceDisplay');
const amountDisplay = document.getElementById('amountDisplay');

let walletClient;
let publicClient;

async function connect() {
    if (typeof window.ethereum != "undefined") {
        walletClient = createWalletClient({ transport: custom(window.ethereum) });
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = ("Please install Metamask");
    }
}

async function fund() {
    if (typeof window.ethereum != "undefined") {
        walletClient = createWalletClient({ transport: custom(window.ethereum) });
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        connectButton.innerHTML = "Connected!";
        publicClient = createPublicClient({ transport: custom(window.ethereum) });

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: cofeeAbi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount.value)
        });
        const hash = await walletClient.writeContract(request);
        console.log(hash);
    } else {
        connectButton.innerHTML = ("Please install Metamask");
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        walletClient = createWalletClient({ transport: custom(window.ethereum) })
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({ transport: custom(window.ethereum) })

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: cofeeAbi,
            functionName: "withdraw",
            account: connectedAccount,
            chain: currentChain,
        })
        const hash = await walletClient.writeContract(request);
        console.log(hash);
    }
}

async function getAmount() {
    if (typeof window.ethereum != "undefined") {
        publicClient = createPublicClient({ transport: custom(window.ethereum) });

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: cofeeAbi,
            functionName: "getAddressToAmountFunded",
            args: [addressInut.value]
        });

        // 'hash' here is actually the return value (BigInt)
        const hash = await publicClient.readContract(request);
        console.log(hash);

        // --- UI UPDATE ---
        const formattedAmount = formatEther(hash);
        amountDisplay.innerHTML = `Donated: ${formattedAmount} ETH`;
        amountDisplay.classList.add('visible'); // Triggers the CSS animation

        return hash;
    } else {
        connectButton.innerHTML = ("Please install Metamask");
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({ transport: custom(window.ethereum) });
        const balance = await publicClient.getBalance({ address: contractAddress });

        console.log(formatEther(balance));

        // --- UI UPDATE ---
        const formattedBalance = formatEther(balance);
        balanceDisplay.innerHTML = `Contract Balance: ${formattedBalance} ETH`;
        balanceDisplay.classList.add('visible'); // Triggers the CSS animation
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
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
    })
    return currentChain
}

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
getAmountButton.onclick = getAmount