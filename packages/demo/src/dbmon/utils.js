export function formatElapsed(v) {
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

export function counterClasses(count) {
  if (count >= 20) {
    return 'label label-important';
  } else if (count >= 10) {
    return 'label label-warning';
  }
  return 'label label-success';
}

export function queryClasses(elapsed) {
  if (elapsed >= 10.0) {
    return 'Query elapsed warn_long';
  } else if (elapsed >= 1.0) {
    return 'Query elapsed warn';
  }
  return 'Query elapsed short';
}
