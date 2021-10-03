import createAsyncMiddleware from "json-rpc-engine/src/createAsyncMiddleware";
import { formatTxMetaForRpcResult } from "../util";

export function createPendingNonceMiddleware({ getPendingNonce }) {
  return createAsyncMiddleware(async (req, res, next) => {
    const { method, params } = req;

    if (method !== "tol_getNonce") {
      next();
      return;
    }
    const [param, blockRef] = params;
    if (blockRef !== "pending") {
      next();
      return;
    }

    res.result = await getPendingNonce(param);
  });
}

export function createPendingTxMiddleware(args) {
  return createAsyncMiddleware(async (req, res, next) => {
    const { signTolarTransaction } = args;
    const { method, params } = req;
    if (method !== "taq_sendTransaction") {
      next();
      return;
    }
    const [txData] = params;
    const mandatoryFields = [
      "sender_address",
      "receiver_address",
      "amount",
      "gas",
      "gas_price",
      "data",
    ];
    const missingFields = mandatoryFields.reduce((acc, field) => {
      const isFieldIncluded = Object.keys(txData).some(
        (checkField) => field === checkField
      );
      if (!isFieldIncluded) {
        acc.push(field);
      }
      return acc;
    }, []);
    if (missingFields.length) {
      throw new Error(
        `Please include all required fields in your transaction payload. Missing fields: ${missingFields.toString()}`
      );
    }

    req.method = "tol_getNonce";
    await signTolarTransaction(...params);

    res.result = txData;
  });
}
