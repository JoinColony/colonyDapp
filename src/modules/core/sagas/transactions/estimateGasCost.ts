import { call, put } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';
import { ClientType, ContractClient } from '@colony/colony-js';
import { Contract } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';

import { ActionTypes, Action } from '~redux/index';
import { selectAsJS } from '~utils/saga/effects';
import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionRecordProps } from '~immutable/index';
import { ExtendedReduxContext } from '~types/index';

import { oneTransaction } from '../../selectors';
import {
  transactionUpdateGas,
  transactionEstimateError,
  transactionSend,
} from '../../actionCreators';
import { getGasPrices } from '../utils';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
// Plus 10%
const SAFE_GAS_LIMIT_MULTIPLIER = bigNumberify(10);

export default function* estimateGasCost({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_ESTIMATE_GAS>) {
  try {
    // Get the given transaction
    const {
      context,
      methodName,
      identifier,
      params,
      gasLimit,
      options,
    }: TransactionRecordProps = yield selectAsJS(oneTransaction, id);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    let contextClient: ContractClient;
    if (context === ClientType.TokenClient) {
      contextClient = yield colonyManager.getTokenClient(identifier as string);
    } else if (
      context === ((ExtendedReduxContext.WrappedToken as unknown) as ClientType)
    ) {
      // @ts-ignore
      const wrappedTokenAbi = abis.WrappedToken.default.abi;
      contextClient = new Contract(
        identifier || '',
        wrappedTokenAbi,
        colonyManager.signer,
      );
    } else if (
      context ===
      ((ExtendedReduxContext.VestingSimple as unknown) as ClientType)
    ) {
      // @ts-ignore
      const vestingSimpleAbi = abis.vestingSimple.default.abi;
      contextClient = new Contract(
        identifier || '',
        vestingSimpleAbi,
        colonyManager.signer,
      );
    } else {
      contextClient = yield colonyManager.getClient(context, identifier);
    }

    if (!contextClient) {
      throw new Error('Context client failed to instantiate');
    }

    // Estimate the gas limit with the method.
    const estimatedGas = yield contextClient.estimate[methodName](
      ...params,
      options,
    );

    const suggestedGasLimit = estimatedGas
      .div(SAFE_GAS_LIMIT_MULTIPLIER)
      .add(estimatedGas);

    const { network, suggested } = yield call(getGasPrices);

    const gasPrice = suggested || network;

    yield put(
      transactionUpdateGas(id, {
        /*
         * @NOTE Prevent a race condition if we're also manually estimating gas
         *
         * In some cases we might want to manually estimate gas (see: finalize motion).
         * In cases like those we fire the TRANSACTION_ESTIMATE_GAS action twice in quick
         * succession which leads to a race condition (basically which ever finishes
         * last will get set)
         *
         * This prevents that by making sure that we preserve any gas limit values that
         * are already set on the transaction (the ones that were set manually) and
         * if not, only then set the suggested value
         */
        gasLimit: gasLimit || suggestedGasLimit.toString(),
        gasPrice,
      }),
    );

    yield put(transactionSend(id));
  } catch (error) {
    console.error(error);
    return yield put(transactionEstimateError(id, error));
  }
  return null;
}
