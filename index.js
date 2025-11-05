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

app.get('/hotel', async (req, res) => {
  try {
    const hotels = await db.Hotel.findAll();
    res.status(200).json(hotels);
  } catch (error) {
    console.error('GET /hotel error:', error);
    res.status(500).json({ error: 'Gagal mengambil data hotel' });
  }
});

app.put('/hotel/:id', async (req, res) => {
  const hotelId = req.params.id;
  const { tipe_kamar, kapasitas, lantai, fasilitas } = req.body;

  try {
    const hotel = await db.Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ error: 'Kamar tidak ditemukan' });

    await hotel.update({ tipe_kamar, kapasitas, lantai, fasilitas });
    res.status(200).json(hotel);
  } catch (error) {
    console.error(`PUT /hotel/${hotelId} error:`, error);
    res.status(500).json({ error: 'Gagal memperbarui data kamar' });
  }
});

app.delete('/hotel/:id', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const hotel = await db.Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ error: 'Kamar tidak ditemukan' });

    await hotel.destroy();
    res.status(200).json({ message: 'Kamar berhasil dihapus' });
  } catch (error) {
    console.error(`DELETE /hotel/${hotelId} error:`, error);
    res.status(500).json({ error: 'Gagal menghapus data kamar' });
  }
});