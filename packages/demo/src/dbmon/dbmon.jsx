// https://github.com/localvoid/react-dbmon/blob/master/web/js/main.jsx

/** @jsxImportSource jsx2 */

import './dbmon.css';

// import React from 'react';
import * as jsx2 from 'jsx2';
import { render } from 'jsx2';
import {
  startFPSMonitor,
  startMemMonitor,
  initProfiler,
  startProfile,
  endProfile,
} from 'perf-monitor';
import { DatabaseList, EMPTY_QUERY } from './data';

function formatElapsed(v) {
  if (!v) return '';

  var str = parseFloat(v).toFixed(2);

  if (v > 60) {
    var minutes = Math.floor(v / 60);
    var comps = (v % 60).toFixed(2).split('.');
    var seconds = comps[0];
    var ms = comps[1];
    str = minutes + ':' + seconds + '.' + ms;
  }

  return str;
}

function counterClasses(count) {
  if (count >= 20) {
    return 'label label-important';
  } else if (count >= 10) {
    return 'label label-warning';
  }
  return 'label label-success';
}

function queryClasses(elapsed) {
  if (elapsed >= 10.0) {
    return 'Query elapsed warn_long';
  } else if (elapsed >= 1.0) {
    return 'Query elapsed warn';
  }
  return 'Query elapsed short';
}

var _arrow = <div className="arrow" />;

const Popover = jsx2.memo(({ query }) => {
  return (
    <div className="popover left">
      <div className="popover-content">{query}</div>
      {_arrow}
    </div>
  );
});

const Query = jsx2.memo(({ query }) => {
  var elapsed = query.elapsed;
  return (
    <td className={queryClasses(elapsed)}>
      {formatElapsed(elapsed)}
      <Popover query={query.query} />
    </td>
  );
});

var _emptyQuery = <Query query={EMPTY_QUERY} />;

const Database = jsx2.memo(({ db }) => {
  var topFiveQueries = db.getTopFiveQueries();
  var count = db.queries.length;

  var children = new Array(7);
  children[0] = <td className="dbname">{db.name}</td>;
  children[1] = (
    <td className="query-count">
      <span className={counterClasses(count)}>{count}</span>
    </td>
  );

  for (var i = 0; i < 5; i++) {
    var query = topFiveQueries[i];
    if (query !== EMPTY_QUERY) {
      children[i + 2] = <Query query={topFiveQueries[i]} />;
    } else {
      children[i + 2] = _emptyQuery;
    }
  }

  return <tr>{children}</tr>;
});

const App = ({ dbs }) => {
  var children = new Array(dbs.length);
  for (var i = 0; i < dbs.length; i++) {
    children[i] = <Database key={i} db={dbs[i]} />;
  }

  return (
    <div>
      <table className="table table-striped latest-data">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

var MUTATIONS = 0.5;
var N = 50;

document.addEventListener('DOMContentLoaded', function () {
  startFPSMonitor();
  startMemMonitor();
  initProfiler('data update');
  initProfiler('view update');

  var dbs = new DatabaseList(N);

  var sliderContainer = document.createElement('div');
  sliderContainer.style.display = 'flex';
  var slider = document.createElement('input');
  slider.type = 'range';
  slider.style.marginBottom = '10px';
  slider.style.marginTop = '5px';
  var text = document.createElement('label');
  text.textContent = 'mutations : ' + (MUTATIONS * 100).toFixed(0) + '%';

  slider.addEventListener('change', function (e) {
    MUTATIONS = e.target.value / 100;
    text.textContent = 'mutations : ' + (MUTATIONS * 100).toFixed(0) + '%';
  });
  sliderContainer.appendChild(text);
  sliderContainer.appendChild(slider);
  document.body.insertBefore(sliderContainer, document.body.firstChild);

  var container = document.getElementById('dbmon');

  function update() {
    startProfile('data update');
    dbs.randomUpdate(MUTATIONS);
    endProfile('data update');

    startProfile('view update');
    render(<App dbs={dbs.dbs} />, container);
    endProfile('view update');

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
});
