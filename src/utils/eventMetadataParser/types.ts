import { Color } from '~core/ColorTag';

export enum MetadataType {
  Colony = 'colony',
  Domain = 'domain',
  Annotation = 'annotation',
}

export interface ColonyMetadata {
  colonyDisplayName?: string;
  colonyAvatarHash?: string;
  colonyTokens?: Array<string>;
  verifiedAddresses?: Array<string>;
  isWhitelistActivated?: boolean;
}

export interface DomainMetadata {
  domainName?: string;
  domainColor?: Color;
  domainPurpose?: string;
}

export interface AnnotationMetadata {
  annotationMsg: string;
}

export interface Metadata {
  version: number;
  name: MetadataType;
  data: ColonyMetadata | DomainMetadata | AnnotationMetadata;
}
