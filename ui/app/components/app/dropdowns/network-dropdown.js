import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import * as actions from "../../../store/actions";
import { NETWORKS_ROUTE } from "../../../helpers/constants/routes";
import { Dropdown, DropdownMenuItem } from "./components/dropdown";
import NetworkDropdownIcon from "./components/network-dropdown-icon";

// classes from nodes of the toggle element.
const notToggleElementClassnames = [
  "menu-icon",
  "network-name",
  "network-indicator",
  "network-caret",
  "network-component",
];

function mapStateToProps(state) {
  return {
    provider: state.taquin.provider,
    frequentRpcListDetail: state.taquin.frequentRpcListDetail || [],
    networkDropdownOpen: state.appState.networkDropdownOpen,
    network: state.taquin.network,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (target, network, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, network, ticker, nickname));
    },
    delRpcTarget: (target) => {
      dispatch(actions.delRpcTarget(target));
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    setNetworksTabAddMode: (isInAddMode) =>
      dispatch(actions.setNetworksTabAddMode(isInAddMode)),
  };
}

class NetworkDropdown extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    provider: PropTypes.shape({
      nickname: PropTypes.string,
      rpcTarget: PropTypes.string,
      type: PropTypes.string,
      ticker: PropTypes.string,
    }).isRequired,
    setProviderType: PropTypes.func.isRequired,
    network: PropTypes.string.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    hideNetworkDropdown: PropTypes.func.isRequired,
    setNetworksTabAddMode: PropTypes.func.isRequired,
    frequentRpcListDetail: PropTypes.array.isRequired,
    networkDropdownOpen: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    delRpcTarget: PropTypes.func.isRequired,
  };

  handleClick(newProviderType) {
    const {
      provider: { type: providerType },
      setProviderType,
    } = this.props;
    const { metricsEvent } = this.context;

    metricsEvent({
      eventOpts: {
        category: "Navigation",
        action: "Home",
        name: "Switched Networks",
      },
      customVariables: {
        fromNetwork: providerType,
        toNetwork: newProviderType,
      },
    });
    setProviderType(newProviderType);
  }

  renderCustomOption(provider) {
    const { rpcTarget, type, ticker, nickname } = provider;
    const { network } = this.props;

    if (type !== "rpc") {
      return null;
    }

    switch (rpcTarget) {
      case "http://localhost:8545":
        return null;

      default:
        return (
          <DropdownMenuItem
            key={rpcTarget}
            onClick={() =>
              this.props.setRpcTarget(rpcTarget, network, ticker, nickname)
            }
            closeMenu={() => this.props.hideNetworkDropdown()}
            style={{
              fontSize: "16px",
              lineHeight: "20px",
              padding: "12px 0",
            }}
          >
            <i className="fa fa-check" />
            <i className="fa fa-question-circle fa-med menu-icon-circle" />
            <span
              className="network-name-item"
              style={{
                color: "#ffffff",
              }}
            >
              {nickname || rpcTarget}
            </span>
          </DropdownMenuItem>
        );
    }
  }

  renderCommonRpc(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse();

    return reversedRpcListDetail.map((entry) => {
      const rpc = entry.rpcUrl;
      const ticker = entry.ticker || "TOL";
      const nickname = entry.nickname || "";
      const currentRpcTarget =
        provider.type === "rpc" && rpc === provider.rpcTarget;

      if (rpc === "http://localhost:8545" || currentRpcTarget) {
        return null;
      }
      const { chainId } = entry;
      return (
        <DropdownMenuItem
          key={`common${rpc}`}
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() =>
            this.props.setRpcTarget(rpc, chainId, ticker, nickname)
          }
          style={{
            fontSize: "16px",
            lineHeight: "20px",
            padding: "12px 0",
          }}
        >
          {currentRpcTarget ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <i className="fa fa-question-circle fa-med menu-icon-circle" />
          <span
            className="network-name-item"
            style={{
              color: currentRpcTarget ? "#ffffff" : "#9b9b9b",
            }}
          >
            {nickname || rpc}
          </span>
          <i
            className="fa fa-times delete"
            onClick={(e) => {
              e.stopPropagation();
              this.props.delRpcTarget(rpc);
            }}
          />
        </DropdownMenuItem>
      );
    });
  }

  getNetworkName() {
    const { provider } = this.props;
    const providerName = provider.type;

    let name;

    if (providerName === "testnet") {
      name = "Testnet";
    } else if (providerName === "mainnet") {
      name = "Mainnet";
    }else if (providerName === "staging") {
      name = "Staging";
    } else {
      name = provider.nickname || this.context.t("unknownNetwork");
    }

    return name;
  }

  render() {
    const {
      provider: { type: providerType, rpcTarget: activeNetwork },
      setNetworksTabAddMode,
    } = this.props;
    const rpcListDetail = this.props.frequentRpcListDetail;
    const isOpen = this.props.networkDropdownOpen;
    const dropdownMenuItemStyle = {
      fontSize: "16px",
      lineHeight: "20px",
      padding: "12px 0",
    };

    return (
      <Dropdown
        isOpen={isOpen}
        onClickOutside={(event) => {
          const { classList } = event.target;
          const isInClassList = (className) => classList.contains(className);
          const notToggleElementIndex =
            notToggleElementClassnames.findIndex(isInClassList);

          if (notToggleElementIndex === -1) {
            this.props.hideNetworkDropdown();
          }
        }}
        containerClassName="network-droppo"
        zIndex={55}
        style={{
          position: "absolute",
          top: "58px",
          width: "309px",
          zIndex: "55px",
        }}
        innerStyle={{
          padding: "18px 8px",
        }}
      >
        <div className="network-dropdown-header">
          <div className="network-dropdown-title">
            {this.context.t("networks")}
          </div>
          <div className="network-dropdown-divider" />
          <div className="network-dropdown-content">
            {this.context.t("defaultNetwork").replace("Ether", "Tolar")}
          </div>
        </div>


        <DropdownMenuItem
          key="mainnet"
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => this.handleClick("mainnet")}
          style={dropdownMenuItemStyle}
        >
          {providerType === "mainnet" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            backgroundColor="#5d42f5"
            isSelected={providerType === "mainnet"}
          />
          <span
            className="network-name-item"
            style={{
              color: providerType === "mainnet" ? "#ffffff" : "#5d42f5",
            }}
          >
            {"Mainnet"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          key="testnet"
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => this.handleClick("testnet")}
          style={dropdownMenuItemStyle}
        >
          {providerType === "testnet" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            backgroundColor="#42f593"
            isSelected={providerType === "testnet"}
          />
          <span
            className="network-name-item"
            style={{
              color: providerType === "testnet" ? "#ffffff" : "#42f593",
            }}
          >
            {"Testnet"}
          </span>
        </DropdownMenuItem>        

        <DropdownMenuItem
          key="staging"
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => this.handleClick("staging")}
          style={dropdownMenuItemStyle}
        >
          {providerType === "staging" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            backgroundColor="#79d351"
            isSelected={providerType === "staging"}
          />
          <span
            className="network-name-item"
            style={{
              color: providerType === "staging" ? "#ffffff" : "#9b9b9b",
            }}
          >
            {"Staging"}
          </span>
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          key="rinkeby"
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => this.handleClick("rinkeby")}
          style={dropdownMenuItemStyle}
        >
          {providerType === "rinkeby" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            backgroundColor="#f6c343"
            isSelected={providerType === "rinkeby"}
          />
          <span
            className="network-name-item"
            style={{
              color: providerType === "rinkeby" ? "#ffffff" : "#9b9b9b",
            }}
          >
            {this.context.t("rinkeby")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="goerli"
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => this.handleClick("goerli")}
          style={dropdownMenuItemStyle}
        >
          {providerType === "goerli" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            backgroundColor="#3099f2"
            isSelected={providerType === "goerli"}
          />
          <span
            className="network-name-item"
            style={{
              color: providerType === "goerli" ? "#ffffff" : "#9b9b9b",
            }}
          >
            {this.context.t("goerli")}
          </span>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          key="default"
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => this.handleClick("localhost")}
          style={dropdownMenuItemStyle}
        >
          {providerType === "localhost" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            isSelected={providerType === "localhost"}
            innerBorder="1px solid #9b9b9b"
          />
          <span
            className="network-name-item"
            style={{
              color: providerType === "localhost" ? "#ffffff" : "#9b9b9b",
            }}
          >
            {this.context.t("localhost")}
          </span>
        </DropdownMenuItem>
        {this.renderCustomOption(this.props.provider)}
        {this.renderCommonRpc(rpcListDetail, this.props.provider)}
        <DropdownMenuItem
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => {
            setNetworksTabAddMode(true);
            this.props.history.push(NETWORKS_ROUTE);
          }}
          style={dropdownMenuItemStyle}
        >
          {activeNetwork === "custom" ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">???</div>
          )}
          <NetworkDropdownIcon
            isSelected={activeNetwork === "custom"}
            innerBorder="1px solid #9b9b9b"
          />
          <span
            className="network-name-item"
            style={{
              color: activeNetwork === "custom" ? "#ffffff" : "#9b9b9b",
            }}
          >
            {this.context.t("customRPC")}
          </span>
        </DropdownMenuItem>
      </Dropdown>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(NetworkDropdown);
