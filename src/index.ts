import { Hono } from 'hono';
import { CONFIG } from './config';
import { alarmRoutes } from './routes/alarms';
import { dataRoutes } from './routes/data';
import { checkMasterCertificate } from './utils/certManager';
import { initDevice } from './utils/initDevice';

async function main() {
  const app = new Hono();

  app.route('/', dataRoutes);
  app.route('/', alarmRoutes);

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
