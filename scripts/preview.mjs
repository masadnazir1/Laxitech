import { access, lstat, realpath, symlink } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const standalone = join(root, '.next/standalone');
const server = join(standalone, 'server.js');

await access(server);

for (const [destination, source] of [
  [join(standalone, 'public'), join(root, 'public')],
  [join(standalone, '.next/static'), join(root, '.next/static')],
]) {
  await access(source);
  const entry = await lstat(destination).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (!entry) {
    await symlink(relative(dirname(destination), source), destination, 'dir');
  } else if (entry.isSymbolicLink()) {
    if (await realpath(destination) !== await realpath(source)) throw new Error(`Unexpected preview asset link: ${destination}`);
  } else if (!entry.isDirectory()) {
    throw new Error(`Expected an asset directory: ${destination}`);
  }
}

process.env.PORT ||= '3001';
process.env.HOSTNAME = '0.0.0.0';

await import(pathToFileURL(server).href);
