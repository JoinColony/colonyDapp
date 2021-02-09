import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';

export const useFormatRolesTitle = (roles) => {
  let roleTitle = '';
  const { formatMessage } = useIntl();

  if (!roles) {
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
    roleTitle += `Assign the${getFormattedRoleList(
      assignedRoles,
      unassignedRoles,
    )}`;
  }

  if (isEmpty(assignedRoles) && !isEmpty(unassignedRoles)) {
    roleTitle += `Remove the${getFormattedRoleList(
      unassignedRoles,
      assignedRoles,
    )}`;
  } else if (!isEmpty(unassignedRoles)) {
    roleTitle += ` and remove the${getFormattedRoleList(
      unassignedRoles,
      assignedRoles,
    )}`;
  }

  roleTitle += roles.length > 1 ? ' permissions' : ' permission';

  return {
    roleTitle,
  };
};
