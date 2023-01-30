import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

export enum Step {
  About = 'about',
  Details = 'details',
  Location = 'location',
  References = 'references',
  Signature = 'signature',
}

export interface StepObject {
  id: Step;
  label?: MessageDescriptor;
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

export interface Signature {
  signature: string;
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
  signature: Partial<Signature>;
}
