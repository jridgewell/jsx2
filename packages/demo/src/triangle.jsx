/** @jsxImportSource jsx2 */

import { render, useState, useEffect, useCallback, useMemo, signal, useComputed, useSignal } from 'jsx2';
import {
  startFPSMonitor,
  startMemMonitor,
  initProfiler,
  startProfile,
  endProfile,
} from 'perf-monitor';

const dotStyle = {
  position: 'absolute',
  background: '#61dafb',
  font: 'normal 15px sans-serif',
  textAlign: 'center',
  cursor: 'pointer',
};

const containerStyle = {
  position: 'absolute',
  transformOrigin: '0 0',
  left: '50%',
  top: '50%',
  width: '10px',
  height: '10px',
  background: '#eee',
};

const targetSize = 25;

var SIGNALS = false;

function readHash() {
  if (!location.hash) return;
  const params = new URLSearchParams(window.location.hash.substring(1));
  SIGNALS = params.get('signals') === 'true';
}
readHash();

function updateHash() {
  const params = new URLSearchParams();
  params.set('signals', SIGNALS);
  window.location.hash = params.toString();
}

var [getElapsed, setElapsed] = signal(0);


function Dot({ x, y, size, text }) {
  const [hover, setHover] = useState(false);
  const enter = useCallback(() => setHover(true), []);
  const leave = useCallback(() => setHover(false), []);
  const s = size * 1.3;
  const style = {
    ...dotStyle,
    width: s + 'px',
    height: s + 'px',
    left: x + 'px',
    top: y + 'px',
    borderRadius: s / 2 + 'px',
    lineHeight: s + 'px',
    background: hover ? '#ff0' : dotStyle.background,
  };
  return (
    <div style={style} onMouseEnter={enter} onMouseLeave={leave}>
      {hover ? '*' + text + '*' : text}
    </div>
  );
}

function SierpinskiTriangle({ x, y, s, children }) {
  if (s <= targetSize) {
    return <Dot x={x - targetSize / 2} y={y - targetSize / 2} size={targetSize} text={children} />;
  }
  const slowDown = true;
  if (slowDown) {
    const e = performance.now() + 0.8;
    while (performance.now() < e) {
      // Artificially long execution time.
    }
  }

  s /= 2;
  return useMemo(
    () => (
      <div>
        <SierpinskiTriangle x={x} y={y - s / 2} s={s}>
          {children}
        </SierpinskiTriangle>
        <SierpinskiTriangle x={x - s} y={y + s / 2} s={s}>
          {children}
        </SierpinskiTriangle>
        <SierpinskiTriangle x={x + s} y={y + s / 2} s={s}>
          {children}
        </SierpinskiTriangle>
      </div>
    ),
    [x, y, s, children],
  );
}

function DotSignals({ x, y, size, secondsSignal }) {
  const [hover, setHover] = useSignal(false);
  const enter = useCallback(() => setHover(true), []);
  const leave = useCallback(() => setHover(false), []);
  const s = size * 1.3;
  const textComputed = useComputed(() => {
    const text = secondsSignal();
    return hover() ? '*' + text + '*' : text;
  }, []);
  const styleComputed = useComputed(() => {
    return {
      ...dotStyle,
      width: s + 'px',
      height: s + 'px',
      left: x + 'px',
      top: y + 'px',
      borderRadius: s / 2 + 'px',
      lineHeight: s + 'px',
      background: hover() ? '#ff0' : dotStyle.background,
    };
  }, [x, y, s]);

  return (
    <div style={styleComputed} onMouseEnter={enter} onMouseLeave={leave}>
      {textComputed}
    </div>
  );
}

function SierpinskiTriangleSignals({ x, y, s, secondsSignal }) {
  if (s <= targetSize) {
    return <DotSignals x={x - targetSize / 2} y={y - targetSize / 2} size={targetSize} secondsSignal={secondsSignal} />;
  }
  s /= 2;
  return <div>
    <SierpinskiTriangleSignals x={x} y={y - s / 2} s={s} secondsSignal={secondsSignal} />
    <SierpinskiTriangleSignals x={x - s} y={y + s / 2} s={s} secondsSignal={secondsSignal} />
    <SierpinskiTriangleSignals x={x + s} y={y + s / 2} s={s} secondsSignal={secondsSignal} />
  </div>;
}

export function AppSignals({ elapsedSignal }) {
  var [getSeconds, _setSeconds, updateSeconds] = useSignal(0);
  var [count, setCount] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      updateSeconds((s) => (s % 10) + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const styleComputed = useComputed(() => {
    const t = (elapsedSignal() / 1000) % 10;
    const scale = 1 + (t > 5 ? 10 - t : t) / 10;
    return { ...containerStyle, transform: `scaleX(${scale / 2.1 / count}) scaleY(${0.7 / count}) translateZ(0.1px)` };
  }, [count]);

  return (
    <>
      <div style={{ position: 'fixed', top: '100px', left: '10px' }}>
        <button onClick={() => setCount(c => c + 1)}>Increase Dots</button>
        <button onClick={() => setCount(c => c - 1)}>Decrease Dots</button>
        {count * 1000}
      </div>
      <div style={styleComputed}>
        <div>
          <SierpinskiTriangleSignals x={0} y={0} s={1000 * count} secondsSignal={getSeconds} />
        </div>
      </div>
    </>
  );
}

function App({ elapsed }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s % 10) + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = (elapsed / 1000) % 10;
  const scale = 1 + (t > 5 ? 10 - t : t) / 10;
  const transform = 'scaleX(' + scale / 2.1 + ') scaleY(0.7) translateZ(0.1px)';
  return (
    <div style={{ ...containerStyle, transform }}>
      <div>
        <SierpinskiTriangle x={0} y={0} s={1000}>
          {seconds}
        </SierpinskiTriangle>
      </div>
    </div>
  );
}

var controls = document.createElement('div');
controls.style.position = 'fixed';
controls.style.top = '10px';
controls.style.left = '10px';
controls.style.background = 'white';
controls.style.padding = '5px';
controls.style.border = '1px solid black';
controls.style.zIndex = '1000';

var checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.checked = SIGNALS;
checkbox.addEventListener('change', function (e) {
  SIGNALS = e.target.checked;
  updateHash();
  if (SIGNALS) {
    render(<AppSignals elapsedSignal={getElapsed} />, document.getElementById('root'));
  }
});

var label = document.createElement('label');
label.textContent = ' signals?';
label.insertBefore(checkbox, label.firstChild);

controls.appendChild(label);
document.body.appendChild(controls);

startFPSMonitor();
startMemMonitor();
initProfiler('update');

const start = new Date().getTime();
const root = document.getElementById('root');

function update() {
  startProfile('update');
  if (SIGNALS) {
    setElapsed(new Date().getTime() - start);
  } else {
    render(<App elapsed={new Date().getTime() - start} />, root);
  }
  endProfile('update');
  requestAnimationFrame(update);
}

if (SIGNALS) {
  render(<AppSignals elapsedSignal={getElapsed} />, root);
}
requestAnimationFrame(update);
