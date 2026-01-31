'use client'

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, zksync } from "wagmi/chains";

export default getDefaultConfig({
    appName: "TSender",
    // projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    projectId: "5b21cf472fe3dba8ff9cde46aa012ddd",
    chains: [anvil, zksync],
    ssr: true

})



