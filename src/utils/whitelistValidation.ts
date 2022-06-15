import * as yup from 'yup';
import { defineMessages } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import { isAddress } from '~utils/web3';

const MSG = defineMessages({
  requiredField: {
    id: `utils.whitelistValidation.requiredField`,
    defaultMessage: `Wallet address is a required field.`,
  },
  uploadError: {
    id: `utils.whitelistValidation.uploadError`,
    defaultMessage: `We do not accept more than 100 addresses at a time, please upload a smaller amount.`,
  },
  badFileError: {
    id: `utils.whitelistValidation.badFileError`,
    defaultMessage: `.csv invalid or incomplete. Please ensure the file contains a single column with one address on each row.`,
  },
  invalidAddressError: {
    id: `utils.whitelistValidation.invalidAddressError`,
    defaultMessage: `It looks like one of your addresses is invalid. Please review our required format & validate that your file matches our requirement. Once fixed, please try again.`,
  },
});

export const validationSchemaInput = yup.object({
  whitelistAddress: yup
    .string()
    .required(() => MSG.requiredField)
    .address(),
});

export const validationSchemaFile = yup.object({
  whitelistCSVUploader: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        parsedData: yup
          .array()
          .of(yup.string())
          .min(1, () => MSG.badFileError)
          .max(1000, () => MSG.uploadError)
          .test(
            'valid-wallet-addresses',
            () => MSG.invalidAddressError,
            (value) =>
              isEmpty(
                value?.filter(
                  (potentialAddress: string) => !isAddress(potentialAddress),
                ),
              ),
          ),
      }),
    ),
});

export const mergeSchemas = (...schemas: yup.ObjectSchema[]) => {
  const [first, ...rest] = schemas;
  const merged = rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    first,
  );
  return merged;
};
