import { GetStaticProps } from "next";
import { useState, useEffect } from "react";
import { Signer } from "ethers";
import { ContractMetadata, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebNftMedia, useAddress, useWallet } from "@thirdweb-dev/react";
import styles from "../../../styles/Home.module.css";
import { NFTDROP_ADDRESS, activeChain, TWSecretKey } from "../../../const/constants";
import newSmartWallet from "../../../components/SmartWallet/SmartWallets";
import SmartWalletConnected from "../../../components/SmartWallet/smartWalletConnected";

type Props = {
    nft: NFT;
    contractMetadata: any;
};

// Summary: This component is used to display the NFT and connect the smart wallet to the app.
export default function Token({ nft }: Props) {
    const [smartWalletAddress, setSmartWalletAddress] = useState<string | undefined>(undefined);
    const [signer, setSigner] = useState<Signer>();
    const address = useAddress(); // Thirdweb hook
    const wallet = useWallet(); // Thirdweb hook

    useEffect(() => {
        console.log("Use Effect started");
        const createSmartWallet = async (nft: NFT) => {
            if (nft && smartWalletAddress == null && address && wallet) {
                const smartWallet = newSmartWallet(nft);
                console.log("personal wallet ", address);
                await smartWallet.connect({
                    personalWallet: wallet,
                });
                setSigner(await smartWallet.getSigner());
                console.log("signer ", signer);
                setSmartWalletAddress(await smartWallet.getAddress());
                console.log("smart wallet address ", await smartWallet.getAddress());
                return smartWallet;
            } else {
                console.log("Smart wallet not created");
            }
        };
        createSmartWallet(nft);
    }, [nft, smartWalletAddress, address, wallet, signer]);

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                {nft && (
                    <div className={styles.column}>
                        <ThirdwebNftMedia metadata={nft.metadata} />
                        <h1>{nft.metadata.name}</h1>
                        <p>Token ID: {nft.metadata.id}</p>
                    </div>
                )}
                <div className={styles.column}>
                    {nft.metadata.attributes && (nft.metadata.attributes as Array<{ trait_type: string, value: string }>).map((attribute, index) => (
                        <p key={index}>{attribute.trait_type}: {attribute.value}</p>
                    ))}
                </div>
            </div>

            {smartWalletAddress ? (
                <SmartWalletConnected
                    signer={signer}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const tokenId = context.params?.tokenId as string;
    const sdk = new ThirdwebSDK(activeChain, { secretKey: TWSecretKey });
    const contract = await sdk.getContract(NFTDROP_ADDRESS);
    const nft = await contract.erc721.get(tokenId);

    let contractMetadata;
    try {
        contractMetadata = await contract.metadata.get();
    } catch (e) { }

    return {
        props: {
            nft,
            contractMetadata: contractMetadata || null,
        },
        revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
    };
};

export const getStaticPaths = async () => {
    const sdk = new ThirdwebSDK(activeChain, { secretKey: TWSecretKey });
    const contract = await sdk.getContract(NFTDROP_ADDRESS);
    const nfts = await contract.erc721.getAll();
    const paths = nfts.map((nft) => {
        return {
            params: {
                contractAddress: NFTDROP_ADDRESS,
                tokenId: nft.metadata.id
            },
        };
    });

    return {
        paths,
        fallback: "blocking", // can also be true or 'blocking'
    }
};