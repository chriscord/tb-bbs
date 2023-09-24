import Link from "next/link";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import styles from "../styles/Home.module.css";
import { NFTDROP_ADDRESS } from "../const/constants";
import NFTComponent from "./NFT";

type Props = {
    isLoading: boolean;
    nfts: NFTType[] | undefined;
    emptyText?: string;
};

export default function NFTGrid({ isLoading, nfts, emptyText }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {nfts && nfts.length > 0 ? (
                    nfts.map((nft) => (
                        <Link
                            key={nft.metadata.id}
                            href={`/token/${NFTDROP_ADDRESS}/${nft.metadata.id}`}
                            className={styles.card}
                        >
                            <NFTComponent
                                nft={nft}
                            />
                        </Link>
                    ))
                ) : (
                    <p>{emptyText}</p>
                )}
            </div>
        </div>
    )
}