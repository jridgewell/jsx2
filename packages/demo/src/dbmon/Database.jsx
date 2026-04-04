/** @jsxImportSource jsx2 */

import * as jsx2 from 'jsx2';
import { useComputed } from 'jsx2';
import { counterClasses } from './utils';
import { Query, QuerySignals, _emptyQuery } from './Query';
import { EMPTY_QUERY } from './data';

export const Database = jsx2.memo(({ db }) => {
  var topFiveQueries = db.sorted();
  var count = db.length;

  var children = new Array(7);
  children[0] = <td className="dbname">{db.name}</td>;
  children[1] = (
    <td className="query-count">
      <span className={counterClasses(count)}>{count}</span>
    </td>
  );

  for (var i = 0; i < 5; i++) {
    var query = topFiveQueries[i];
    children[i + 2] = <Query query={query} id={query.id} />;
  }

  return <tr>{children}</tr>;
});

export const DatabaseSignals = jsx2.memo(({ dbsSignal, dbIndex }) => {
  const dbComputed = useComputed(() => dbsSignal()[dbIndex]);
  const queriesComputed = useComputed(() => dbComputed().sorted());
  const countComputed = useComputed(() => dbComputed().length);
  const nameComputed = useComputed(() => dbComputed().name);
  const counterClassComputed = useComputed(() => counterClasses(countComputed()));

  var children = new Array(7);
  children[0] = <td className="dbname">{nameComputed}</td>;
  children[1] = (
    <td className="query-count">
      <span className={counterClassComputed}>
        {countComputed}
      </span>
    </td>
  );

  for (var i = 0; i < 5; i++) {
    children[i + 2] = (
      <QuerySignals queriesSignal={queriesComputed} queryIndex={i} />
    );
  }

  return <tr>{children}</tr>;
});
