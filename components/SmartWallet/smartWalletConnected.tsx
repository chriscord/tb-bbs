import React, { useState } from "react";
import { Signer } from "ethers";
import { ThirdwebNftMedia, ThirdwebSDKProvider, Web3Button, useAddress, useBalance, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { EDITIONDROP_ADDRESS, TOKENDROP_ADDRESS, activeChain, TWClientId } from "../../const/constants";
import { GetBonusTraits } from "../../hooks/GetBonusTraits";
import styles from "../../styles/Home.module.css";

interface ConnectedProps {
    signer: Signer | undefined;
    smartWalletAddress?: string;
};

// Summary: This component is used to connect the smart wallet to the app.
// ThirdwebSDKProvider is a wrapper component that provides the smart wallet signer and active chain to the Thirdweb SDK.
const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer, smartWalletAddress }) => {
    return (
        <ThirdwebSDKProvider
            signer={signer}
            activeChain={activeChain}
            clientId={TWClientId}
        >
            <div>
                <p>Smart wallet address: {smartWalletAddress}</p>
            </div>
            <br />
            <AddExp />
            <br />
            <ClaimAttributes />
            <br />
        </ThirdwebSDKProvider>
    );
};

const AddExp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const {
        data: tokenBalance,
        isLoading: tokenBalanceIsLoading,
    } = useBalance(TOKENDROP_ADDRESS);

    const handleClick = async () => {
        setIsLoading(true);
        setIsDisabled(true);

        // Perform some async operation here
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsLoading(false);
        setIsDisabled(false);
    };

    return (
        <div className={styles.container}>
            <h3>Add EXP:</h3>
            {tokenBalanceIsLoading ? (
                <p>Loading...</p>
            ) : (
                <p>Token Balance: {tokenBalance?.displayValue}</p>
            )}
            <Web3Button
                contractAddress={TOKENDROP_ADDRESS}
                action={(contract) => {
                    contract.erc20.claim(1000);
                    handleClick()
                }}
                isDisabled={isLoading || isDisabled}
            >Add EXP</Web3Button>
        </div>
    )
}

const ClaimAttributes = () => {
    const address = useAddress();
    console.log("address:", address);
    const traitBonuses = GetBonusTraits(address);

    const { contract } = useContract(EDITIONDROP_ADDRESS);
    const {
        data: ownedNFTs,
        isLoading: ownedNFTsIsLoading,
    } = useOwnedNFTs(contract, address);
    
    return (
        <div className={styles.container}>
            <h3>Get Attributes:</h3>
            <Web3Button
                contractAddress={EDITIONDROP_ADDRESS}
                action={(contract) => {
                    const rank = traitBonuses?.traits?.rank;
                    if (rank === null) {
                        alert("Unexpected error.");
                    } else if (rank >= 1 && rank < 10) {
                        contract.erc1155.claim(rank - 1, 1);
                    } else if (rank === 10) {
                        alert("Character has reached max level.");
                    }
                }}
            >Level Up Chracter</Web3Button>
            {ownedNFTsIsLoading ? (
                <p>Loading...</p>
            ) : (
                <div className={styles.grid}>
                   {ownedNFTs && ownedNFTs.length > 0 ? (
                        ownedNFTs.map((nft) => (
                            <div key={nft.metadata.id}>
                                <ThirdwebNftMedia metadata={nft.metadata} />
                                <p>{nft.metadata.name}</p>                                
                                <p>Quantity: {nft.quantityOwned}</p>
                                {nft.metadata.attributes && (nft.metadata.attributes as Array<{ trait_type: string, value: string }>).map((attribute, index) => (
                                    <p key={index}>{attribute.trait_type}: {attribute.value}</p>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No NFTs owned</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default SmartWalletConnected;