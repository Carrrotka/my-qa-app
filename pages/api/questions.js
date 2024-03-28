import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;
  if (!file) {
    return res.status(400).json({ error: 'File parameter is required' });
  }

  const filePath = path.resolve('.', 'public', 'qa', file);
  let jsonData;
  try {
    jsonData = fs.readFileSync(filePath, 'utf8');
    if (!jsonData.trim()) {
      throw new Error('JSON data is empty');
    }
    const data = JSON.parse(jsonData);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse JSON data' });
  }
}