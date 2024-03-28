import fs from 'fs';
import path from 'path';

export const listQuestionFiles = () => {
  const directoryPath = path.join(process.cwd(), 'public', 'qa');
  console.log(directoryPath)
  const files = fs.readdirSync(directoryPath);
  console.log(files)
  // Filter JSON files
  return files.filter(file => file.endsWith('.json'));
};