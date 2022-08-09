import { extensions } from '@colony/colony-js';
import extensionData from '~data/staticData/extensionData';

// get all extensions that are allowed to be installed
export const allAllowedExtensions = extensions.filter(
  (extensionId) => extensionData[extensionId],
);
