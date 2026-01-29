import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
// import Image from "next/image";

export default function Header() {
    return (
        <header
            style={{
                width: "100%",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #e5e7eb",
                background: "#ffff"
            }}
        >
            {/* Left side: Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* <Image
                    src="/logo.png" // replace with your logo path
                    alt="tsender logo"
                    width={32}
                    height={32}
                /> */}
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
                        fontSize: "14px",
                    }}
                >
                    <FaGithub size={20} />
                    <span>GitHub</span>
                </a>

                <ConnectButton />
            </div>
        </header>
    );
}
