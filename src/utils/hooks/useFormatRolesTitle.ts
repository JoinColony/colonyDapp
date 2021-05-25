import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';

import { ActionUserRoles, ColonyActions, ColonyMotions } from '~types/index';

export const useFormatRolesTitle = (
  roles: ActionUserRoles[],
  actionType: string,
  isMotion?: boolean,
) => {
  let roleTitle = '';
  let roleMessageDescriptorId = '';
  const { formatMessage } = useIntl();

  if (
    !roles ||
    actionType !==
      (isMotion ? ColonyMotions.SetUserRolesMotion : ColonyActions.SetUserRoles)
  ) {
    return { roleTitle };
  }

  const assignedRoles = roles.filter((role) => role.setTo);
  const unassignedRoles = roles.filter((role) => !role.setTo);

  const getFormattedRoleList = (
    roleGroupA: ActionUserRoles[],
    roleGroupB: ActionUserRoles[] | null,
  ) => {
    let roleList = '';

    roleGroupA.forEach((role: ActionUserRoles, i: number) => {
      const roleNameMessage = { id: `role.${role.id}` };
      const formattedRole = formatMessage(roleNameMessage);

      roleList += ` ${formattedRole.toLowerCase()}`;

      if (
        i < roleGroupA.length - 1 ||
        (i === roleGroupA.length - 1 && !isEmpty(roleGroupB))
      ) {
        roleList += ',';
      }
    });

    return roleList;
  };

  if (!isEmpty(assignedRoles)) {
    roleTitle += getFormattedRoleList(assignedRoles, unassignedRoles);
    roleMessageDescriptorId = isMotion
      ? `motion.${ColonyMotions.SetUserRolesMotion}.assign`
      : `action.${ColonyActions.SetUserRoles}.assign`;
  }

  if (isEmpty(assignedRoles) && !isEmpty(unassignedRoles)) {
    roleTitle += getFormattedRoleList(unassignedRoles, null);
    roleMessageDescriptorId = isMotion
      ? `motion.${ColonyMotions.SetUserRolesMotion}.remove`
      : `action.${ColonyActions.SetUserRoles}.remove`;
  } else if (!isEmpty(unassignedRoles)) {
    roleTitle = `Assign the ${roleTitle}`;
    roleTitle += ` and remove the${getFormattedRoleList(
      unassignedRoles,
      null,
    )}`;
    roleMessageDescriptorId += 'AndRemove';
  }

  roleTitle += roles.length > 1 ? ' permissions' : ' permission';

  return {
    roleTitle,
    roleMessageDescriptorId: !isEmpty(roleMessageDescriptorId)
      ? roleMessageDescriptorId
      : null,
  };
};
