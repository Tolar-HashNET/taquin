import { connect } from "react-redux";
import { compose } from "redux";
import withModalProps from "../../../../helpers/higher-order-components/with-modal-props";
import { removeAccount } from "../../../../store/actions";
import ConfirmRemoveAccount from "./confirm-remove-account.component";

const mapStateToProps = (state) => {
  return {
    network: state.taquin.network,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeAccount: (address) => dispatch(removeAccount(address)),
  };
};

export default compose(
  withModalProps,
  connect(mapStateToProps, mapDispatchToProps)
)(ConfirmRemoveAccount);
