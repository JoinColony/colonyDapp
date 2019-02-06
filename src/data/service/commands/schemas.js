/* @flow */

import * as yup from 'yup';

export const CreateColonyCommandArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
  ensName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
  token: yup.object({
    address: yup.string().address(),
    icon: yup.string(),
    name: yup.string(),
    symbol: yup.string(),
  }),
});

export const UpdateColonyProfileCommandArgsSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const CreateDomainCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
});

export const UploadColonyAvatarCommandArgsSchema = yup.object({
  avatar: yup.string().required(),
  ipfsHash: yup.string().required(),
});

export const RemoveColonyAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup.string().required(),
});

export const SetTaskDueDateCommandArgsSchema = yup.object({
  dueDate: yup.date(),
});

export const SetTaskSkillCommandArgsSchema = yup.object({
  skillId: yup.string().required(),
});

export const CreateTaskDraftCommandArgsSchema = yup.object({
  creator: yup.string().required(),
  meta: yup.string(),
  domainId: yup.number().required(),
  draftId: yup.string().required(),
  specificationHash: yup.string(),
  title: yup.string(),
});

export const UpdateTaskDraftCommandArgsSchema = yup.object({
  specificationHash: yup.string(),
  meta: yup.string(),
  title: yup.string(),
});

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  watermark: yup.string().required(),
  exceptFor: yup.array.of(yup.string.required()),
});

export const PostCommentCommandArgsSchema = yup.object({
  comment: yup.object({
    signature: yup.string().required(),
    content: yup.object({
      id: yup.string().required(),
      author: yup
        .string()
        .address()
        .required(),
      timestamp: yup.date().default(() => Date.now()),
      body: yup.string().required(),
      metadata: yup.object({
        /*
         * @TODO When the time is right, add attachments
         */
        mentions: yup.array().of(yup.string().required()),
      }),
    }),
  }),
});

export const SendWorkInviteCommandArgsSchema = yup.object({
  worker: yup.string(),
});

export const CreateUserProfileCommandArgsSchema = yup.object({
  displayName: yup.string(),
  bio: yup.string(),
  avatar: yup.string(),
  website: yup.string(),
  location: yup.string(),
});

export const UpdateUserProfileCommandArgsSchema = yup.object({
  displayName: yup.string(),
  bio: yup.string(),
  avatar: yup.string(),
  website: yup.string(),
  location: yup.string(),
});

export const SetUserAvatarCommandArgsSchema = yup.object({
  avatar: yup.string().required(),
});
