import { createElement, useMemo, useState, useEffect, useLayoutEffect, useCallback } from '/jsx2/jsx2';
import logo from './logo.png';
import './App.css';

function Seconds({ init }) {
  // Create the count state.
  const [count, setCount] = useState(0);
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('updating');
      setCount((count) => count + 1);
    }, 1000);
    return () => {
      console.log('cleanup');
      clearInterval(timer);
    };
  }, [init]);

  return (
    <p>
      Page has been open for <code>{count}</code> seconds.
    </p>
  );
}

function average(bucket) {
  let total = 0;
  for (let i = 0; i < bucket.length; i++) {
    total += bucket[i];
  }
  return total / bucket.length;
}
export function Raf() {
  const bucket = useMemo(() => [], []);
  const [avg, set] = useState(0);
  const [_, increment] = useState(0);
  const start = performance.now();
  useEffect(() => {
    bucket.push(performance.now() - start);
    const avg = average(bucket).toFixed(2);
    set(avg);
    increment(i => i + 1);
  });

  return <time>{avg}</time>
}

export function App() {
  const [enabled, toggle] = useState(true);
  const [num, setNum] = useState(0);
  const onChangeNum = useCallback((event) => {
    setNum(event.target.value);
  });
  const onChangeUnmount = useCallback(() => {
    toggle(!enabled);
  });

  return (
    <div className="App">
      <Raf />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input type="number" value={num} onChange={onChangeNum} />
        </div>
        <div>
          <label for="unmount">Unmount? </label>
          <input id="unmount" type="checkbox" checked={enabled} onChange={onChangeUnmount} />
        </div>
        {
          enabled ? <Seconds init={num}/> : null
        }
      </header>
    </div>
  );
}

export function SyncSetState() {
  console.log('App');
  const [s, set] = useState(0);
  useLayoutEffect(() => {
	  console.log('useEffect');
	}, [s]);

  set(s + 1);
  console.log('app2');
  return (
	  <div ref={() => {
      console.log(document.querySelector('#root').outerHTML)
    }}>
      {s}
  	</div>
  );

}
