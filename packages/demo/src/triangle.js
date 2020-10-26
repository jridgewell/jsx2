import { render, createElement, useState, useEffect, useCallback } from '/jsx2/jsx2';

var dotStyle = {
  position: 'absolute',
  background: '#61dafb',
  font: 'normal 15px sans-serif',
  textAlign: 'center',
  cursor: 'pointer',
};

var containerStyle = {
  position: 'absolute',
  transformOrigin: '0 0',
  left: '50%',
  top: '50%',
  width: '10px',
  height: '10px',
  background: '#eee',
};

var targetSize = 25;

function Dot(props) {
  const [hover, setHover] = useState(false);
  const enter = useCallback(() => setHover(true));
  const leave = useCallback(() => setHover(false));
  var s = props.size * 1.3;
  var style = {
    ...dotStyle,
    width: s + 'px',
    height: s + 'px',
    left: props.x + 'px',
    top: props.y + 'px',
    borderRadius: s / 2 + 'px',
    lineHeight: s + 'px',
    background: hover ? '#ff0' : dotStyle.background,
  };
  return (
    <div style={style} onMouseEnter={enter} onMouseLeave={leave}>
      {hover ? '*' + props.text + '*' : props.text}
    </div>
  );
}

function SierpinskiTriangle({ x, y, s, children }) {
  if (s <= targetSize) {
    return <Dot x={x - targetSize / 2} y={y - targetSize / 2} size={targetSize} text={children} />;
    return r;
  }
  var newSize = s / 2;
  var slowDown = true;
  if (slowDown) {
    var e = performance.now() + 0.8;
    while (performance.now() < e) {
      // Artificially long execution time.
    }
  }

  s /= 2;

  return (
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
  );
}
SierpinskiTriangle.shouldComponentUpdate = function (oldProps, newProps) {
  var o = oldProps;
  var n = newProps;
  return !(o.x === n.x && o.y === n.y && o.s === n.s && o.children === n.children);
};

function App(props) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s % 10) + 1);
    });
    return () => clearInterval(interval);
  }, []);

  const elapsed = props.elapsed;
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

var start = new Date().getTime();
var root = document.getElementById('root');
function update() {
  render(<App elapsed={new Date().getTime() - start} />, root);
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
