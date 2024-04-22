const { scrapeWebsite } = require("./parser");

async function insertPriceToHistory() {
  try {
    const client = await pool.connect();


    const currentDate = new Date();
    const currentTimestamp = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);


    const query = `
      INSERT INTO price_history (product_id, timestamp, price)
      SELECT id, $1, price
      FROM competitor_products
    `;
    const values = [currentTimestamp];


    await client.query(query, values);

    console.log('Prices inserted into price_history successfully.');


    client.release();
    return true
  } catch (error) {
    console.error('Error inserting prices into price_history:', error);
  } finally {
  
    await pool.end();
  }
}



async function updateProductPrices() {
  try {
    const client = await pool.connect();


    const productsQuery = 'SELECT * FROM competitor_products';
    const { rows: products } = await client.query(productsQuery);

   
    for (const product of products) {
      const { id, url } = product;
      const { title, price } = await scrapeWebsite(url);

   
      const updateQuery = `
        UPDATE competitor_products
        SET title = $1, price = $2, updated_at = current_timestamp
        WHERE id = $3
      `;
      const updateValues = [title, price, id];
      await client.query(updateQuery, updateValues);

      console.log(`Price updated for product with id ${id}`);
    }

   
    client.release();
  } catch (error) {
    console.error('Error updating product prices:', error);
  } finally {
   
    await pool.end();
  }
}

async function updatePrice() {
 const insertPreviousPrice = await insertPriceToHistory()
 if (insertPreviousPrice) {
    await updateProductPrices()
 }
}
module.exports = {updatePrice}





