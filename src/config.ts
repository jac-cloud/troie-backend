const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
};

export class CONFIG {
  static PORT: string = requireEnv('PORT');

  static SECRET_MASTER_NAME: string = requireEnv('SECRET_MASTER_NAME');
  static SECRET_MASTER_ENDPOINT: string = requireEnv('SECRET_MASTER_ENDPOINT');
  static HOST: string = requireEnv('HOST');
}
