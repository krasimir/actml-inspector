import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { STYLES_NAV } from './constants';

const getId = snapshot => snapshot[1].element.id;

export default function Navigation({ snapshots, children }) {
  const [ current, setCurrent ] = useState(null);
  const latest = snapshots && snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const snapshotToRender = current ? current : latest;

  return (
    <React.Fragment>
      <nav style={ STYLES_NAV }>
        { snapshots && snapshots.map(snapshot => {
          return <button key={ getId(snapshot) } onClick={ () => setCurrent(snapshot) }>{ getId(snapshot) }</button>;
        })}
      </nav>
      { snapshotToRender && children(snapshotToRender) }
    </React.Fragment>
  );
}
Navigation.propTypes = {
  snapshots: PropTypes.array,
  children: PropTypes.any
};
