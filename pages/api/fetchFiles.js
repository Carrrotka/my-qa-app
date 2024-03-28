// pages/api/fetchFiles.js

export default async function handler(req, res) {
    const { VercelKV, createClient } = require('@vercel/kv');
    require('dotenv').config();
    // Initialize Vercel KV with your namespace
    const kv = new createClient({ url: process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN });
  
    try {
      let fileList = []
      for await (const key of kv.scanIterator()) {
        console.log(key);
        fileList.push(key)
      }
      console.log(fileList)
      if (!fileList) {
        console.log("WHAAAAT")
        return res.status(404).json({ error: 'Files not found' });
      }
      res.status(200).json(fileList);
    } catch (error) {
      console.error('Failed to fetch files from Vercel KV:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }