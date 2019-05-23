/* @flow */

import * as yup from 'yup';

export const CreateColonyProfileCommandArgsSchema = yup.object({
  colonyAddress: yup
    .string()
    .address()
    .required(),
  colonyName: yup.string().required(),
  displayName: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
  token: yup.object({
    address: yup.string().address(),
    icon: yup.string(),
    name: yup.string(),
    symbol: yup.string(),
    isNative: yup.boolean(),
  }),
});

export const UpdateColonyProfileCommandArgsSchema = yup.object({
  displayName: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const CreateDomainCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
  name: yup.string().required(),
});

export const SetColonyAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup
    .string()
    .cid()
    .required(),
});

export const RemoveColonyAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup
    .string()
    .cid()
    .required(),
});

export const SetTaskDueDateCommandArgsSchema = yup.object({
  dueDate: yup.number().required(),
});

export const SetTaskSkillCommandArgsSchema = yup.object({
  skillId: yup.number().required(),
});

export const CreateTaskCommandArgsSchema = yup.object({
  creatorAddress: yup.string().required(),
});

export const SetTaskDescriptionCommandArgsSchema = yup.object({
  description: yup.string(),
});

export const SetTaskTitleCommandArgsSchema = yup.object({
  title: yup.string(),
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
      body: yup.string().required(),
      metadata: yup.object({
        /*
         * @NOTE: When the time is right, add attachments
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

export const SetTaskPayoutCommandArgsSchema = yup.object({
  amount: yup.string().required(),
  token: yup.string().required(),
});

export const SetTaskDomainCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
});

export const CancelTaskCommandArgsSchema = yup.object({
  draftId: yup.string().required(),
});

export const FinalizeTaskCommandArgsSchema = yup.object({
  worker: yup
    .string()
    .address()
    .required(),
  amountPaid: yup.string().required(),
});
