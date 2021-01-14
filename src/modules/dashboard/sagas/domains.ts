import { put, takeEvery } from 'redux-saga/effects';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  EditDomainMutation,
  EditDomainMutationVariables,
  EditDomainDocument,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';

function* domainEdit({
  payload: { colonyAddress, domainName, domainId },
  meta,
}: Action<ActionTypes.DOMAIN_EDIT>) {
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Update the domain's name in the mongo database
     */
    yield apolloClient.mutate<EditDomainMutation, EditDomainMutationVariables>({
      mutation: EditDomainDocument,
      variables: {
        input: {
          colonyAddress,
          ethDomainId: domainId,
          name: domainName,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.DOMAIN_EDIT_SUCCESS,
      meta,
      // For now parentId is just root domain
      payload: {
        colonyAddress,
        domainId,
        domainName,
        parentId: ROOT_DOMAIN_ID,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.DOMAIN_EDIT_ERROR, error, meta);
  }
  return null;
}

export default function* domainSagas() {
  yield takeEvery(ActionTypes.DOMAIN_EDIT, domainEdit);
}
