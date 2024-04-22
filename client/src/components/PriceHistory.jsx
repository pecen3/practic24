import React  from 'react';


const PriceHistory = ({ priceHistory, loading }) => {

  return (
    <div>
      <h4>История цен</h4>
      {loading ? (
        <p>Загружается...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Цена</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((priceRecord, index) => (
              <tr key={index}>
                <td>{new Date(priceRecord.timestamp).toLocaleString()}</td>
                <td>{priceRecord.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriceHistory;
