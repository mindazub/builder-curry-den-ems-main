import express from 'express';
import cors from 'cors';

const router = express.Router();

// Enable CORS for plant API routes
router.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));

const API_BASE_URL = "http://185.69.53.225:5001";
const AUTH_TOKEN = "f9c2f80e1c0e5b6a3f7f40e6f2e9c9d0af7eaabc6b37a4d9728e26452b81fc13";
const OWNER_ID = "6a36660d-daae-48dd-a4fe-000b191b13d8";

// Proxy for plant list
router.get('/plant_list', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plant_list/${OWNER_ID}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching plant list:', error);
    res.status(500).json({ 
      error: 'Failed to fetch plant list',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Proxy for plant view
router.get('/plant_view/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ error: 'start and end parameters are required' });
    }
    
    const response = await fetch(`${API_BASE_URL}/plant_view/${plantId}?start=${start}&end=${end}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching plant view:', error);
    res.status(500).json({ 
      error: 'Failed to fetch plant view',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
