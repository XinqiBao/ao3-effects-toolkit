import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteSource = join(repositoryRoot, 'site');
const outputDirectory = join(repositoryRoot, 'dist');
const copyOptions = {
  recursive: true,
  filter: (source) => basename(source) !== '.DS_Store',
};

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

for (const entry of await readdir(siteSource)) {
  await cp(join(siteSource, entry), join(outputDirectory, entry), copyOptions);
}

for (const directory of ['effects', 'assets']) {
  await cp(join(repositoryRoot, directory), join(outputDirectory, directory), copyOptions);
}

await writeFile(join(outputDirectory, '.nojekyll'), '');

console.log(`Built GitHub Pages site in ${outputDirectory}`);
