import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';

import { ColonyActions } from '~types/index';

export const useFormatRolesTitle = (roles, actionType) => {
  let roleTitle = '';
  let roleMessageDescriptorId = '';
  const { formatMessage } = useIntl();

  if (!roles || actionType !== ColonyActions.SetUserRoles) {
    return { roleTitle };
  }

  const assignedRoles = roles.filter((role) => role.setTo);
  const unassignedRoles = roles.filter((role) => !role.setTo);

  const getFormattedRoleList = (roleGroupA, roleGroupB) => {
    let roleList = '';

    roleGroupA.forEach((role, i) => {
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
    roleMessageDescriptorId = `action.${ColonyActions.SetUserRoles}.assign`;
  }

  if (isEmpty(assignedRoles) && !isEmpty(unassignedRoles)) {
    roleTitle += getFormattedRoleList(unassignedRoles, null);
    roleMessageDescriptorId = `action.${ColonyActions.SetUserRoles}.remove`;
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
