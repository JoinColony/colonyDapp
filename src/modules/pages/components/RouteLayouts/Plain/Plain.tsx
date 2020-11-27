import React, { ReactNode } from 'react';

import { RouteComponentProps } from '~pages/RouteLayouts';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const Plain = ({ children }: Props) => <>{children}</>;

export default Plain;
