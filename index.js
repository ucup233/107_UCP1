const express = require('express');
const app = express();
const port = process.env.PORT || 5200;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/hotel', async (req, res) => {
  const { tipe_kamar, kapasitas, lantai, fasilitas } = req.body;
  
  if (!tipe_kamar || !kapasitas || !lantai || !fasilitas) {
    return res.status(400).json({ error: 'Fields tipe_kamar, kapasitas, lantai, fasilitas wajib diisi' });
  }

  try {
    const hotel = await db.Hotel.create({ tipe_kamar, kapasitas, lantai, fasilitas });
    res.status(201).json(hotel);
  } catch (error) {
    console.error('POST /hotel error:', error);
    res.status(500).json({ error: 'Gagal menambahkan kamar', details: error.message });
  }
});