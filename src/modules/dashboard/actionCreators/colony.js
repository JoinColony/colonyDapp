/* @flow */

import { CREATE_TOKEN, CREATE_COLONY } from '../actionTypes';

export const createToken = (
  name: string,
  symbol: string,
  setErrors: () => void,
  setSubmitting: () => void,
  handleTokenCreated: () => void,
) => ({
  type: CREATE_TOKEN,
  payload: { name, symbol },
  setErrors,
  setSubmitting,
  handleTokenCreated,
});

export const createColony = (
  tokenAddress: string,
  setErrors: () => void,
  setSubmitting: () => void,
  handleColonyCreated: () => void,
) => ({
  type: CREATE_COLONY,
  payload: { tokenAddress },
  setErrors,
  setSubmitting,
  handleColonyCreated,
});
