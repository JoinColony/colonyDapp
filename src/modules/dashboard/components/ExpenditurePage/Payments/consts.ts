import { nanoid } from 'nanoid';
import { newToken } from '../Recipient/Recipient';

export const newRecipient = {
  id: nanoid(),
  recipient: undefined,
  value: [newToken],
  delay: undefined,
  isExpanded: true,
};
