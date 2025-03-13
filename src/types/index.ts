export interface RawSensorData {
  /** Timestamp in milliseconds */
  timestamp: number;
  /** Humidity expressed in percentage */
  hum: number;
  /** Temperature expressed in °C */
  value: number;
  /** Available RAM in bytes */
  free_ram: number;
  /** Total RAM in bytes */
  total_ram: number;
  /** Sensor identifier */
  sensorCode: string;
}

