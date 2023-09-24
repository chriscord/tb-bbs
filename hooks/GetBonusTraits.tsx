import { init, useQuery } from "@airstack/airstack-react";
import { ASApiKey } from "../const/constants";

init(ASApiKey);

function decodeUnicodeEscapes(str: string) {
    return str.replace(/\\u([a-fA-F0-9]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

export const GetBonusTraits = (address: string | undefined) => {
    const queryTraits = `query GetTraits { Wallet( input: {blockchain: polygon, identity: "${address}"}) { tokenBalances { tokenNfts { address tokenId token { name tokenTraits } } } } }`;
    const { data, loading, error } = useQuery(queryTraits);

    if (data) {
        console.log('Data structure:', JSON.stringify(data, null, 2));
    }
    
    if (error) {
        console.error('Query error:', error);
    }
    
    let rank = 1;  // Default rank
    let maxHealthBonus = 0;
    let maxStaminaBonus = 0;
    let attackBonus = 0;
    let defenseBonus = 0;
    let recoveryBonus = 0;
    let moveSpeedBonus = 0;
    let critChanceBonus = 0;
    let critDamageBonus = 0;

    if (data && data.Wallet && data.Wallet.tokenBalances) {
        const parsedTokenBalances = data.Wallet.tokenBalances.map((item: { tokenNfts: { tokenId: string; }; }) => ({
            ...item,
            tokenNfts: {
                ...item.tokenNfts,
                tokenId: parseInt(item.tokenNfts?.tokenId, 10)
            }
        }));

        const sortedTokenBalances = parsedTokenBalances.sort((a: { tokenNfts: { tokenId: number; }; }, b: { tokenNfts: { tokenId: number; }; }) => b.tokenNfts.tokenId - a.tokenNfts.tokenId);
        const highestRankItem = sortedTokenBalances[0];
        rank = highestRankItem.tokenNfts.tokenId + 2;

        const traits = highestRankItem.tokenNfts.token.tokenTraits;
        maxHealthBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.MaxHealth)[0]));
        maxStaminaBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.MaxStamina)[0]));
        attackBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.Attack)[0]));
        defenseBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.Defense)[0]));
        recoveryBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.Recovery)[0]));
        moveSpeedBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.MoveSpeed)[0]));
        critChanceBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.CritChance)[0]));
        critDamageBonus = parseFloat(decodeUnicodeEscapes(Object.keys(traits.CritDamage)[0]));
    }
    console.log('rank', rank);
    console.log('maxHealthBonus', maxHealthBonus);
    console.log('maxStaminaBonus', maxStaminaBonus);
    console.log('attackBonus', attackBonus);
    console.log('defenseBonus', defenseBonus);

    return {
        rank,
        maxHealthBonus,
        maxStaminaBonus,
        attackBonus,
        defenseBonus,
        recoveryBonus,
        moveSpeedBonus,
        critChanceBonus,
        critDamageBonus,
        loading,
        error
    };
};
