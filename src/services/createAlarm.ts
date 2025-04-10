import { HTTPException } from 'hono/http-exception';
import { DB } from '../utils/db';

export async function createAlarm(deviceId: string, threshold: number, operator: string) {
  const { prisma } = DB.getInstance();

  const device = await prisma.device.findUnique({
    where: { device_id: deviceId },
  });

  if (!device) {
    throw new HTTPException(404, { message: 'Device not found' });
  }

  const alarm = await prisma.alarm.create({
    data: {
      device_id: deviceId,
      threshold,
      operator,
    },
  });

  return {
    id: alarm.id,
    deviceId: alarm.device_id,
    threshold: alarm.threshold,
    operator: alarm.operator,
  };
}
