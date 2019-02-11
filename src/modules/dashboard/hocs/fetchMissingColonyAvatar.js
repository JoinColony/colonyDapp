/* @flow */

import { branch, lifecycle } from 'recompose';
import type { DataRecordType, ColonyRecordType } from '~immutable';

type Props = {
  avatarData: string,
  colony: ?DataRecordType<ColonyRecordType>,
};

const shouldFetchColonyAvatar = ({ avatarData, colony }: Props) =>
  !!(
    !avatarData &&
    (colony && colony.record && colony.record && colony.record.avatar)
  );

const fetchMissingColonyAvatar = branch(
  shouldFetchColonyAvatar,
  lifecycle({
    componentDidMount() {
      const { colony, fetchColonyAvatar } = this.props;
      if (shouldFetchColonyAvatar(this.props))
        fetchColonyAvatar(colony.record.avatar);
    },
  }),
);

export default fetchMissingColonyAvatar;
