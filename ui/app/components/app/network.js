import PropTypes from "prop-types";
import React, { Component } from "react";
import classnames from "classnames";
import NetworkDropdownIcon from "./dropdowns/components/network-dropdown-icon";

function NetworkIndicator({
  disabled,
  children,
  hoverText,
  onClick,
  providerName,
}) {
  return (
    <div
      className={classnames("network-component pointer", {
        "network-component--disabled": disabled,
        "ethereum-network": providerName === "old-mainnet",
        "kovan-test-network": providerName === "testnet",
      })}
      title={hoverText}
      onClick={(event) => {
        if (!disabled) {
          onClick(event);
        }
      }}
    >
      <div className="network-indicator">
        {children}
        <div className="network-indicator__down-arrow" />
      </div>
    </div>
  );
}

NetworkIndicator.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  hoverText: PropTypes.string,
  onClick: PropTypes.func,
  providerName: PropTypes.string,
};

export default class Network extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    // network: PropTypes.string.isRequired,
    provider: PropTypes.shape({
      type: PropTypes.string,
      nickname: PropTypes.string,
      rpcTarget: PropTypes.string,
    }).isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.context;

    const { disabled, network: networkNumber, onClick, provider } = this.props;

    let providerName, providerNick, providerUrl;
    if (provider) {
      providerName = provider.type;
      providerNick = provider.nickname || "";
      providerUrl = provider.rpcTarget;
    }

    switch (providerName) {
      case "old-mainnet":
        return (
          <NetworkIndicator
            disabled={disabled}
            hoverText={"Legacy Main Net" || t("old-mainnet")}
            onClick={onClick}
            providerName={providerName}
          >
            <NetworkDropdownIcon
              backgroundColor="#038789"
              nonSelectBackgroundColor="#15afb2"
              loading={networkNumber === "loading"}
            />
            <div className="network-name">{"Legacy Main Net"}</div>
          </NetworkIndicator>
        );

      case "old-testnet":
        return (
          <NetworkIndicator
            disabled={disabled}
            hoverText={"Legacy Test Net" || t("old-testnet")}
            onClick={onClick}
            providerName={providerName}
          >
            <NetworkDropdownIcon
              backgroundColor="#690496"
              nonSelectBackgroundColor="#b039f3"
              loading={networkNumber === "loading"}
            />
            <div className="network-name">{"Legacy Test Net" || t("old-testnet")}</div>
          </NetworkIndicator>
        );

        case "mainnet":
            return (
              <NetworkIndicator
                disabled={disabled}
                hoverText={"Mainnet" || t("mainnet")}
                onClick={onClick}
                providerName={providerName}
              >
                <NetworkDropdownIcon
                  backgroundColor="#79d351"
                  nonSelectBackgroundColor="#ff1100"
                  loading={networkNumber === "loading"}
                />
                <div className="network-name">{"Mainnet" || t("mainnet")}</div>
              </NetworkIndicator>
            );

            case "testnet":
              return (
                <NetworkIndicator
                  disabled={disabled}
                  hoverText={"Testnet" || t("testnet")}
                  onClick={onClick}
                  providerName={providerName}
                >
                  <NetworkDropdownIcon
                    backgroundColor="#42f593"
                    nonSelectBackgroundColor="#ff1100"
                    loading={networkNumber === "loading"}
                  />
                  <div className="network-name">{"Testnet" || t("testnet")}</div>
                </NetworkIndicator>
              );

              case "staging":
                return (
                  <NetworkIndicator
                    disabled={disabled}
                    hoverText={"Staging" || t("staging")}
                    onClick={onClick}
                    providerName={providerName}
                  >
                    <NetworkDropdownIcon
                      backgroundColor="#79d351"
                      nonSelectBackgroundColor="#ff1100"
                      loading={networkNumber === "loading"}
                    />
                    <div className="network-name">{"Staging" || t("staging")}</div>
                  </NetworkIndicator>
                );

      default:
        return (
          <NetworkIndicator
            disabled={disabled}
            hoverText={providerNick || providerName || providerUrl || null}
            onClick={onClick}
            providerName={providerName}
          >
            {networkNumber === "loading" ? (
              <span
                className="pointer network-loading-spinner"
                onClick={(event) => onClick(event)}
              >
                <img
                  title={t("attemptingConnect")}
                  src="images/loading.svg"
                  alt=""
                />
              </span>
            ) : (
              <i
                className="fa fa-question-circle fa-lg"
                style={{ color: "rgb(125, 128, 130)" }}
              />
            )}
            <div className="network-name">
              {providerName === "localhost"
                ? t("localhost")
                : providerNick || t("privateNetwork")}
            </div>
          </NetworkIndicator>
        );
    }
  }
}
