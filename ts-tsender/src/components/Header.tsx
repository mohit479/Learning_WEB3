'use client' // Ensure this is at the top

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
    const [mounted, setMounted] = useState(false);

    // Only run on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header
            style={{
                width: "100%",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #e5e7eb",
                background: "#fff" // Fixed: was #ffff
            }}
        >
            {/* Left side: Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px", fontWeight: 600 }}>
                    tsender
                </span>
            </div>

            {/* Right side: Github + Connect */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <a
                    href="https://github.com/mohit479/Learning_WEB3/tree/main/ts-tsender"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        textDecoration: "none",
                        color: "inherit", // Added to keep icon/text color consistent
                        fontSize: "14px",
                    }}
                >
                    <FaGithub size={20} />
                    <span>GitHub</span>
                </a>

                {/* Only render the button once the client is mounted */}
                {mounted && <ConnectButton />}
            </div>
        </header>
    );
}