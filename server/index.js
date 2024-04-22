require('dotenv').config()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const express = require('express')
const {scrapeWebsite} = require('./parser')
const cron = require('node-cron');
const {pool} = require('./database');
const { updatePrice } = require('./updatePrice');
const PORT = 5004

const app = express()

app.use(express.json())
app.use(cors())

// setupCronJobs();



app.post('/add', async (req, res) => {
  try {
    const { url } = req.body;
    const { url: parsedUrl, title, price } = await scrapeWebsite(url);
    const queryText = 'INSERT INTO competitor_products(id, url, title, price, updated_at) VALUES($1, $2, $3, $4, $5)';
    const id = uuidv4(); 
    const updatedAt = new Date();
    const values = [id, parsedUrl, title, price, updatedAt];

    await pool.query(queryText, values);

    res.json({ message: 'ok' });
  } catch (error) {
    console.error('Ошибка в добавлении продукта', error);
    res.status(500).json({ error: 'Ошибка' });
  }
});

app.get('/all', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM competitor_products';
    const { rows } = await pool.query(queryText);

    res.json(rows);
  } catch (error) {
    console.error('Ошибка', error);
    res.status(500).json({ error: 'Ошибка запроса' });
  }
});

app.get('/pricehistory/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT json_agg(json_build_object(\'timestamp\', timestamp, \'price\', price))
                                         AS price_history FROM price_history WHERE product_id = $1`, [productId]);
    client.release();
    
    const priceHistory = result.rows[0].price_history || [];
    res.json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Error fetching price history' });
  }
});



const start = async () => {
  try {

    app.listen(PORT, () => console.log(PORT))

  } catch (error) {
    console.log(error)
  }
}

cron.schedule('59 59 23 * * *', async () => {
  await updatePrice()
}, {
  scheduled: true,
  timezone: "Europe/Moscow" 
});




start()











// async function fetchUsers() {
//   const { rows } = await pool.query("SELECT * FROM main.price_rules");
//   console.log(rows);
// }

// fetchUsers().catch(err => console.log(err));
