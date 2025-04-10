import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { getSensorData } from '../services/getSensorData';
import { getSensorStats } from '../services/getSensorStats';

export const dataRoutes = new Hono();

const SensorDataParams = z.object({
  deviceId: z.string(),
});

const SensorDataQuery = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
  points: z.number().optional(),
});

const SensorDataResponse = z.array(
  z.object({
    deviceId: z.string(),
    timestamp: z.string(),
    temperature: z.number(),
    humidity: z.number(),
  }),
);

dataRoutes.get(
  '/data/:deviceId',
  zValidator('param', SensorDataParams),
  zValidator('query', SensorDataQuery),
  async c => {
    const { deviceId } = c.req.valid('param');
    const { startDate, endDate, points = 100 } = c.req.valid('query');

    const data = await getSensorData(deviceId, startDate, endDate, points);
    return c.json(SensorDataResponse.parse(data));
  },
);

const SensorStatsParams = z.object({
  deviceId: z.string(),
});

const SensorStatsQuery = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
  points: z.number().optional(),
});

const SensorStatsResponse = z.array(
  z.object({
    deviceId: z.string(),
    timestamp: z.string(),
    freeRam: z.number(),
    totalRam: z.number(),
  }),
);

dataRoutes.get(
  '/data/:deviceId/stats',
  zValidator('param', SensorStatsParams),
  zValidator('query', SensorStatsQuery),
  async c => {
    const { deviceId } = c.req.valid('param');
    const { startDate, endDate, points = 100 } = c.req.valid('query');

    const stats = await getSensorStats(deviceId, startDate, endDate, points);
    return c.json(SensorStatsResponse.parse(stats));
  },
);
