// generateCert.js
import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the current directory path in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the directory where the certificate and key will be saved
const keyDir = path.join(__dirname, 'keys');

// Attributes for the certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];

// Generate the certificates with a 1-year validity
const pems = selfsigned.generate(attrs, { days: 365 });

// Ensure the keys directory exists
if (!fs.existsSync(keyDir)) {
  fs.mkdirSync(keyDir, { recursive: true });
}

// Write the key and certificate files
fs.writeFileSync(path.join(keyDir, 'key.pem'), pems.private);
fs.writeFileSync(path.join(keyDir, 'cert.pem'), pems.cert);

console.log('SSL certificate and key generated successfully in BACKEND/keys/');