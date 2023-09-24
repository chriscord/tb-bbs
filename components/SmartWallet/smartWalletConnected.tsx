import React from "react";
import { Signer } from "ethers";
import { ThirdwebNftMedia, ThirdwebSDKProvider, Web3Button, useAddress, useBalance, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { EDITIONDROP_ADDRESS, TOKENDROP_ADDRESS, activeChain, TWClientId } from "../../const/constants";
import styles from "../../styles/Home.module.css";
// import toast from "react-hot-toast";
// import toastStyle from "../../util/toastConfig";

interface ConnectedProps {
    signer: Signer | undefined;
};

// Summary: This component is used to connect the smart wallet to the app.
// ThirdwebSDKProvider is a wrapper component that provides the smart wallet signer and active chain to the Thirdweb SDK.
const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer }) => {
    return (
        <ThirdwebSDKProvider
            signer={signer}
            activeChain={activeChain}
            clientId={TWClientId}
        >
            <GetSmartWalletAddress />
            <br />
            <AddExp />
            <br />
            <ClaimAttributes />
            <br />
        </ThirdwebSDKProvider>
    );
};

const GetSmartWalletAddress = () => {
    const address = useAddress();
    return (
        <div>
            <p>Smart wallet address: {address}</p>
        </div>
    )
}

const AddExp = () => {
    const {
        data: tokenBalance,
        isLoading: tokenBalanceIsLoading,
    } = useBalance(TOKENDROP_ADDRESS);

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
                action={(contract) => contract.erc20.claim(10)}
            >Add EXP</Web3Button>
        </div>
    )
}

const ClaimAttributes = () => {
    const address = useAddress();

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
                action={(contract) => contract.erc1155.claim(0, 1)} // tokenId, amount
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