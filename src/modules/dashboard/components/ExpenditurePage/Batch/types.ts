import { AnyToken } from '~data/index';

export interface Batch {
  dataCSVUploader?: {
    parsedData: BatchDataItem[];
    file?: File;
    uploaded?: boolean;
  }[];
  data?: ValidatedBatchDataItem[];
  recipients?: number;
  value?: Array<
    | {
        value?: number;
        token?: AnyToken;
      }
    | undefined
  >;
}

export interface BatchDataItem {
  recipient?: string;
  token?: string;
  amount?: string;
}

export interface ValidatedBatchDataItem extends Omit<BatchDataItem, 'token'> {
  error?: boolean;
  token?: AnyToken;
  id: string;
}
