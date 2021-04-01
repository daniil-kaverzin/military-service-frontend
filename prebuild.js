const { config } = require('dotenv');

const configFile = '.env';

const requiredEnvVars = ['REACT_APP_API', 'REACT_APP_SENTRY'];

// Parse env file
const { parsed } = config({ path: configFile });

if (!parsed) {
  console.log('Environment variables validation failed. Unable to find env file: ' + configFile);
  return process.exit(1);
}

// Get missing environment variables
const missing = requiredEnvVars.filter((v) => {
  return !(v in parsed);
});

// In case, we have missing variables, exit from process with non-zero code
if (missing.length > 0) {
  console.log(`Environment variables validation failed. Missing: ${missing.join(', ')}`);
  return process.exit(1);
}

console.log('Envrionment variables are fine! Variables: ', parsed);
process.exit(0);
