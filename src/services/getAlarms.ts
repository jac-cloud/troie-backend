import { HTTPException } from "hono/http-exception";
import { DB } from "../utils/db";

export async function getAlarms(deviceId: string) {
  const { prisma } = DB.getInstance();

  const device = await prisma.device.findUnique({
    where: { device_id: deviceId },
  });

  if (!device) {
    throw new HTTPException(404, { message: 'Device not found' });
  }

  const alarms = await prisma.alarm.findMany({
    where: { device_id: deviceId },
  });

  return alarms.map(alert => ({
    id: alert.id,
    deviceId: alert.device_id,
    threshold: alert.threshold,
    operator: alert.operator,
  }));
}