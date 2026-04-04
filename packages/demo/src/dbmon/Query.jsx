/** @jsxImportSource jsx2 */

import * as jsx2 from 'jsx2';
import { useComputed } from 'jsx2';
import { formatElapsed, queryClasses } from './utils';
import { EMPTY_QUERY } from './data';

var _arrow = <div className="arrow" />;

const Popover = jsx2.memo(({ query }) => {
  return (
    <div className="popover left">
      <div className="popover-content">{query}</div>
      {_arrow}
    </div>
  );
});

export const Query = jsx2.memo(({ query }) => {
  var elapsed = query.isEmpty ? 0.0 : query.elapsed;
  var queryText = query.isEmpty ? '' : query.query;
  return (
    <td className={queryClasses(elapsed)}>
      {formatElapsed(elapsed)}
      <Popover query={queryText} />
    </td>
  );
});

export const QuerySignals = jsx2.memo(({ queriesSignal, queryIndex }) => {
  const queryComputed = useComputed(() => queriesSignal()[queryIndex]);
  const elapsedComputed = useComputed(() => {
    const query = queryComputed();
    return query.isEmpty ? 0.0 : query.elapsed;
  });
  const queryTextComputed = useComputed(() => {
    const query = queryComputed();
    return query.isEmpty ? '' : query.query;
  });
  const queryClassComputed = useComputed(() => queryClasses(elapsedComputed()));
  const elapsedFormattedComputed = useComputed(() => formatElapsed(elapsedComputed()));

  return (
    <td className={queryClassComputed}>
      {elapsedFormattedComputed}
      <Popover query={queryTextComputed} />
    </td>
  );
});

export var _emptyQuery = <Query query={EMPTY_QUERY} />;
