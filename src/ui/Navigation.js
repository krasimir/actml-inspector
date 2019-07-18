import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { STYLES_NAV } from './constants';

export default function Navigation({ snapshots, children }) {
  return (
    <React.Fragment>
      <nav style={ STYLES_NAV }></nav>
      { snapshots && snapshots.length > 0 ? children(snapshots[snapshots.length - 1]) : null }
    </React.Fragment>
  );
}
Navigation.propTypes = {
  snapshots: PropTypes.array,
  children: PropTypes.any
};
