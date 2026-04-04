// https://github.com/localvoid/react-dbmon/blob/master/web/js/main.jsx

/** @jsxImportSource jsx2 */

import './dbmon.css';

// import React from 'react';
import * as jsx2 from 'jsx2';
import { render, signal } from 'jsx2';
import { App, AppSignals } from './App';
import {
  startFPSMonitor,
  startMemMonitor,
  initProfiler,
  startProfile,
  endProfile,
} from 'perf-monitor';
import { DatabaseList } from './data';

var MUTATIONS = 0.5;
var SIGNALS = false;
var N = 50;

document.addEventListener('DOMContentLoaded', function () {
  startFPSMonitor();
  startMemMonitor();
  initProfiler('data update');
  initProfiler('view update');

  var dbs = new DatabaseList(N);
  var [getDbs, setDbs] = signal(dbs.dbs);

  var controls = document.createElement('div');
  controls.style.display = 'flex';
  var signalsText = document.createElement('label');
  signalsText.textContent = 'signals?: ';
  var signalsCheckbox = document.createElement('input');
  signalsCheckbox.type = 'checkbox';
  signalsCheckbox.addEventListener('change', function (e) {
    SIGNALS = e.target.checked;
    render(<AppSignals dbsSignal={getDbs} />, container);
  });
  controls.appendChild(signalsText);
  controls.appendChild(signalsCheckbox);

  var slider = document.createElement('input');
  slider.type = 'range';
  slider.style.marginBottom = '10px';
  slider.style.marginTop = '5px';
  var sliderText = document.createElement('label');
  sliderText.textContent = 'mutations : ' + (MUTATIONS * 100).toFixed(0) + '%';

  slider.addEventListener('change', function (e) {
    MUTATIONS = e.target.value / 100;
    sliderText.textContent = 'mutations : ' + (MUTATIONS * 100).toFixed(0) + '%';
  });
  controls.appendChild(sliderText);
  controls.appendChild(slider);
  document.body.insertBefore(controls, document.body.firstChild);

  var container = document.getElementById('dbmon');

  function update() {
    startProfile('data update');
    dbs.randomUpdate(MUTATIONS);
    endProfile('data update');

    startProfile('view update');
    if (SIGNALS) {
      setDbs([...dbs.dbs]);
    } else {
      render(<App dbs={dbs.dbs} />, container);
    }
    endProfile('view update');

    requestAnimationFrame(update);
  }

  if (SIGNALS) {
    render(<AppSignals dbsSignal={getDbs} />, container);
  } else {
    render(<App dbs={dbs.dbs} />, container);
  }
  requestAnimationFrame(update);
});
