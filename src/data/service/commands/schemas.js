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

export const CreateTaskCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
  draftId: yup.string().required(),
  specificationHash: yup.string(),
  title: yup.string(),
});

export const UpdateTaskCommandArgsSchema = yup.object({
  specificationHash: yup.string(),
  title: yup.string(),
});

export const MarkNotificationsAsReadCommandArgsSchema = yup.object({
  readUntil: yup.string().required(),
  exceptFor: yup.array().of(yup.string().required()),
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
  data: yup.string().required(),
});

export const SetTaskBountyCommandArgsSchema = yup.object({
  amount: yup.string().required(),
});

export const CancelTaskCommandArgsSchema = yup.object({
  taskId: yup.string().required(),
  domainId: yup.number().required(),
});

export const FinalizeTaskCommandArgsSchema = yup.object({
  worker: yup
    .string()
    .address()
    .required(),
  amountPaid: yup.string().required(),
});
