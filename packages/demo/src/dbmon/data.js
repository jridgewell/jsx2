// https://github.com/localvoid/react-dbmon/blob/master/web/js/data.js
function Query(elapsed, query) {
  this.elapsed = elapsed;
  this.query = query;
}

export const EMPTY_QUERY = new Query(0.0, '');

Query.rand = function() {
  var elapsed = Math.random() * 15;
  var query = 'SELECT blah FROM something';

  if (Math.random() < 0.2) {
    query = '<IDLE> in transaction';
  }

  if (Math.random() < 0.1) {
    query = 'vacuum';
  }

  return new Query(elapsed, query);
};

var _nextId = 0;

function Database(name) {
  this.name = name;
  this.queries = null;

  this.update();
}

Database.prototype.update = function() {
  var queries = [];

  var r = Math.floor((Math.random() * 10) + 1);
  for (var j = 0; j < r; j++) {
    queries.push(Query.rand());
  }

  this.queries = queries;
};

Database.prototype.getTopFiveQueries = function() {
  var qs = this.queries.slice();
  qs.sort(function(a, b) {
    return a.elapsed - b.elapsed;
  });
  qs = qs.slice(0, 5);
  while (qs.length < 5) {
    qs.push(EMPTY_QUERY);
  }
  return qs;
};

export function DatabaseList(n) {
  this.dbs = [];

  for (var i = 0; i < n; i++) {
    this.dbs.push(new Database('cluster' + i));
    this.dbs.push(new Database('cluster' + i + 'slave'));
  }
}

DatabaseList.prototype.update = function() {
  var dbs = this.dbs;
  for (var i = 0; i < dbs.length; i++) {
    dbs[i] = new Database(dbs[i].name);
  }
};

DatabaseList.prototype.randomUpdate = function(r) {
  var dbs = this.dbs;
  for (var i = 0; i < dbs.length; i++) {
    if (Math.random() < r) {
      dbs[i] = new Database(dbs[i].name);
    }
  }
};
