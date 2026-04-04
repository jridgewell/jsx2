var _nextQueryId = 0;

function Query(elapsed, query, isEmpty) {
  this.id = _nextQueryId++;
  this.elapsed = elapsed;
  this.query = query;
  this.isEmpty = isEmpty;
}

export const EMPTY_QUERY = new Query(0.0, '', true);

Query.prototype.update = function (elapsed, query, isEmpty) {
  this.id = _nextQueryId++;
  this.elapsed = elapsed;
  this.query = query;
  this.isEmpty = isEmpty;
};

Query.prototype.updateRandom = function () {
  var elapsed = Math.random() * 15;
  var query = 'SELECT blah FROM something';

  if (Math.random() < 0.2) {
    query = '<IDLE> in transaction';
  }

  if (Math.random() < 0.1) {
    query = 'vacuum';
  }

  this.update(elapsed, query, false);
};

Query.prototype.updateEmpty = function () {
  this.update(0, '', true);
};

Query.rand = function () {
  var query = new Query(0, '', false);
  query.updateRandom();
  return query;
};

var _nextDatabaseId = 0;

function Database(name) {
  this.id = _nextDatabaseId++;
  this.name = name;
  this.queries = new Array(10);
  this.length = 10;
  for (var i = 0; i < 10; i++) {
    this.queries[i] = new Query(0, '', true);
  }

  this.update();
}

Database.prototype.update = function() {
  this.id = _nextDatabaseId++;
  var r = Math.floor((Math.random() * 10) + 1);
  for (var j = 0; j < 10; j++) {
    if (j < r) {
      this.queries[j].updateRandom();
    } else {
      this.queries[j].updateEmpty();
    }
  }
  this.length = r;
};

Database.prototype.sorted = function () {
  const qs = this.queries;
  qs.sort(function(a, b) {
    if (a.isEmpty) return 1;
    if (b.isEmpty) return -1;
    return a.elapsed - b.elapsed;
  });
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
    dbs[i].update();
  }
};

DatabaseList.prototype.randomUpdate = function(r) {
  var dbs = this.dbs;
  for (var i = 0; i < dbs.length; i++) {
    if (Math.random() < r) {
      dbs[i].update();
    }
  }
};
