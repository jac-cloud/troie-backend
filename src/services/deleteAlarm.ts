import { HTTPException } from 'hono/http-exception';
import { DB } from '../utils/db';

export async function deleteAlarm(deviceId: string, alertId: string) {
  const { prisma } = DB.getInstance();

  const device = await prisma.device.findUnique({
    where: { device_id: deviceId },
  });

  if (!device) {
    throw new HTTPException(404, { message: 'Device not found' });
  }

  const alarm = await prisma.alarm.findUnique({
    where: { id: alertId },
  });

  if (!alarm) {
    throw new HTTPException(404, { message: 'Alert not found' });
  }

  if (alarm.device_id !== deviceId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  await prisma.alarm.delete({
    where: { id: alertId },
  });

  return { message: 'Alert deleted successfully' };
}
