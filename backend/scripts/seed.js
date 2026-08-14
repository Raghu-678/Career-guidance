import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Career from '../models/Career.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function seedCareers() {
  const count = await Career.countDocuments();
  if (count > 0) {
    console.log(`Careers already seeded (${count} records)`);
    return;
  }

  const careersPath = path.join(__dirname, '../../seed/careers.json');
  const careers = JSON.parse(fs.readFileSync(careersPath, 'utf-8'));
  await Career.insertMany(careers);
  console.log(`Seeded ${careers.length} careers`);
}
