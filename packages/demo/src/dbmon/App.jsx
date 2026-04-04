/** @jsxImportSource jsx2 */

import * as jsx2 from 'jsx2';
import { useComputed } from 'jsx2';
import { DatabaseSignals } from './Database';
import { Database } from './Database';

export const App = ({ dbs }) => {
  var children = new Array(dbs.length);
  for (var i = 0; i < dbs.length; i++) {
    const db = dbs[i];
    children[i] = <Database key={i} db={db} id={db.id} />;
  }

  return (
    <div>
      <table className="table table-striped latest-data">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export const AppSignals = ({ dbsSignal }) => {
  const lengthComputed = useComputed(() => dbsSignal().length);
  var children = new Array(lengthComputed());
  for (var i = 0; i < lengthComputed(); i++) {
    children[i] = <DatabaseSignals key={i} dbsSignal={dbsSignal} dbIndex={i} />;
  }

  return (
    <div>
      <table className="table table-striped latest-data">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
