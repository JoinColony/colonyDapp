/* @flow */

import * as yup from 'yup';

export const CommentStoreCreatedEventArgsSchema = yup.object({
  commentsStoreAddress: yup.string.required(),
  taskId: yup.string.required(),
});

export const DueDateSetEventArgsSchema = yup.object({
  dueDate: yup.date(),
  taskId: yup.string().required(),
});

export const SkillSetEventArgsSchema = yup.object({
  skillId: yup.string().required(),
  taskId: yup.string().required(),
});

export const DraftCreatedEventArgsSchema = yup.object({
  draftId: yup.string().required(),
  creator: yup.string().required(),
  domainId: yup.number().required(),
  specificationHash: yup.string(),
  title: yup.string(),
});

export const DraftUpdatedEventArgsSchema = yup.object({
  domainId: yup.number(),
  specificationHash: yup.string(),
  title: yup.string(),
});

export const ColonyAvatarUploadedEventArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
  avatar: yup.string().required(),
});

export const ColonyAvatarRemovedEventArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
});

export const ColonyProfileCreatedEventArgsSchema = yup.object({
  address: yup
    .string()
    .address()
    .required(),
  ensName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const ColonyProfileUpdatedEventArgsSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  website: yup.string().url(),
  guideline: yup.string().url(),
});

export const TokenInfoAddedEventArgsSchema = yup.object({
  address: yup.string().address(),
  icon: yup.string(),
  name: yup.string(),
  symbol: yup.string(),
});

export const DomainCreatedEventArgsSchema = yup.object({
  domainId: yup.number(),
});

export const TaskStoreCreatedEventArgsSchema = yup.object({
  domainId: yup.number(),
  taskId: yup.string().required(),
  taskStoreAddress: yup.string().required(),
});

export const NotificationsReadUntilEventArgsSchema = yup.object({
  watermark: yup.number(),
  exceptFor: yup.array.of(yup.string.required()),
});
