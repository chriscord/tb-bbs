import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { GetBonusTraits } from "../hooks/GetBonusTraits";
import { init, useQuery } from "@airstack/airstack-react";
import { ASApiKey } from "../const/constants";

type Props = {
    nft: NFT;
};

init(ASApiKey);

const GetSmartWalletAddress = () => {
    const query6551 = `query GetSmartWalletAddress { Accounts(input: {filter: {tokenAddress: {_eq: "0xBC2FEc45255004da3fFCc0410AE2c7dA8Bb45868"}, tokenId: {_eq: "0"}}, blockchain: polygon, limit: 200}) { Account { address { addresses } } } }`

    const { data, loading, error } = useQuery(query6551);

    // Ensure the necessary data exists before attempting to access it
    const address = data?.Accounts?.Account[0]?.address?.addresses[0];

    const RenderedAddress = () => {
        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error.message}</p>;
        }

        return (
            <div>
                {address ? (
                    <p>Smart Wallet Address: {address}</p>
                ) : (
                    <p>No address found</p>
                )}
            </div>
        );
    };

    return { RenderedAddress, address };
};

export const GetTraits = (address: string) => {

    const { rank, maxHealthBonus, maxStaminaBonus, attackBonus, defenseBonus, recoveryBonus, moveSpeedBonus, critChanceBonus, critDamageBonus, loading, error } = GetBonusTraits(address);

    let formattedHighestRank = 'The Barbarians Rank 1';  // Default formatted rank
    formattedHighestRank = `The Barbarians Rank ${rank}`;

    const RenderedRank = () => {
        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error.message}</p>;
        }

        return (
            <div>
                {formattedHighestRank ? (
                    <p>{formattedHighestRank}</p>
                ) : (
                    <p>The Barbarians Rank 1</p>
                )}
            </div>
        );
    };

    return { RenderedRank, rank, maxHealthBonus, maxStaminaBonus, attackBonus, defenseBonus, recoveryBonus, moveSpeedBonus, critChanceBonus, critDamageBonus };
};


export default function NFTComponent({ nft }: Props) {
    const { RenderedAddress, address } = GetSmartWalletAddress();
    const { RenderedRank, rank } = GetTraits(address);

    return (
        <>
            <ThirdwebNftMedia metadata={nft.metadata} />
            <p>Token ID: {nft.metadata.id}</p>
            <p>{nft.metadata.name}</p>
            <RenderedRank />
        </>
    )
}