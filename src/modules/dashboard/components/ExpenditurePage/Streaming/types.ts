import { DatePickerFieldValue } from '~core/Fields/DatePicker/DatePicker';
import { AnyUser } from '~data/index';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

export interface Rate {
  amount?: number;
  token?: string;
  time?: string;
  limit?: number;
  id: string;
}

export interface FundingSource {
  team: string;
  rate: Rate[];
  isExpanded: boolean;
  id: string;
}

export interface Streaming {
  fundingSources: FundingSource[];
  user?: AnyUser;
  startDate: DatePickerFieldValue;
  endDate: Omit<DatePickerFieldValue, 'option'> & {
    option: ExpenditureEndDateTypes;
  };
}

export enum TimePeriod {
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Hour = 'hour',
}
