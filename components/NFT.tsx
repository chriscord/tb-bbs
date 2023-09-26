import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { GetBonusTraits } from "../hooks/GetBonusTraits";
import { init, useQuery } from "@airstack/airstack-react";
import { NFTDROP_ADDRESS, ASApiKey } from "../const/constants";
import { use } from "react";

type Props = {
    nft: NFT;
};

type Traits = {
    rank: number | null;
    maxHealthBonus: number;
    maxStaminaBonus: number;
    attackBonus: number;
    defenseBonus: number;
    recoveryBonus: number;
    moveSpeedBonus: number;
    critChanceBonus: number;
    critDamageBonus: number;
};

type TraitsResult = {
    RenderedRank: () => JSX.Element;
    traits: Traits;
    loading: boolean;
    error?: Error;
};

const formatRank = (rank: number): string => {
    return `The Barbarians Rank ${rank}`;
};

init(ASApiKey);

const QuerySmartWalletAddress = (nft: NFT) => {
    const query6551 = `query GetSmartWalletAddress { Accounts(input: {filter: {tokenAddress: {_eq: "${NFTDROP_ADDRESS}"}, tokenId: {_eq: "${nft.metadata.id}"}}, blockchain: polygon, limit: 200}) { Account { address { addresses } } } }`;

    const { data, loading, error } = useQuery(query6551);

    // Ensure the necessary data exists before attempting to access it
    const address = data?.Accounts?.Account?.[0]?.address?.addresses?.[0];
    console.log("NFT ADDRESS: ", NFTDROP_ADDRESS)
    console.log("tokenID: ", nft.metadata.id)
    console.log("address:", address)

    const RenderedAddress = () => {
        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error.message}</p>;
        }

        if (!address) {
            return <p>No address found</p>;
        }

        return (
            <div>
                <p>Smart Wallet Address: {address}</p>
            </div>
        );
    };

    return { RenderedAddress, address };
};

export default function NFTComponent({ nft }: Props) {
    // const { RenderedRank, traits, loading, error } = useTraits(nft);
    return (
        <>
            <ThirdwebNftMedia metadata={nft.metadata} />
            <p>Token ID: {nft.metadata.id}</p>
            <p>{nft.metadata.name}</p>
            {/* {traits && <RenderedRank />} */}
        </>
    );
}

