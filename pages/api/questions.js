import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { file } = req.query;
  if (!file) {
    return res.status(400).json({ error: 'File parameter is required' });
  }

  
  let jsonData;
  try {
    const { VercelKV, createClient } = require('@vercel/kv');
    require('dotenv').config();
    // Initialize Vercel KV with your namespace
    const kv = new createClient({ url: process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN });
    console.log(file)
    jsonData = await kv.get(file)
    console.log(jsonData)
    // if (!jsonData.trim()) {
    //   throw new Error('JSON data is empty');
    // }
    //const data = JSON.parse(jsonData);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse JSON data' });
  }
}