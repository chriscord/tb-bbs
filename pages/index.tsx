import { ConnectWallet, Web3Button, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { NFTDROP_ADDRESS } from "../const/constants";
import NFTGrid from "../components/NFTGrid";

const Home: NextPage = () => {
  const address = useAddress(); // Thirdweb hook that grab the wallet address of the connected applciation

  const { contract } = useContract(NFTDROP_ADDRESS); // Thirdweb hook that grab the contract instance of the connected application
  const { data, isLoading } = useOwnedNFTs(contract, address); // Check contract NFTs owned by the connected wallet address


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <ConnectWallet />
        {!address ? (
          <p className={styles.description}>Connect your wallet to create character.</p>
        ) : (
          <div>
            <h2>Characters</h2>
            <NFTGrid
              isLoading={isLoading}
              nfts={data}
              emptyText="No characters created yet"
            />
            <Web3Button
              contractAddress={NFTDROP_ADDRESS}
              action={(contract) => contract.erc721.claim(1)}
            >Create Character</Web3Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
