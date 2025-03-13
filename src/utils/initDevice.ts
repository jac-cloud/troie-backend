import { CONFIG } from '../config';
import * as awsIot from 'aws-iot-device-sdk';
import * as AWS from 'aws-sdk';

import * as os from 'os';
import { RawSensorData } from '../types';
import { RawSensorDataSchema } from '../schemas';
import { DB } from './db';

AWS.config.update({ region: 'eu-west-1' });

const iot = new AWS.Iot();

let device: awsIot.device;

export function initDevice() {
  device = new awsIot.device({
    keyPath: `${os.tmpdir()}/${CONFIG.SECRET_MASTER_NAME}.private.pem.key`,
    certPath: `${os.tmpdir()}/${CONFIG.SECRET_MASTER_NAME}.certificate.pem.crt`,
    caPath: `${os.tmpdir()}/AmazonRootCA1.pem`,
    host: CONFIG.HOST,
  });

  device.on('connect', function () {
    console.info('system connected to aws iot...');
    device.subscribe('machines');
    console.info('mqtt parser ready...');
  });

  device.on('error', function (e) {
    console.info({ e });
  });

  device.on('message', async function (topic, payload) {
    console.info('message received');
    await parser(payload.toString());
  });
}

async function parser(message: string) {
  let objectMessage;
  try {
    objectMessage = JSON.parse(message);
  } catch (err) {
    console.error(`error parsing message: ${message}`);
  }

  const { data, success: isSensorData } = RawSensorDataSchema.safeParse(objectMessage);

  if (isSensorData && data !== undefined) {
    const { prisma } = DB.getInstance();

    const device = await prisma.device.findUnique({
      where: {
        device_id: data.sensorCode,
      },
    });

    if (!device) {
      await prisma.device.create({
        data: {
          device_id: data.sensorCode,
        },
      });
    }

    await prisma.sensorData.create({
      data: {
        free_ram: data.free_ram,
        humidity: data.hum,
        temperature: data.value,
        device_id: data.sensorCode,
        timestamp: new Date(data.timestamp),
        total_ram: data.total_ram,
      },
    });

    console.log(data);
  }
}
