import * as yup from 'yup';
import { defineMessages } from 'react-intl';

import { MetadataType } from './types';

const MSG = defineMessages({
  requiredField: {
    id: `utils.eventMetadata.requiredField`,
    defaultMessage: `This field is required.`,
  },
});

const miscMetadataSchema = yup.object({
  name: yup.string().required(() => MSG.requiredField),
  content: yup.string().required(() => MSG.requiredField),
});

const colonyMetadataSchema = yup.object({
  colonyName: yup.string(),
  colonyDisplayName: yup.string(),
  colonyAvatarHash: yup.string(),
  colonyTokens: yup.lazy((val) =>
    Array.isArray(val) ? yup.array().of(yup.string()) : yup.string(),
  ),
  verifiedAddresses: yup.lazy((val) =>
    Array.isArray(val) ? yup.array().of(yup.string()) : yup.string(),
  ),
  isWhitelistActivated: yup.boolean(),
});

const domainMetadataSchema = yup.object({
  domainName: yup.string(),
  domainColor: yup.number(),
  domainPurpose: yup.string(),
});

const annotationMetadataSchema = yup.object({
  annotationMsg: yup.string().required(() => MSG.requiredField),
});

export const metadataSchema = yup
  .object()
  .shape({
    version: yup.number().required(() => MSG.requiredField),
    name: yup
      .mixed<MetadataType>()
      .oneOf(Object.values(MetadataType))
      .required(),
    data: yup
      .object()
      .when('name', {
        is: MetadataType.Colony,
        then: colonyMetadataSchema
          .noUnknown(true)
          .required(() => MSG.requiredField),
      })
      .when('name', {
        is: MetadataType.Domain,
        then: domainMetadataSchema
          .noUnknown(true)
          .required(() => MSG.requiredField),
      })
      .when('name', {
        is: MetadataType.Annotation,
        then: annotationMetadataSchema
          .noUnknown(true)
          .required(() => MSG.requiredField),
      })
      .when('name', {
        is: MetadataType.Misc,
        then: miscMetadataSchema
          .noUnknown(true)
          .required(() => MSG.requiredField),
      })
      .required(() => MSG.requiredField),
  })
  .noUnknown(true);
