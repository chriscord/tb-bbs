// Chain from Thirdweb
// import { Mumbai, Chain } from '@thirdweb-dev/chains';
import { Polygon, Chain } from '@thirdweb-dev/chains';
export const activeChain: Chain = Polygon;

// 6551 Addresses
export const FACTORY_ADDRESS = '0x02101dfB77FDE026414827Fdc604ddAF224F0921'; // https://docs.tokenbound.org/contracts/deployments
export const IMPLEMENTATION_ADDRESS = '0xA67a301cdE224C0a7112BB4040991197eeB9452A'; // https://thirdweb.com/dashboard/contracts/deploy MAINNET
// export const IMPLEMENTATION_ADDRESS = '0xFbA67ab1D2257855E75E35B2E605F1cC69D9aE78'; // https://thirdweb.com/dashboard/contracts/deploy TESTNET

// KEYS
export const TWClientId = process.env.NEXT_PUBLIC_TWAPI_CLIENT_ID || ''; 
export const TWSecretKey = process.env.NEXT_PUBLIC_TWAPI_SECRET || '';
export const ASApiKey = process.env.NEXT_PUBLIC_AIRSTACK_KEY || '';
 
// Contract Addresses
export const NFTDROP_ADDRESS = '0xBC2FEc45255004da3fFCc0410AE2c7dA8Bb45868'; // MAINNET
export const EDITIONDROP_ADDRESS = '0x2863086980Aa10e85eB767B49011e15A670D8576'; // MAINNET
export const TOKENDROP_ADDRESS = '0xF446D5459e8d09cD0f202E8229E3e5283d9bD5A5'; // MAINNET

// export const NFTDROP_ADDRESS = '0x0F216A797209Db1adf9A1A7306380d6C0aa3fEBb'; // https://thirdweb.com/dashboard/contracts/deploy TESTNET
// export const EDITIONDROP_ADDRESS = '0xE7257D80E2da74775992e6474b505ca389e93Dcc'; // https://thirdweb.com/dashboard/contracts/deploy TESTNET
// export const TOKENDROP_ADDRESS = '0x8C838a56AABB4F3c1EcC64d961565c2EC79E99c9'; // TESTNET