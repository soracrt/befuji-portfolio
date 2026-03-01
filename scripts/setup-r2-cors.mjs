/**
 * Run once to set CORS policy on the R2 bucket so the admin upload
 * (browser → presigned PUT) is allowed from https://befuji.com
 *
 *   node scripts/setup-r2-cors.mjs
 */

import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, '../.env.local')
const envLines = readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
  const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
  if (match) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

await s3.send(
  new PutBucketCorsCommand({
    Bucket: process.env.R2_BUCKET_NAME ?? '',
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ['https://befuji.com', 'http://localhost:3000'],
          AllowedMethods: ['PUT'],
          AllowedHeaders: ['Content-Type'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  })
)

console.log('CORS policy set successfully.')
