import React, { Component } from "react";
import PropTypes from "prop-types";
import AccountModalContainer from "../account-modal-container";
import getAccountLink from "../../../../../lib/account-link";
import QrView from "../../../ui/qr-code";
import EditableLabel from "../../../ui/editable-label";
import Button from "../../../ui/button";

export default class AccountDetailsModal extends Component {
  static propTypes = {
    selectedIdentity: PropTypes.object,
    network: PropTypes.string,
    showExportPrivateKeyModal: PropTypes.func,
    setAccountLabel: PropTypes.func,
    keyrings: PropTypes.array,
    rpcPrefs: PropTypes.object,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  render() {
    const {
      selectedIdentity,
      network,
      showExportPrivateKeyModal,
      setAccountLabel,
      keyrings,
      rpcPrefs,
    } = this.props;
    const { name, address } = selectedIdentity;

    const keyring = keyrings.find((kr) => {
      return kr.accounts.includes(address);
    });

    let exportPrivateKeyFeatureEnabled = true;
    // This feature is disabled for hardware wallets
    if (keyring && keyring.type.search("Hardware") !== -1) {
      exportPrivateKeyFeatureEnabled = false;
    }

    return (
      <AccountModalContainer className="account-details-modal">
        <EditableLabel
          className="account-details-modal__name"
          defaultValue={name}
          onSubmit={(label) => setAccountLabel(address, label)}
        />

        <QrView
          Qr={{
            data: address,
            network,
          }}
        />

        <div className="account-details-modal__divider" />
        <button
          style={{marginBottom: "16px"}}
          className='tolar-button'
          onClick={() => {
            global.platform.openTab({
              url: getAccountLink(address, network, rpcPrefs),
            });
          }}
        >
          Explorer
        </button>

        {exportPrivateKeyFeatureEnabled ? (
          <button
            className='tolar-button'
            onClick={() => showExportPrivateKeyModal()}
          >
             {this.context.t("exportPrivateKey")}
          </button>
        ) : null}
      </AccountModalContainer>
    );
  }
}
