const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const packages = fs.readdirSync(path.join('.', 'packages'));
let status = 0;
for (const package of packages) {
  const cwd = path.join(__dirname, 'packages', package);
  const stats = fs.statSync(cwd);
  if (stats.isFile()) continue;

  console.log(`Testing ${package}`);
  const cp = spawnSync('npm', ['test'], { cwd, stdio: 'inherit' });
  if (cp.status !== 0) {
    status = cp.status;
  }
}

process.exit(status);
