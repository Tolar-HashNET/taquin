import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useHistory } from "react-router-dom";
import ListItem from "../../ui/list-item";
import { useTransactionDisplayData } from "../../../hooks/useTransactionDisplayData";
import { useTolarTransactionDisplayData } from "../../../hooks/useTolarTransactionDisplayData";

import Preloader from "../../ui/icon/preloader";
import { useI18nContext } from "../../../hooks/useI18nContext";
import { useCancelTransaction } from "../../../hooks/useCancelTransaction";
import { useRetryTransaction } from "../../../hooks/useRetryTransaction";
// import { Button } from "@material-ui/core";
import Tooltip from "../../ui/tooltip";
import TransactionListItemDetails from "../transaction-list-item-details";
import { CONFIRM_TRANSACTION_ROUTE } from "../../../helpers/constants/routes";
import {
  TRANSACTION_CATEGORY_SIGNATURE_REQUEST,
  UNAPPROVED_STATUS,
  TRANSACTION_CATEGORY_APPROVAL,
  FAILED_STATUS,
  DROPPED_STATUS,
  REJECTED_STATUS,
} from "../../../helpers/constants/transactions";
import { useShouldShowSpeedUp } from "../../../hooks/useShouldShowSpeedUp";
import TransactionStatus from "../transaction-status/transaction-status.component";
import TransactionIcon from "../transaction-icon";
import { useTransactionTimeRemaining } from "../../../hooks/useTransactionTimeRemaining";
import IconWithLabel from "../../ui/icon-with-label";
import Receive from "../../ui/icon/receive-icon.component";
import Send from "../../ui/icon/send-icon.component";
import copyToClipboard from "copy-to-clipboard";
export default function TransactionListItem({
  transactionGroup,
  isEarliestNonce = false,
}) {
  // const t = useI18nContext();
  // const history = useHistory();
  // const { hasCancelled } = transactionGroup;
  // const [showDetails, setShowDetails] = useState(false);
  // const { id, time: submittedTime, gas_price: gasPrice } = transactionGroup;

  const {
    title = "",
    subtitle = "",
    subtitleContainsOrigin = "",
    date = "",
    category = "",
    primaryCurrency = "",
    recipientAddress = "",
    secondaryCurrency = "",
    status = "",
    isPending = "",
    hash,
    url,
  } = useTolarTransactionDisplayData(transactionGroup);

  const { sender_address: senderAddress = "" } = transactionGroup;


  // const timeRemaining = useTransactionTimeRemaining(
  //   isPending,
  //   isEarliestNonce,
  //   submittedTime,
  //   gasPrice
  // );

  // const isSignatureReq = category === TRANSACTION_CATEGORY_SIGNATURE_REQUEST;
  // const isApproval = category === TRANSACTION_CATEGORY_APPROVAL;
  // const isUnapproved = status === UNAPPROVED_STATUS;
  const className = classnames("transaction-list-item", {
    "transaction-list-item--unconfirmed":
      isPending ||
      [FAILED_STATUS, DROPPED_STATUS, REJECTED_STATUS].includes(status),
  });

  {/* Details are removed in version before this and they are not in use */}
  // const toggleShowDetails = useCallback(() => {
  //   setShowDetails((prev) => !prev);
  // }, [isUnapproved, history, id]);

  return (
    <>
      <article className="transaction">
        <header className="transaction__header">
          <p className="t t--dimmed">{date}</p>
          {
            category === "sent-tx" ? (
              <span className="transaction__header__type transaction__header__type--otcoming">
                Outgoing
              </span>
            ) : (
              <span className="transaction__header__type transaction__header__type--incoming">
                Incoming
              </span>
            )
          }
        </header>
        
        <section className="transaction__content">
          <div className="transaction__content__address s--right-tiny">
            <a
              className="t t--action s--bottom-small t--elipsis"
              href={url}
              target="_blank"
              rel="noreferrer noopener"
            >
              {hash}
            </a>
            <p className="t t--elipsis">{ category === "sent-tx" ? 
                  (
                    <><span className="t--dimmed s--right-tiny">To:</span> {recipientAddress}</>
                  ) :
                  (
                    <><span className="t--dimmed s--right-tiny">From:</span>{senderAddress}</>
                  )
                }
            </p>
          </div>
          <div className="transaction__content__price">
            <p className="t t--large">{primaryCurrency}</p>
            <p className="t t--medium">{secondaryCurrency}</p>
          </div>
        </section>
      </article>
      {/* <ListItem
        className={className}
        title={title}
        titleIcon={
          category === "sent-tx" ? (
            <Send size={24} color={"red"} />
          ) : (
            <Receive size={24} color={"green"} />
          )
        }
        subtitle={
          <>
            <h2>
              <a
                href={url}
                className="tolar_link"
                target="_blank"
                rel="noreferrer noopener"
              >
                {hash}
              </a>
            </h2>

            <h2>{otherAddressDisplayData}</h2>

            <h3>{date}</h3>
          </>
        }
        rightContent={
          <>
            <h2 className="transaction-list-item__primary-currency">
              {primaryCurrency}
            </h2>
            <h3 className="transaction-list-item__secondary-currency">
              {secondaryCurrency}
            </h3>
          </>
        }
      >
        <div className="transaction-list-item__pending-actions"></div>
      </ListItem> */}
      {/* Details are removed in version before this and they are not in use */}

      {/* {showDetails && (
        <TransactionListItemDetails
          title={title}
          onClose={toggleShowDetails}
          transactionGroup={transactionGroup}
        />
      )} */}
    </>
  );
}

TransactionListItem.propTypes = {
  transactionGroup: PropTypes.object.isRequired,
  isEarliestNonce: PropTypes.bool,
};
