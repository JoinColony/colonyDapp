/* @flow */

import * as yup from 'yup';

export const CreateDomainCreatedEventSchema = yup.object({
  domainId: yup.number().required(),
  name: yup.string().required(),
});

export const CreateTaskStoreCreatedEventSchema = yup.object({
  taskStoreAddress: yup.string().required(),
  taskId: yup.string().required(),
  domainId: yup.number().required(),
});

export const CreateColonyAvatarUploadedEventSchema = yup.object({
  ipfsHash: yup.string().required(),
  avatar: yup.string().required(),
});

export const CreateColonyAvatarRemovedEventSchema = yup.object({
  ipfsHash: yup.string().required(),
});

export const CreateTokenInfoAddedEventSchema = yup.object({
  isNative: yup.boolean().default(false),
  address: yup.string().required(),
  icon: yup.string(),
});

export const CreateColonyProfileCreatedEventSchema = yup.object({
  address: yup.string().required(),
  ensName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const CreateColonyProfileUpdatedEventSchema = yup.object({
  name: yup.string(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const CreateNotificationsReadUntilEventSchema = yup.object({
  readUntil: yup.string().required(),
  exceptFor: yup.array().of(yup.string()),
});

export const CreateCommentStoreCreatedEventSchema = yup.object({
  commentsStoreAddress: yup.string().required(),
});

export const CreateDueDateSetEventSchema = yup.object({
  dueDate: yup.number().required(),
});

export const CreateSkillSetEventSchema = yup.object({
  skillId: yup.string().required(),
});

export const CreateTaskCreatedEventSchema = yup.object({
  creator: yup.string().required(),
  domainId: yup.number().required(),
  taskId: yup.string().required(),
  specificationHash: yup.string().required(),
  title: yup.string().required(),
});

export const CreateTaskUpdatedEventSchema = yup.object({
  specificationHash: yup.string(),
  title: yup.string(),
});

export const CreateWorkInviteSentEventSchema = yup.object({
  creator: yup.string().required(),
  worker: yup.string().required(),
});

export const CreateWorkRequestCreatedEventSchema = yup.object({
  worker: yup.string().required(),
});

export const CreateCommentPostedEventSchema = yup.object({
  comment: yup
    .object()
    .shape({
      signature: yup.string().required(),
      content: yup
        .object()
        .shape({
          id: yup.string().required(),
          body: yup.string().required(),
          timestamp: yup.number().required(),
          metadata: yup.object().shape({
            mentions: yup
              .array()
              .of(yup.string())
              .required(),
          }),
        })
        .required(),
    })
    .required(),
});
