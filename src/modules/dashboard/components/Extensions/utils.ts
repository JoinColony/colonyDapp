import * as yup from 'yup';

import { ExtensionInitParams } from '~data/staticData/extensionData';
import { ActionTypes } from '~redux/actionTypes';

export const createExtensionInitValidation = (
  initializationParams: ExtensionInitParams[],
) => {
  if (!initializationParams) {
    return null;
  }
  const validationObject = initializationParams.reduce((validation, param) => {
    // eslint-disable-next-line no-param-reassign
    validation[param.paramName] = param.validation;
    return validation;
  }, {});
  return yup.object().shape(validationObject);
};

export const createExtensionDefaultValues = (
  initializationParams: ExtensionInitParams[],
) => {
  if (!initializationParams) {
    return null;
  }
  return initializationParams.reduce((defaultValues, param) => {
    // eslint-disable-next-line no-param-reassign
    defaultValues[param.paramName] = param.defaultValue;
    return defaultValues;
  }, {});
};

export const getButtonAction = (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
  const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;
  return ActionTypes[`EXTENSION_ENABLE${actionEnd}`];
};
