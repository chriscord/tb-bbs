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
    const queryTraits = `query GetTraits { Wallet( input: {blockchain: polygon, identity: "${address}"}) { tokenBalances { tokenNfts { address tokenId token { name tokenTraits } } } } }`;
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

        if (highestRankItem.tokenNfts?.tokenId != null) {
            rank = highestRankItem.tokenNfts.tokenId + 2;
            const traits = highestRankItem.tokenNfts.token.tokenTraits;
            maxHealthBonus = traits.MaxHealth ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.MaxHealth)[0])) : 0;
            maxStaminaBonus = traits.MaxStamina ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.MaxStamina)[0])) : 0;
            attackBonus = traits.Attack ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.Attack)[0])) : 0;
            defenseBonus = traits.Defense ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.Defense)[0])) : 0;
            recoveryBonus = traits.Recovery ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.Recovery)[0])) : 0;
            moveSpeedBonus = traits.MoveSpeed ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.MoveSpeed)[0])) : 0;
            critChanceBonus = traits.CritChance ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.CritChance)[0])) : 0;
            critDamageBonus = traits.CritDamage ? parseFloat(decodeUnicodeEscapes(Object.keys(traits.CritDamage)[0])) : 0;
        } else {
            rank = 1;
        }
    }

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