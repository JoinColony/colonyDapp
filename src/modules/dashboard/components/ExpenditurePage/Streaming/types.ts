export interface FundingSource {
  team: string;
  rate: {
    amount?: number;
    token?: string;
    time?: string;
    limit?: number;
    id: string;
  }[];
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
