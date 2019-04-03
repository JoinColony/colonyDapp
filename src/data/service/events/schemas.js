/* @flow */

import * as yup from 'yup';

export const CreateDomainCreatedEventSchema = yup.object({
  domainId: yup.number().required(),
  name: yup.string().required(),
});

export const CreateTaskStoreRegisteredEventSchema = yup.object({
  commentsStoreAddress: yup.string().required(),
  draftId: yup.string().required(),
  taskStoreAddress: yup.string().required(),
});

export const CreateTaskStoreUnregisteredEventSchema = yup.object({
  taskStoreAddress: yup.string().required(),
  draftId: yup.string().required(),
});

export const CreateColonyAvatarUploadedEventSchema = yup.object({
  ipfsHash: yup.string().required(),
});

export const CreateColonyAvatarRemovedEventSchema = yup.object({
  ipfsHash: yup.string().required(),
});

export const CreateTokenInfoAddedEventSchema = yup.object({
  isNative: yup.boolean().default(false),
  address: yup.string().required(),
  icon: yup.string(),
});

// TODO set max lengths?
export const CreateColonyProfileCreatedEventSchema = yup.object({
  address: yup.string().required(),
  ensName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

// TODO set max lengths?
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

export const CreateDomainSetEventSchema = yup.object({
  domainId: yup.number().required(),
});

export const CreateTaskCreatedEventSchema = yup.object({
  creator: yup.string().required(),
});

export const CreateTaskDescriptionSetEventSchema = yup.object({
  description: yup.string(), // TODO set max length?
});

export const CreateTaskTitleSetEventSchema = yup.object({
  title: yup.string(), // TODO set max length?
});

export const WorkerAssignmentEventSchema = yup.object({
  worker: yup
    .string()
    .address()
    .required(),
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
          author: yup
            .string()
            .address()
            .required(),
          body: yup.string().required(), // TODO set max length?
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

export const TaskStatusChangeEventSchema = yup.object({
  status: yup.string().required(),
});

export const CreatePayoutSetEventSchema = yup.object({
  amount: yup.string().required(),
  token: yup.string(),
});

export const CreateTaskFinalizedEventSchema = yup.object({
  status: yup.string().required(),
  worker: yup
    .string()
    .address()
    .required(),
  amountPaid: yup.string().required(),
});
