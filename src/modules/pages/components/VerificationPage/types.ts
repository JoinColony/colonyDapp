import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

export enum Step {
  About = 'about',
  Details = 'details',
  Location = 'location',
  References = 'references',
}

export interface StepObject {
  id: Step;
  label: MessageDescriptor;
  validationSchema: any;
  component: ReactNode;
}

export interface Details {
  name: string;
  phone: number;
  email: string;
}

export interface Location {
  address: string;
}

export interface References {
  bankingReference: any;
  bankName: string;
}

export interface ValuesType {
  details: Details;
  location: Location;
  references: References;
}

export interface ContextValuesType {
  details: Partial<Details>;
  location: Partial<Location>;
  references: Partial<References>;
}
