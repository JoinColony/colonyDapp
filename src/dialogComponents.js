/* @flow */

/*
 * @NOTE Dialog components have been extracted into they're own file.
 *
 * This is because this list has a potential of getting very long.
 */

import ActivityBarExample from '~core/ActivityBar/ActivityBarExample.jsx';
import TokenEditDialog from '~admin/Tokens/TokenEditDialog.jsx';
import TokenMintDialog from '~admin/Tokens/TokenMintDialog.jsx';
import TaskRequestWorkDialog from /*
 * Again, the same trick of making prettier not suggest a fix that would
 * break the eslint rules, by just adding a comment
 */ '~dashboard/TaskRequestWork/TaskRequestWorkDialog.jsx';
import TaskRatingDialog from '~dashboard/TaskRatingDialog';

const dialogComponents: Object = {
  // Hint: Once we have the gas station we just have to add it here
  ActivityBarExample,
  TokenEditDialog,
  TokenMintDialog,
  TaskRequestWorkDialog,
  TaskRatingDialog,
};

export default dialogComponents;
