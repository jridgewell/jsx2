import { render, createElement, useState, useEffect, useCallback, useMemo } from '/jsx2/jsx2';

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

function Dot({ x, y, size, text }) {
  const [hover, setHover] = useState(false);
  const enter = useCallback(() => setHover(true));
  const leave = useCallback(() => setHover(false));
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

function App({ elapsed }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s % 10) + 1);
    });
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

const start = new Date().getTime();
const root = document.getElementById('root');
function update() {
  render(<App elapsed={new Date().getTime() - start} />, root);
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
