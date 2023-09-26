import { GetStaticProps } from "next";
import { useState, useEffect } from "react";
import { Signer } from "ethers";
import { ContractMetadata, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebNftMedia, useAddress, useWallet } from "@thirdweb-dev/react";
import styles from "../../../styles/Home.module.css";
import { NFTDROP_ADDRESS, activeChain, TWSecretKey } from "../../../const/constants";
import { GetBonusTraits } from "../../../hooks/GetBonusTraits";
import newSmartWallet from "../../../components/SmartWallet/SmartWallets";
import SmartWalletConnected from "../../../components/SmartWallet/smartWalletConnected";

type Props = {
    nft: NFT;
    contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
    const [smartWalletAddress, setSmartWalletAddress] = useState<string | undefined>(undefined);
    const [signer, setSigner] = useState<Signer>();
    const address = useAddress(); // Thirdweb hook; Get users' wallet address
    const wallet = useWallet(); // Thirdweb hook
  
    useEffect(() => {
      const createSmartWallet = async (nft: NFT) => {
        if (nft && smartWalletAddress == null && address && wallet) {
          const smartWallet = newSmartWallet(nft);
          await smartWallet.connect({ personalWallet: wallet });
          setSigner(await smartWallet.getSigner());
        //   const address = await smartWallet.getAddress();
          setSmartWalletAddress(await smartWallet.getAddress());
          console.log(smartWalletAddress);
          return smartWallet;
        }
        else {
            console.log("Wallet not created.")
        }
      };
  
      createSmartWallet(nft);
    }, [nft, smartWalletAddress, wallet, address, signer]);  
    console.log("smartWalletAddress: ", smartWalletAddress);
    const traitBonuses = GetBonusTraits(smartWalletAddress) || {};
    
    console.log("[Page] Health Bonus: ", traitBonuses.traits.maxHealthBonus);
    console.log("[Page] Stamina Bonus: ", traitBonuses.traits.maxStaminaBonus);
    console.log("[Page] Attack Bonus: ", traitBonuses.traits.attackBonus);
    console.log("[Page] Defense Bonus: ", traitBonuses.traits.defenseBonus);
    console.log("[Page] Recovery Bonus: ", traitBonuses.traits.recoveryBonus);
    console.log("[Page] MoveSpeed Bonus: ", traitBonuses.traits.moveSpeedBonus);
    console.log("[Page] CritChance Bonus: ", traitBonuses.traits.critChanceBonus);
    console.log("[Page] CritDamage Bonus: ", traitBonuses.traits.critDamageBonus);
    
    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                {nft && (
                    <div className={styles.column}>
                        <ThirdwebNftMedia metadata={nft.metadata} />
                        <h1>{nft.metadata.name}</h1>
                        <p>Token ID: {nft.metadata.id}</p>
                        <p>Rank: {traitBonuses.traits.rank}</p>
                    </div>
                )}
                <div className={styles.column}>
                    {nft.metadata.attributes && (nft.metadata.attributes as Array<{ trait_type: string, value: string }>).map((attribute, index) => (
                        <p key={index}>{attribute.trait_type}: {attribute.value}</p>
                    ))}
                </div>
                <div className={styles.column}>
                    <p>+{((traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.maxHealthBonus ?? 0)).toFixed(2)}% MaxHealth Bonus</p>
                    <p>+{((traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.maxStaminaBonus ?? 0)).toFixed(2)}% MaxStamina Bonus</p>
                    <p>+{(traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.attackBonus ?? 0)} Attack Bonus</p>
                    <p>+{(traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.defenseBonus ?? 0)} Defense Bonus</p>
                    <p>+{((traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.recoveryBonus ?? 0)).toFixed(2)} Recovery Bonus</p>
                    <p>+{((traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.moveSpeedBonus ?? 0)).toFixed(2)} MoveSpeed Bonus</p>
                    <p>+{((traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.critChanceBonus ?? 0)).toFixed(2)}% CritChance Bonus</p>
                    <p>+{((traitBonuses.traits.rank ?? 0) * (traitBonuses.traits.critDamageBonus ?? 0)).toFixed(2)}% CritDamage Bonus</p>
                </div>
            </div>

            {smartWalletAddress ? (
                <SmartWalletConnected
                    signer={signer}
                    smartWalletAddress={smartWalletAddress}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
  }

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