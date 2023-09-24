import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { SmartWallet, WalletOptions } from "@thirdweb-dev/wallets";
import type { SmartWalletConfig } from "@thirdweb-dev/wallets";
import { FACTORY_ADDRESS, IMPLEMENTATION_ADDRESS, NFTDROP_ADDRESS, activeChain, TWClientId } from "../../const/constants";
import { ethers } from "ethers";
import type { BaseContract } from "ethers";

// Summary: This function creates a new smart wallet for the token
export default function newSmartWallet(token: NFT) {
    // Smart wallet config object
    const config: WalletOptions<SmartWalletConfig> = {
        chain: activeChain,
        factoryAddress: FACTORY_ADDRESS,
        clientId: TWClientId,
        gasless: true, // Enable or disable gasless transactions
        factoryInfo: {
            createAccount: async (
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                const account = factory.prepare("createAccount", [
                    IMPLEMENTATION_ADDRESS,
                    activeChain.chainId,
                    NFTDROP_ADDRESS,
                    token.metadata.id,
                    0,
                    ethers.utils.toUtf8Bytes("")
                ]);
                console.log("here", account);
                return account;
            }, // the factory method to call to create a new account
            getAccountAddress: async (
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                return factory.call("account", [
                    IMPLEMENTATION_ADDRESS,
                    activeChain.chainId,
                    NFTDROP_ADDRESS,
                    token.metadata.id,
                    0
                ]);
            }, // the factory method to call to get the account address
        },
    };
    return new SmartWallet(config);
}

