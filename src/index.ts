import { Hono } from 'hono';
import { checkMasterCertificate } from './utils/certManager';
import { initDevice } from './utils/initDevice';
import { CONFIG } from './config';
import { dataRoutes } from './routes/data';

async function main() {
  const app = new Hono();

  app.route('/', dataRoutes);

  app.get('/', c => {
    return c.text('Hello Hono!');
  });

  Bun.serve({
    port: CONFIG.PORT,
    fetch: app.fetch,
  });

  await checkMasterCertificate();
  initDevice();
}

main();
