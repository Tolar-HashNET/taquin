import assert from "assert";
import EventEmitter from "events";
import ObservableStore from "obs-store";
import ComposedStore from "obs-store/lib/composed";
import EthQuery from "eth-query";
import JsonRpcEngine from "json-rpc-engine";
import providerFromEngine from "eth-json-rpc-middleware/providerFromEngine";
import log from "loglevel";
import {
  createSwappableProxy,
  createEventEmitterProxy,
} from "swappable-obj-proxy";
import createTaquinMiddleware from "./createTaquinMiddleware";
import createInfuraClient from "./createInfuraClient";
import createTolarClient from "./createInfuraClient";

import createJsonRpcClient from "./createJsonRpcClient";
import createLocalhostClient from "./createLocalhostClient";

// import {
//   RINKEBY,
//   MAINNET,
//   LOCALHOST,
//   INFURA_PROVIDER_TYPES,
// } from './enums'

import {
  MAINNET,
  LOCALHOST,
  TOLAR_PROVIDER_TYPES,
  NETWORK_TYPE_TO_SUBDOMAIN_MAP,
  NETWORK_TYPE_TO_ID_MAP,
} from "./enums";
import TolarBlockTracker from "../../lib/tolar-block-tracker/tolar-block-tracker";

const networks = { networkList: {} };

const env = process.env.TAQUIN_ENV;
const { TAQUIN_DEBUG } = process.env;

let defaultProviderConfigType;
if (process.env.IN_TEST === "true") {
  // defaultProviderConfigType = LOCALHOST
  defaultProviderConfigType = MAINNET;
} else if (TAQUIN_DEBUG || env === "test") {
  // defaultProviderConfigType = RINKEBY
  defaultProviderConfigType = MAINNET;
} else {
  defaultProviderConfigType = MAINNET;
}

const defaultProviderConfig = {
  type: defaultProviderConfigType,
};

const defaultNetworkConfig = {
  // ticker: 'ETH',
  ticker: "TOL",
};

export default class NetworkController extends EventEmitter {
  constructor(opts = {}) {
    super();

    // parse options
    const providerConfig = opts.provider || defaultProviderConfig;
    // create stores
    this.providerStore = new ObservableStore(providerConfig);
    this.networkStore = new ObservableStore("loading");
    this.networkConfig = new ObservableStore(defaultNetworkConfig);
    this.store = new ComposedStore({
      provider: this.providerStore,
      network: this.networkStore,
      settings: this.networkConfig,
    });
    this.on("networkDidChange", this.lookupNetwork);
    // provider and block tracker
    this._provider = null;
    this._blockTracker = null;
    // provider and block tracker proxies - because the network changes
    this._providerProxy = null;
    this._blockTrackerProxy = null;
  }

  initializeProvider(providerParams) {
    this._baseProviderParams = providerParams;
    const { type, rpcTarget, chainId, ticker, nickname } =
      this.providerStore.getState();

    this._configureProvider({ type, rpcTarget, chainId, ticker, nickname });
    this.lookupNetwork();
  }

  // return the proxies so the references will always be good
  getProviderAndBlockTracker() {
    const provider = this._providerProxy;
    const blockTracker = this._blockTrackerProxy;
    return { provider, blockTracker };
  }

  verifyNetwork() {
    // Check network when restoring connectivity:
    if (this.isNetworkLoading()) {
      this.lookupNetwork();
    }
  }

  getNetworkState() {
    return this.networkStore.getState();
  }

  getNetworkConfig() {
    return this.networkConfig.getState();
  }

  setNetworkState(network, type) {
    if (network === "loading") {
      this.networkStore.putState(type);
      return;
    }

    // type must be defined
    if (!type) {
      return;
    }
    this.networkStore.putState(type);
  }

  isNetworkLoading() {
    return this.getNetworkState() === "loading";
  }

  lookupNetwork() {
    // Prevent firing when provider is not defined.
    if (!this._provider) {
      log.warn(
        "NetworkController - lookupNetwork aborted due to missing provider"
      );
      return;
    }
    const { type } = this.providerStore.getState();
    const ethQuery = new EthQuery(this._provider);
    const initialNetwork = this.getNetworkState();
    ethQuery.sendAsync({ method: "net_version" }, (err, network) => {
      const currentNetwork = this.getNetworkState();
      if (initialNetwork === currentNetwork) {
        if (err) {
          this.setNetworkState("loading");
          return;
        }
        log.info(`web3.getNetwork returned ${network}`);

        this.setNetworkState(network, type);
      }
    });
  }

  // setRpcTarget (rpcTarget, chainId, ticker = 'ETH', nickname = '', rpcPrefs) {
  setRpcTarget(rpcTarget, chainId, ticker = "TOL", nickname = "", rpcPrefs) {
    const providerConfig = {
      type: "rpc",
      rpcTarget,
      chainId,
      ticker,
      nickname,
      rpcPrefs,
    };
    this.providerConfig = providerConfig;
  }

  async setProviderType(type, rpcTarget = "", ticker = "TOL", nickname = "") {
    // async setProviderType (type, rpcTarget = '', ticker = 'ETH', nickname = '') {
    assert.notEqual(
      type,
      "rpc",
      `NetworkController - cannot call "setProviderType" with type 'rpc'. use "setRpcTarget"`
    );
    // assert(INFURA_PROVIDER_TYPES.includes(type) || type === LOCALHOST, `NetworkController - Unknown rpc type "${type}"`)
    assert(
      TOLAR_PROVIDER_TYPES.includes(type) || type === LOCALHOST,
      `NetworkController - Unknown rpc type "${type}"`
    );
    const providerConfig = { type, rpcTarget, ticker, nickname };
    this.providerConfig = providerConfig;
  }

  resetConnection() {
    this.providerConfig = this.getProviderConfig();
  }

  set providerConfig(providerConfig) {
    this.providerStore.updateState(providerConfig);
    this._switchNetwork(providerConfig);
  }

  getProviderConfig() {
    return this.providerStore.getState();
  }

  //
  // Private
  //

  _switchNetwork(opts) {
    this.setNetworkState("loading");
    this._configureProvider(opts);
    this.emit("networkDidChange", opts.type);
  }

  _configureProvider(opts) {
    const { type, rpcTarget, chainId, ticker, nickname } = opts;
    // infura type-based endpoints
    // const isInfura = INFURA_PROVIDER_TYPES.includes(type)
    const isTolar = TOLAR_PROVIDER_TYPES.includes(type);

    // if (isInfura) {
    if (isTolar) {
      // this._configureInfuraProvider(opts)
      //TODO changing urls
      const tolarRpc = `https://${NETWORK_TYPE_TO_SUBDOMAIN_MAP[type].subdomain}.tolar.io`;
      this._configureStandardProvider({
        rpcUrl: tolarRpc,
        chainId: type,
        ticker,
        nickname: type,
      });

      // other type-based rpc endpoints
    } else if (type === LOCALHOST) {
      this._configureLocalhostProvider();
      // url-based rpc endpoints
    } else if (type === "rpc") {
      this._configureStandardProvider({
        rpcUrl: rpcTarget,
        chainId,
        ticker,
        nickname,
      });
    } else {
      throw new Error(
        `NetworkController - _configureProvider - unknown type "${type}"`
      );
    }
  }

  // _configureInfuraProvider ({ type }) {
  //   log.info('NetworkController - configureInfuraProvider', type)
  //   const networkClient = createInfuraClient({
  //     network: type,
  //   })
  //   this._setNetworkClient(networkClient)
  //   // setup networkConfig
  //   const settings = {
  //     ticker: 'ETH',
  //   }
  //   this.networkConfig.putState(settings)
  // }

  _configureTolarProvider({ type }) {
    log.info("NetworkController - configureTolarProvider", type);
    const rpcTarget = `${NETWORK_TYPE_TO_SUBDOMAIN_MAP[MAINNET]?.subdomain}.tolar.io`;
    const networkClient = this._configureStandardProvider({
      rpcUrl: rpcTarget,
      chainId,
      ticker,
      nickname,
    });

    this._setNetworkClient(networkClient);
    // setup networkConfig
    const settings = {
      ticker: "TOL", //'ETH',
    };
    this.networkConfig.putState(settings);
  }

  _configureLocalhostProvider() {
    log.info("NetworkController - configureLocalhostProvider");
    const networkClient = createLocalhostClient();
    this._setNetworkClient(networkClient);
  }

  _configureStandardProvider({ rpcUrl, chainId, ticker, nickname }) {
    log.info("NetworkController - configureStandardProvider", rpcUrl);
    const networkClient = createJsonRpcClient({ rpcUrl });
    //networkClient.blockTracker = new TolarBlockTracker({provider:networkClient._provider})
    // hack to add a 'rpc' network with chainId
    networks.networkList.rpc = {
      chainId,
      rpcUrl,
      ticker: ticker || "TOL", //'ETH',
      nickname,
    };
    // setup networkConfig
    let settings = {
      network: chainId,
    };
    settings = Object.assign(settings, networks.networkList.rpc);
    this.networkConfig.putState(settings);
    this._setNetworkClient(networkClient);
  }

  _setNetworkClient({ networkMiddleware, blockTracker }) {
    const taquinMiddleware = createTaquinMiddleware(this._baseProviderParams);
    const engine = new JsonRpcEngine();
    engine.push(taquinMiddleware);
    engine.push(networkMiddleware);
    const provider = providerFromEngine(engine);
    this._setProviderAndBlockTracker({ provider, blockTracker });
  }

  _setProviderAndBlockTracker({ provider, blockTracker }) {
    // update or intialize proxies
    if (this._providerProxy) {
      this._providerProxy.setTarget(provider);
    } else {
      this._providerProxy = createSwappableProxy(provider);
    }
    if (this._blockTrackerProxy) {
      this._blockTrackerProxy.setTarget(blockTracker);
    } else {
      this._blockTrackerProxy = createEventEmitterProxy(blockTracker, {
        eventFilter: "skipInternal",
      });
    }
    // set new provider and blockTracker
    this._provider = provider;
    this._blockTracker = blockTracker;
  }
}
