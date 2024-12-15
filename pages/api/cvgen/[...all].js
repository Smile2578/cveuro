// pages/api/cvgen/[...all].js

export default function handler(req, res) {
    console.log('Catch-all route hit. Method:', req.method, 'Path:', req.url);
    res.status(404).json({ error: 'Not Found' });
  }
  