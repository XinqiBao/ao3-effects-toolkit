import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('Pages deployment fetches LFS assets and publishes the verified build', () => {
  const workflow = readFileSync(join(ROOT, '.github', 'workflows', 'deploy-pages.yml'), 'utf8');

  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /lfs:\s*true/);
  assert.match(workflow, /npm run verify/);
  assert.match(workflow, /path:\s*dist/);
  assert.match(workflow, /github\.event_name != 'pull_request'/);
});
