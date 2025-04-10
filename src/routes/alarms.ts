import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { createAlarm } from '../services/createAlarm';
import { deleteAlarm } from '../services/deleteAlarm';
import { getAlarms } from '../services/getAlarms';

export const alarmRoutes = new Hono();

const GetDeviceAlarmsParams = z.object({
  deviceId: z.string(),
});

const GetDeviceAlarmsResponse = z.array(
  z.object({
    id: z.string(),
    deviceId: z.string(),
    threshold: z.number(),
    operator: z.enum(['<', '<=', '>', '>=', '==', '!=']),
  }),
);

alarmRoutes.get('/alarms/:deviceId', zValidator('param', GetDeviceAlarmsParams), async c => {
  const { deviceId } = c.req.valid('param');

  const data = await getAlarms(deviceId);
  return c.json(GetDeviceAlarmsResponse.parse(data));
});

const CreateDeviceAlarmParams = z.object({
  deviceId: z.string(),
});

const CreateDeviceAlarmBody = z.object({
  threshold: z.number(),
  operator: z.enum(['<', '<=', '>', '>=', '==', '!=']),
});

const CreateDeviceAlarmResponse = z.object({
  id: z.string(),
  deviceId: z.string(),
  threshold: z.number(),
  operator: z.enum(['<', '<=', '>', '>=', '==', '!=']),
});

alarmRoutes.post(
  '/alarms/:deviceId',
  zValidator('param', CreateDeviceAlarmParams),
  zValidator('json', CreateDeviceAlarmBody),
  async c => {
    const { deviceId } = c.req.valid('param');
    const { threshold, operator } = c.req.valid('json');

    const data = await createAlarm(deviceId, threshold, operator);
    return c.json(CreateDeviceAlarmResponse.parse(data), 201);
  },
);

const DeleteDeviceAlarmParams = z.object({
  deviceId: z.string(),
  alarmId: z.string(),
});

const DeleteDeviceAlarmResponse = z.object({
  message: z.string(),
});

alarmRoutes.delete('/alarms/:deviceId/:alarmId', zValidator('param', DeleteDeviceAlarmParams), async c => {
  const { deviceId, alarmId } = c.req.valid('param');

  await deleteAlarm(deviceId, alarmId);

  return c.json(DeleteDeviceAlarmResponse.parse({ message: 'Alarm deleted successfully' }), 200);
});
