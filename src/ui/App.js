import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { STYLE_INSPECTOR } from './constants';
import Navigation from './Navigation';
import Graph from './Graph';

function AppComponent({ snapshots }) {
  return (
    <div className='actml-inspector' style={ STYLE_INSPECTOR }>
      <Navigation snapshots={ snapshots }>
        {
          (snapshot) => <Graph snapshot={ snapshot }/>
        }
      </Navigation>
    </div>
  );
}
AppComponent.propTypes = {
  snapshots: PropTypes.array
};

export function init(options) {
  const snapshots = [];

  ReactDOM.render(<AppComponent />, options.container);

  return {
    render(snapshot) {
      snapshots.push(snapshot);
      ReactDOM.render(<AppComponent snapshots={ snapshots }/>, options.container);
    }
  };
}
