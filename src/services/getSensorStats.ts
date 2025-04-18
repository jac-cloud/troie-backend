import { HTTPException } from 'hono/http-exception';
import { DB } from '../utils/db';

export async function getSensorStats(deviceId: string, startDate: string, endDate: string, points = 100) {
  const { prisma } = DB.getInstance();

  const device = await prisma.device.findUnique({
    where: { device_id: deviceId },
  });

  if (!device) {
    throw new HTTPException(404, { message: 'Device not found' });
  }

  const sensorData = await prisma.sensorData.findMany({
    where: {
      device_id: deviceId,
      timestamp: {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59.999Z'),
      },
    },
    orderBy: { timestamp: 'asc' },
  });

  if (sensorData.length <= points) {
    return sensorData.map(d => ({
      deviceId: d.device_id,
      timestamp: d.timestamp.toISOString(),
      freeRam: d.free_ram,
      totalRam: d.total_ram,
    }));
  }

  const interval = Math.floor(sensorData.length / points);
  const reducedData = sensorData.filter((_, i) => i % interval === 0);

  if (reducedData.length > 1) {
    reducedData[0] = sensorData[0];
    reducedData[reducedData.length - 1] = sensorData[sensorData.length - 1];
  }

  return reducedData.map(d => ({
    deviceId: d.device_id,
    timestamp: d.timestamp.toISOString(),
    freeRam: d.free_ram,
    totalRam: d.total_ram,
  }));
}
