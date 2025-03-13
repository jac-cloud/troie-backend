import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { DB } from '../utils/db';
import { HTTPException } from 'hono/http-exception';

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
  })
);

dataRoutes.get(
  '/data/:deviceId',
  zValidator('param', SensorDataParams),
  zValidator('query', SensorDataQuery),
  async c => {
    const { deviceId } = c.req.valid('param');
    const { startDate, endDate, points = 100 } = c.req.valid('query');

    const { prisma } = DB.getInstance();

    const device = await prisma.device.findUnique({
      where: {
        device_id: deviceId,
      },
    });

    if (!device) {
      throw new HTTPException(404, { message: 'Device not found' });
    }

    const sensorData = await prisma.sensorData.findMany({
      where: {
        device_id: deviceId,
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      take: points,
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (sensorData.length <= points) {
      return c.json(
        SensorDataResponse.parse(
          sensorData.map(d => ({
            deviceId: d.device_id,
            timestamp: d.timestamp.toISOString(),
            temperature: d.temperature,
            humidity: d.humidity,
          }))
        )
      );
    }

    const interval = Math.floor(sensorData.length / points);
    const reducedData = sensorData.filter((_, i) => i % interval === 0);

    return c.json(
      SensorDataResponse.parse(
        reducedData.map(d => ({
          deviceId: d.device_id,
          timestamp: d.timestamp.toISOString(),
          temperature: d.temperature,
          humidity: d.humidity,
        }))
      )
    );
  }
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
  })
);

dataRoutes.get(
  '/data/:deviceId/stats',
  zValidator('param', SensorStatsParams),
  zValidator('query', SensorStatsQuery),
  async c => {
    const { deviceId } = c.req.valid('param');
    const { startDate, endDate, points = 100 } = c.req.valid('query');

    const { prisma } = DB.getInstance();

    const device = await prisma.device.findUnique({
      where: {
        device_id: deviceId,
      },
    });

    if (!device) {
      throw new HTTPException(404, { message: 'Device not found' });
    }

    const sensorData = await prisma.sensorData.findMany({
      where: {
        device_id: deviceId,
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      take: points,
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (sensorData.length <= points) {
      return c.json(
        SensorStatsResponse.parse(
          sensorData.map(d => ({
            deviceId: d.device_id,
            timestamp: d.timestamp.toISOString(),
            freeRam: d.free_ram,
            totalRam: d.total_ram,
          }))
        )
      );
    }

    const interval = Math.floor(sensorData.length / points);
    const reducedData = sensorData.filter((_, i) => i % interval === 0);

    return c.json(
      SensorStatsResponse.parse(
        reducedData.map(d => ({
          deviceId: d.device_id,
          timestamp: d.timestamp.toISOString(),
          freeRam: d.free_ram,
          totalRam: d.total_ram,
        }))
      )
    );
  }
);
