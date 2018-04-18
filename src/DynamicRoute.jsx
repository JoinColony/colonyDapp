/* @flow */

/*
 * This component is used only as a test reference please remove when setting
 * this up properly. Thanks!
 */

import React from 'react';

import { NavLink } from 'react-router-dom';

const DynamicImport = () => (
  <div>
    <ul>
      <li>
        <NavLink exact to="/" style={{ color: 'blue' }}>
          Go Back!
        </NavLink>
      </li>
    </ul>
    <p>This route was dynamically loaded. Congrats.</p>
  </div>
);

export default DynamicImport;
