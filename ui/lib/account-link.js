export default function getAccountLink(address, network, rpcPrefs) {
  if (rpcPrefs && rpcPrefs.blockExplorerUrl) {
    return `${rpcPrefs.blockExplorerUrl.replace(
      /\/+$/u,
      ""
    )}/address/${address}`;
  }

  switch (network) {
    case "mainnet": // main net
      return `https://explorer.tolar.io/?query=${address}&page=1`;
    case "testnet": // morden test net
      return ` https://testnet-explorer.tolar.io/?query=${address}&page=1`;
    default:
      return "";
  }
}
