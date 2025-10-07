import { execSync, spawn } from 'node:child_process';

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startServer = () => {
  const server = spawn('npx', ['http-server', 'apps/web/dist', '-p', '4173'], {
    stdio: 'ignore',
    shell: false,
  });
  return server;
};

(async () => {
  console.log('Running Gold Shore local QA checks…');
  run('node packages/image-tools/process-images.mjs');
  run('cd apps/web && npm install');
  run('cd apps/web && npm run build');

  console.log('\nStarting local server for accessibility audit…');
  const server = startServer();
  await sleep(2000);

  try {
    run('npx lighthouse http://localhost:4173 --only-categories=accessibility --quiet');
    console.log('\n✅ Accessibility audit completed.');
  } catch (error) {
    console.error('\n❌ Accessibility audit failed.');
    throw error;
  } finally {
    server.kill();
  }
})();
