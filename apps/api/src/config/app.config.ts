import { registerAs } from '@nestjs/config';

export const APP_CONFIG_NAMESPACE = 'app';

const DEFAULT_PORT = 3000;
const DEFAULT_CORS_ORIGIN = 'http://localhost:5173';

export type AppConfig = {
  port: number;
  corsOrigin: string;
};

export default registerAs(APP_CONFIG_NAMESPACE, (): AppConfig => ({
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  corsOrigin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN,
}));
