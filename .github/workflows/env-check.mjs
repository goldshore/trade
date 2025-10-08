import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredKeys = [
  'CF_API_TOKEN',
  'CF_ACCOUNT_ID',
  'ALPACA_API_KEY_ID',
  'ALPACA_API_SECRET_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
];

const templatePath = path.resolve(process.cwd(), '.env.template');
let templateContent = '';
if (fs.existsSync(templatePath)) {
  templateContent = fs.readFileSync(templatePath, 'utf8');
}

const missing = requiredKeys.filter((key) => {
  const value = process.env[key];
  if (value && value.trim() !== '') {
    return false;
  }
  if (process.env.CI === 'true') {
    return !new RegExp(`^${key}=`, 'm').test(templateContent);
  }
  return true;
});

if (missing.length) {
  console.error('❌ Missing env vars:', missing.join(', '));
  if (process.env.CI === 'true') {
    console.error('Ensure the keys exist in secrets or at least in .env.template');
  }
  process.exit(1);
}

if (process.env.CI === 'true') {
  console.log('✅ Required environment keys are documented in .env.template.');
} else {
  console.log('✅ All critical env vars present locally.');
}
