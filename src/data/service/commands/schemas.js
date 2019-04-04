/* @flow */

import * as yup from 'yup';

export const CreateColonyProfileCommandArgsSchema = yup.object({
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

export const SetColonyAvatarCommandArgsSchema = yup.object({
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

export const CreateTaskCommandArgsSchema = yup.object({
  creator: yup.string().required(),
});

export const SetTaskDescriptionCommandArgsSchema = yup.object({
  description: yup.string(),
});

export const SetTaskTitleCommandArgsSchema = yup.object({
  title: yup.string(),
});

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  readUntil: yup.string().required(),
  exceptFor: yup.array().of(yup.string().required()),
});

export const UserUpdateTokensCommandArgsSchema = yup.object({
  tokens: yup.array().of(yup.string()),
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
         * TODO When the time is right, add attachments
         */
        mentions: yup.array().of(yup.string().required()),
      }),
    }),
  }),
});

export const SendWorkInviteCommandArgsSchema = yup.object({
  worker: yup
    .string()
    .address()
    .required(),
});

export const SendWorkRequestCommandArgsSchema = yup.object({
  worker: yup
    .string()
    .address()
    .required(),
});

export const CreateUserProfileCommandArgsSchema = yup.object({
  username: yup.string().required(),
});

export const UpdateUserProfileCommandArgsSchema = yup.object({
  bio: yup.string(),
  displayName: yup.string(),
  location: yup.string(),
  website: yup.string(),
});

export const SetUserAvatarCommandArgsSchema = yup.object({
  // TODO: IPFS hash add yup validation for IPFS hash
  ipfsHash: yup.string().required(),
});

export const SetTaskPayoutCommandArgsSchema = yup.object({
  amount: yup.string().required(),
  token: yup.string().required(),
});

export const SetTaskDomainCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
});

export const CancelTaskCommandArgsSchema = yup.object({
  draftId: yup.string().required(),
  domainId: yup.number().required(),
});

export const FinalizeTaskCommandArgsSchema = yup.object({
  worker: yup
    .string()
    .address()
    .required(),
  amountPaid: yup.string().required(),
});
