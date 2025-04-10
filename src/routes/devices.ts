import { Hono } from 'hono';
import { z } from 'zod';
import { getDevices } from '../services/getDevices';

export const devicesRoutes = new Hono();

export const DevicesResponse = z.array(
  z.object({
    deviceId: z.string(),
    deviceName: z.string().nullable(),
  }),
);

devicesRoutes.get('/devices', async c => {
  const data = await getDevices();
  return c.json(DevicesResponse.parse(data));
});
