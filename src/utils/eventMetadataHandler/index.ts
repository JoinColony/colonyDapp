import {
  AnnotationMetadata,
  ColonyMetadata,
  DomainMetadata,
  MiscMetadata,
  Metadata,
  MetadataType,
} from './types';
import { log } from '~utils/debug';

const METADATA_VERSION = 2;

/*
 * Internal
 */
// String from IPFS to Metadata Object
const parseEventMetadata = (res: string): Metadata | undefined => {
  try {
    const { version, name, data } = JSON.parse(res);
    // @TODO decide how to handle versions in the future
    if (version !== METADATA_VERSION) {
      log.verbose('Invalid metadata version');
      return undefined;
    }

    switch (name) {
      case MetadataType.Colony:
        return {
          version,
          name,
          data: {
            ...data,
            colonyTokens: data.colonyTokens ? data.colonyTokens : [],
            verifiedAddresses: data.verifiedAddresses
              ? data.verifiedAddresses
              : [],
          },
        };
      case MetadataType.Domain:
        return {
          version,
          name,
          data: {
            ...data,
            domainTokens: data.domainTokens ? data.domainTokens : [],
          },
        };
      case MetadataType.Annotation:
      case MetadataType.Misc:
        return {
          version,
          name,
          data: {
            ...data,
          },
        };
      default:
        log.verbose('Invalid metadata type');
    }
  } catch (e) {
    log.verbose('Invalid metadata: Problem parsing metadata: ', e);
  }
  // @TODO handle invalid metadata - not expecting to get this far
  return undefined;
};

/*
 * Parsing functions:
 * Convert String from IPFS to Metadata Object
 */

// get colony data from ipfs data
export const getColonyMetadataFromResponse = (
  res: string,
): ColonyMetadata | undefined => {
  return parseEventMetadata(res)?.data as ColonyMetadata;
};

// get domain data from ipfs data
export const getDomainMetadataFromResponse = (
  res: string,
): DomainMetadata | undefined => {
  return parseEventMetadata(res)?.data as DomainMetadata;
};

// get annotation message from ipfs data
export const getAnnotationMsgFromResponse = (
  res: string,
): string | undefined => {
  const metadata = parseEventMetadata(res)?.data as AnnotationMetadata;
  return metadata.annotationMsg;
};

/*
 * Stringify functions:
 * Convert Metadata Object to String (to be stored in IPFS)
 */
// get Metadata for Colony type
export const getMetadataStringForColony = (
  metaDataArgs: ColonyMetadata,
): string => {
  const metadata: Metadata = {
    version: METADATA_VERSION,
    name: MetadataType.Colony,
    data: metaDataArgs,
  };
  return JSON.stringify(metadata);
};

// get Metadata for Domain type
export const getMetadataStringForDomain = (
  metaDataArgs: DomainMetadata,
): string => {
  const metadata: Metadata = {
    version: METADATA_VERSION,
    name: MetadataType.Domain,
    data: metaDataArgs,
  };
  return JSON.stringify(metadata);
};

// get Metadata for Annotation type
export const getMetadataStringForAnnotation = (
  metaDataArgs: AnnotationMetadata,
): string => {
  const metadata: Metadata = {
    version: METADATA_VERSION,
    name: MetadataType.Annotation,
    data: metaDataArgs,
  };
  return JSON.stringify(metadata);
};

// get Metadata for Misc type
export const getMetadataStringForMisc = (
  metaDataArgs: MiscMetadata,
): string => {
  const metadata: Metadata = {
    version: METADATA_VERSION,
    name: MetadataType.Misc,
    data: metaDataArgs,
  };
  return JSON.stringify(metadata);
};

export const getMiscContentFor = (
  name: string,
  metaData: MiscMetadata,
): string | undefined => {
  return name === metaData?.name ? metaData.content : undefined;
};

/*
 * Helper functions:
 */
// convenience func to get colonyAvatarImage from IPFS
export const getColonyAvatarImage = (res: string): string | undefined => {
  return getMiscContentFor(
    'colonyAvatarImage',
    parseEventMetadata(res) as MiscMetadata,
  );
};

// convenience func to set colonyAvatarImage to IPFS
export const setColonyAvatarImage = (colonyAvatarImage: string): string => {
  return JSON.stringify(
    getMetadataStringForMisc({
      name: 'colonyAvatarImage',
      content: colonyAvatarImage,
    }),
  );
};

export function getEventMetadataVersion(response: string): number {
  const res = JSON.parse(response);
  console.log(`🚀 ~ METADATA version:`, res?.version);
  return (res?.version as number) || 1;
}
