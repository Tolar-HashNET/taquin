// export const ROPSTEN = 'ropsten'
// export const RINKEBY = 'rinkeby'
// export const KOVAN = 'kovan'
// export const MAINNET = 'mainnet'
// export const GOERLI = 'goerli'
export const MAINNET = "mainnet";
export const TESTNET = "testnet";
export const STAGING = "staging";
export const LOCALHOST = "localhost";

// export const MAINNET_NETWORK_ID = '1'
// export const ROPSTEN_NETWORK_ID = '3'
// export const RINKEBY_NETWORK_ID = '4'
// export const GOERLI_NETWORK_ID = '5'
// export const KOVAN_NETWORK_ID = '42'
export const MAINNET_NETWORK_ID = "1";
export const TESTNET_NETWORK_ID = "2";
export const STAGING_NETWORK_ID = "3";

export const MAINNET_SUBDOMAIN = "jsongw.mainnet";
export const TESTNET_SUBDOMAIN = "jsongw.testnet";
export const STAGING_SUBDOMAIN = "jsongw.stagenet";

// export const MAINNET_CHAIN_ID = '0x1'
// export const ROPSTEN_CHAIN_ID = '0x3'
// export const RINKEBY_CHAIN_ID = '0x4'
// export const GOERLI_CHAIN_ID = '0x5'
// export const KOVAN_CHAIN_ID = '0x2a'

// export const ROPSTEN_DISPLAY_NAME = 'Ropsten'
// export const RINKEBY_DISPLAY_NAME = 'Rinkeby'
// export const KOVAN_DISPLAY_NAME = 'Kovan'
// export const MAINNET_DISPLAY_NAME = 'Main Ethereum Network'
// export const GOERLI_DISPLAY_NAME = 'Goerli'

export const MAINNET_DISPLAY_NAME = "Main Tolar Network";
export const TESTNET_DISPLAY_NAME = "Test Tolar Network";
export const STAGING_DISPLAY_NAME = "Staging Tolar Network";

export const TOLAR_PROVIDER_TYPES = [MAINNET, TESTNET, STAGING];

// export const INFURA_PROVIDER_TYPES = [
//   ROPSTEN,
//   RINKEBY,
//   KOVAN,
//   MAINNET,
//   GOERLI,
// ]

// export const NETWORK_TYPE_TO_ID_MAP = {
//   [ROPSTEN]: { networkId: ROPSTEN_NETWORK_ID, chainId: ROPSTEN_CHAIN_ID },
//   [RINKEBY]: { networkId: RINKEBY_NETWORK_ID, chainId: RINKEBY_CHAIN_ID },
//   [KOVAN]: { networkId: KOVAN_NETWORK_ID, chainId: KOVAN_CHAIN_ID },
//   [GOERLI]: { networkId: GOERLI_NETWORK_ID, chainId: GOERLI_CHAIN_ID },
//   [MAINNET]: { networkId: MAINNET_NETWORK_ID, chainId: MAINNET_CHAIN_ID },
// }

export const NETWORK_TYPE_TO_ID_MAP = {
  [MAINNET]: { networkId: MAINNET_NETWORK_ID },
  [TESTNET]: { networkId: TESTNET_NETWORK_ID },
  [STAGING]: { networkId: STAGING_NETWORK_ID },
};

export const NETWORK_TYPE_TO_SUBDOMAIN_MAP = {
  [TESTNET]: { subdomain: TESTNET_SUBDOMAIN },
  [MAINNET]: { subdomain: MAINNET_SUBDOMAIN },
  [STAGING]: { subdomain: STAGING_SUBDOMAIN },
};

// export const NETWORK_TO_NAME_MAP = {
//   [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
//   [RINKEBY]: RINKEBY_DISPLAY_NAME,
//   [KOVAN]: KOVAN_DISPLAY_NAME,
//   [MAINNET]: MAINNET_DISPLAY_NAME,
//   [GOERLI]: GOERLI_DISPLAY_NAME,

//   [ROPSTEN_NETWORK_ID]: ROPSTEN_DISPLAY_NAME,
//   [RINKEBY_NETWORK_ID]: RINKEBY_DISPLAY_NAME,
//   [KOVAN_NETWORK_ID]: KOVAN_DISPLAY_NAME,
//   [GOERLI_NETWORK_ID]: GOERLI_DISPLAY_NAME,
//   [MAINNET_NETWORK_ID]: MAINNET_DISPLAY_NAME,

//   [ROPSTEN_CHAIN_ID]: ROPSTEN_DISPLAY_NAME,
//   [RINKEBY_CHAIN_ID]: RINKEBY_DISPLAY_NAME,
//   [KOVAN_CHAIN_ID]: KOVAN_DISPLAY_NAME,
//   [GOERLI_CHAIN_ID]: GOERLI_DISPLAY_NAME,
//   [MAINNET_CHAIN_ID]: MAINNET_DISPLAY_NAME,
// }

export const NETWORK_TO_NAME_MAP = {
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [TESTNET]: TESTNET_DISPLAY_NAME,
  [STAGING]: STAGING_DISPLAY_NAME,
};
