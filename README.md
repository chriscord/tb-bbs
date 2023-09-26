## Project Description
# Overview
CharStat6551 leverages EIP-6551 to forge a structured game character with flexible and upgradable stats, embodied within an ERC-721 token. The unique 6551 smart wallet tied to each NFT character can hold diverse token assets like ERC-20, ERC-721, or ERC-1155, unlocking boundless creativity for its utilization as a game inventory, achievement record archive, and more.

# Benefits
CharStat6551 offers palpable advantages to game developers. Handling game stats for characters and items is a daunting aspect of game development.

Maintaining a Single Source of Truth: Game character stats like HP, movement speed, and strengths are effortlessly referenced, alleviating a common developer headache. Data Storage: Progress data is seamlessly saved, enabling players to pick up where they left off—a normally challenging task simplified. Data Security: Preventing hacks is paramount. CharStat6551, anchored on the blockchain, secures game stats data, negating concerns over cloud storage choice and thwarting data manipulation by players. This innovation beckons traditional game developers towards crypto, fostering enjoyable game creation. The transparency blockchain offers also enriches the gaming experience, allowing visibility into character or item distributions and ownerships.

# How it Works
Every NFT character, an ERC-721, comes with base stats metadata. EIP-6551 permits the creation of an auxiliary wallet, accessible only when the corresponding character NFT is held. This wallet, serving as a character’s inventory, can transact with a wide variety of tokens akin to EOA wallets. While CharStat6551 currently employs the wallet for power-ups, it holds potential for other applications like item inventory.

Characters amass EXP (ERC-20 tokens) and can level up by expending a specified amount of EXP, as designated by the game developer. The level-up and power-up processes are facilitated by minting an ERC-1155 token with bonus game stat metadata, which is then applied to enhance the character’s base stats—a familiar mechanism in traditional game development.

# Future Plans
Game Engine Integration: Presently, CharStat6551 showcases character leveling up, power-up acquisition, and stat upgrades from power-ups. This standardized data structure is slated for integration into game engines like Unity or Godot Engine via Third-party SDKs from entities like ChainSafe and Thirdweb. Network Expansion: Initially built on Polygon Mainnet, CharStat6551 has eyes set on branching out to other chains. Enhanced Security: By embracing ZK-proof in select use cases, security is bolstered, and central game server dependency is reduced, propelling games closer to a fully decentralized operation. Expandability: The EIP-6551 framework, while adept for game stats, has the extensibility to envision Autonomous World residents, each with a distinct wallet, assets, and traits.

## How it's Made
Utilizing ERC-721, I encapsulated game characters with stats, while experience points were represented through ERC-20, and level-up attributes were embedded in ERC-1155 tokens. The EIP-6551 protocol was employed to create a smart wallet for individual game characters. The retrieval of game stats and level-up attribute bonuses was facilitated through AirStack queries. The design of game stats and upgrade logic was orchestrated with a vision for application across a diverse range of game genres. Lacking a developer background and possessing limited coding skills, I leveraged Thirdweb for the foundational app structure and contract design, which also incorporates WalletConnect in its solution.

