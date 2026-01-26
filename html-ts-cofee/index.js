import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem";
import { contractAddress, cofeeAbi } from "./constants-js.js";

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const ethAmount = document.getElementById('ethAmount');
const balanceButton = document.getElementById('getBallance');
const withdrawButton = document.getElementById('withdrawButton');
const addressInut = document.getElementById("addr");
const getAmountButton = document.getElementById("howMuch");

let walletClient;
let publicClient;

async function connect() {
    if (typeof window.ethereum != "undefined") {

        walletClient = createWalletClient({ transport: custom(window.ethereum) });
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected!";
    }
    else {
        connectButton.innerHTML = ("install metamask first");
    }
}



async function fund() {
    if (typeof window.ethereum != "undefined") {

        walletClient = createWalletClient({ transport: custom(window.ethereum) });
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);
        connectButton.innerHTML = "Connected!";

        publicClient = createPublicClient({ transport: custom(window.ethereum) });

        // console.log(parseEther(ethAmount.value));
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
    }
    else {
        connectButton.innerHTML = ("install metamask first");
    }
    // console.log(`funding with ${ethAmount.value}`);

}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        })

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

        // console.log(parseEther(ethAmount.value));
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: cofeeAbi,
            functionName: "getAddressToAmountFunded",
            args: [addressInut.value]

        });
        const hash = await publicClient.readContract(request);
        console.log(hash);
        return hash;
    }
    else {
        connectButton.innerHTML = ("install metamask first");
    }
}



async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({ transport: custom(window.ethereum) });
        const balance = await publicClient.getBalance({ address: contractAddress });
        console.log(formatEther(balance));
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


// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
