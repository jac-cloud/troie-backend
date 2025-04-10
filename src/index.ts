import { Hono } from 'hono';
import { CONFIG } from './config';
import { alarmRoutes } from './routes/alarms';
import { dataRoutes } from './routes/data';
import { devicesRoutes } from './routes/devices';
import { checkMasterCertificate } from './utils/certManager';
import { initDevice } from './utils/initDevice';
import { cors } from 'hono/cors';

async function main() {
  const app = new Hono();

  app.use(cors({
    origin: CONFIG.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type'],
    credentials: true,
  }));

  app.route('/', dataRoutes);
  app.route('/', alarmRoutes);
  app.route('/', devicesRoutes);

  app.get('/', c => {
    return c.text('Team\nRilevamento\nOsservazione delle\nIntemperie e\Eventi');
  });

  Bun.serve({
    port: CONFIG.PORT,
    fetch: app.fetch,
  });

  await checkMasterCertificate();
  initDevice();
}

main();
