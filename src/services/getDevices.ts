import { DB } from '../utils/db';

export async function getDevices() {
  const { prisma } = DB.getInstance();

  const devices = await prisma.device.findMany({
    orderBy: { device_id: 'asc' },
  });

  return devices.map(device => ({
    deviceId: device.device_id,
    deviceName: device.device_name,
  }));
}
