const defaultNetworksData = [
  {
    labelKey: "testnet",
    iconColor: "#42f593",
    providerType: "testnet",
    rpcUrl: "https://jsongw.testnet.tolar.io",
    chainId: '2',
    ticker: "TOL",
    blockExplorerUrl: "https://web-explorer.testnet.tolar.io",
  },
  {
    labelKey: "mainnet",
    iconColor: "#29B6AF",
    providerType: "mainnet",
    rpcUrl: "https://jsongw.mainnet.tolar.io",
    chainId: '1',
    ticker: "TOL",
    blockExplorerUrl: "https://web-explorer.mainnet.tolar.io",
  },
  {
    labelKey: "staging",
    iconColor: "#FF0000",
    providerType: "staging",
    rpcUrl: "https://jsongw.stagenet.tolar.io",
    chainId: '3',
    ticker: "TOL",
    blockExplorerUrl: "https://web-explorer.stagenet.tolar.io",
  },
  {
    labelKey: "localhost",
    iconColor: "white",
    border: "1px solid #6A737D",
    providerType: "localhost",
    rpcUrl: "http://localhost:8545/",
    blockExplorerUrl: "",
  },
];

export { defaultNetworksData };
