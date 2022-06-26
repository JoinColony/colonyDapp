export enum MetadataType {
  Colony = 'colony',
  Domain = 'domain',
  Annotation = 'annotation',
  Misc = 'misc',
}

export interface MiscMetadata {
  // @TODO - This is not metadata, but check if this should be included somewhere
  // this was created to handle colonyAvatarImage
  name?: string;
  content?: string;
}

export interface ColonyMetadata {
  colonyName?: string; // @TODO - check this should be included in the metadata
  colonyDisplayName?: string;
  colonyAvatarHash?: string | null;
  colonyTokens?: Array<string>;
  verifiedAddresses?: Array<string>;
  isWhitelistActivated?: boolean;
}

export interface DomainMetadata {
  domainName?: string;
  domainColor?: number; // @TODO - check a number [1-16] or string
  domainPurpose?: string;
}

export interface AnnotationMetadata {
  annotationMsg: string;
}

export interface Metadata {
  version: number;
  name: MetadataType;
  data: ColonyMetadata | DomainMetadata | AnnotationMetadata | MiscMetadata;
}

export function metadataTypetoEnum(type: string): MetadataType {
  switch (type) {
    case 'colony':
      return MetadataType.Colony;
    case 'domain':
      return MetadataType.Domain;
    case 'annotation':
      return MetadataType.Annotation;
    case 'misc':
      return MetadataType.Misc;
    default:
      throw new Error('Invalid metadata type');
  }
}
