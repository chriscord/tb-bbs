import { init, useQuery } from "@airstack/airstack-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ASApiKey } from "../const/constants";

init(ASApiKey);

function decodeUnicodeEscapes(str: string) {
    return str.replace(/\\u([a-fA-F0-9]{4})/g, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
    );
}

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
    traits: Traits;
    loading: boolean;
    error?: Error;
};

export const GetBonusTraits = (
    address: string | undefined
): TraitsResult => {
    const queryTraits = `query GetTraits { Wallet( input: {blockchain: polygon, identity: "${address}"}) { tokenBalances { tokenNfts { address tokenId metaData { attributes { trait_type value } } } } } }`;
    const { data, loading, error } = useQuery(queryTraits);

    if (error) {
        console.error("Query error:", error);
        toast.error(`Error: ${error.message}`);
        return {
            traits: {
                rank: 1,
                maxHealthBonus: 0,
                maxStaminaBonus: 0,
                attackBonus: 0,
                defenseBonus: 0,
                recoveryBonus: 0,
                moveSpeedBonus: 0,
                critChanceBonus: 0,
                critDamageBonus: 0,
            },
            loading: false,
            error,
        };
    }

    let rank: number | null = null;
    let maxHealthBonus = 0;
    let maxStaminaBonus = 0;
    let attackBonus = 0;
    let defenseBonus = 0;
    let recoveryBonus = 0;
    let moveSpeedBonus = 0;
    let critChanceBonus = 0;
    let critDamageBonus = 0;

    if (data && data.Wallet && data.Wallet.tokenBalances) {
        const parsedTokenBalances = data.Wallet.tokenBalances
        .filter((item: { tokenNfts: { tokenId: string } }) => item.tokenNfts !== null)
        .map(
            (item: { tokenNfts: { tokenId: string } }) => ({
                ...item,
                tokenNfts: {
                    ...item.tokenNfts,
                    tokenId: item.tokenNfts?.tokenId ? parseInt(item.tokenNfts.tokenId, 10) : null,
                },
            })
        );

        const sortedTokenBalances = parsedTokenBalances.sort(
            (a: { tokenNfts: { tokenId: number } }, b: { tokenNfts: { tokenId: number } }) =>
                b.tokenNfts.tokenId - a.tokenNfts.tokenId
        );
        const highestRankItem = sortedTokenBalances[0];
        console.log("HighestRank: ", highestRankItem.tokenNfts?.tokenId + 2)

        if (highestRankItem.tokenNfts?.tokenId != null) {
            rank = highestRankItem.tokenNfts?.tokenId + 2;
            const traits = highestRankItem.tokenNfts?.metaData.attributes;
            maxHealthBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'MaxHealth')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'MaxHealth')?.value) : 0;
            maxStaminaBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'MaxStamina')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'MaxStamina')?.value) : 0;
            attackBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'Attack')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'Attack')?.value) : 0;
            defenseBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'Defense')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'Defense')?.value) : 0;
            recoveryBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'Recovery')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'Recovery')?.value) : 0;
            moveSpeedBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'MoveSpeed')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'MoveSpeed')?.value) : 0;
            critChanceBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'CritChance')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'CritChance')?.value) : 0;
            critDamageBonus = traits?.find((attr: { trait_type: string; }) => attr.trait_type === 'CritDamage')?.value ? parseFloat(traits.find((attr: { trait_type: string; }) => attr.trait_type === 'CritDamage')?.value) : 0;
        } else {
            rank = 1;
        }
    }

    console.log("[NFT] Rank: ", rank);
    console.log("[NFT] MaxHealth Bonus: ", maxHealthBonus);
    console.log("[NFT] MaxStamina Bonus: ", maxStaminaBonus);
    console.log("[NFT] Attack Bonus: ", attackBonus);
    console.log("[NFT] Defense Bonus: ", defenseBonus);
    console.log("[NFT] Recovery Bonus: ", recoveryBonus);
    console.log("[NFT] MoveSpeed Bonus: ", moveSpeedBonus);
    console.log("[NFT] CritChance Bonus: ", critChanceBonus);
    console.log("[NFT] CritDamage Bonus: ", critDamageBonus);

    return {
        traits: {
            rank,
            maxHealthBonus,
            maxStaminaBonus,
            attackBonus,
            defenseBonus,
            recoveryBonus,
            moveSpeedBonus,
            critChanceBonus,
            critDamageBonus,
        },
        loading,
        error,
    };
};