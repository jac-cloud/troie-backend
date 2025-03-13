import { z } from "zod";

export const RawSensorDataSchema = z.object({
  timestamp: z.number(),
  hum: z.number(),
  value: z.number(),
  free_ram: z.number(),
  total_ram: z.number(),
  sensorCode: z.string(),
});