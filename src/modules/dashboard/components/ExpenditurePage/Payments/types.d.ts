export interface Recipient {
  id: string;
  user?: any;
  value?: {
    value: string;
    token: any;
  };
  delay?: {
    value: string;
    time: string;
  };
  isExpanded: boolean;
}
