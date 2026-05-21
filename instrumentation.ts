import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('yomu-frontend');
}