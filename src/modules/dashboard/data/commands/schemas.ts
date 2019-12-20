import * as yup from 'yup';

export const CreateColonyProfileCommandArgsSchema = yup.object({
  colonyAddress: yup
    .string()
    // @ts-ignore
    .address()
    .required(),
  colonyName: yup.string().required(),
  displayName: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
  token: yup.object({
    address: yup
      .string()
      // @ts-ignore
      .address(),
    icon: yup.string(),
    name: yup.string(),
    symbol: yup.string(),
    isNative: yup.boolean(),
  }),
});

export const UpdateColonyProfileCommandArgsSchema = yup.object({
  displayName: yup.string(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const SetColonyAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup
    .string()
    // @ts-ignore
    .cid()
    .required(),
});

export const RemoveColonyAvatarCommandArgsSchema = yup.object({
  ipfsHash: yup
    .string()
    // @ts-ignore
    .cid()
    .required(),
});

export const CreateTaskCommandArgsSchema = yup.object({
  creatorAddress: yup.string().required(),
});

export const PostCommentCommandArgsSchema = yup.object({
  comment: yup.object({
    signature: yup.string().required(),
    content: yup.object({
      id: yup.string().required(),
      author: yup
        .string()
        // @ts-ignore
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

export const SendWorkRequestCommandArgsSchema = yup.object({
  worker: yup
    .string()
    // @ts-ignore
    .address()
    .required(),
});

export const SetTaskDomainCommandArgsSchema = yup.object({
  domainId: yup.number().required(),
});
