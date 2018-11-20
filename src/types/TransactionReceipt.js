/* @flow */

import type { ContractResponse } from '@colony/colony-js-client';

type ContractResponseMeta = $PropertyType<ContractResponse<*>, 'meta'>;

export type TransactionReceipt = $PropertyType<ContractResponseMeta, 'receipt'>;
