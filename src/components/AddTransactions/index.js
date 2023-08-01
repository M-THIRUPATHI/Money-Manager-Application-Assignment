import { useState } from "react";
import Popup from "reactjs-popup";
import { AiOutlineClose } from "react-icons/ai";
import Cookies from "js-cookie";
import "./index.css";

const AddTransactions = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const userId = Cookies.get("jwt_token");

  const AddTransactionForm = async (event) => {
    event.preventDefault();

    const AddTransactionDetails = {
      name: name,
      type: type,
      category: category,
      amount: amount,
      date: date,
      user_id: userId,
    };

    setName("");
    setType("");
    setCategory("");
    setAmount("");
    setDate("");

    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/add-transaction";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
      body: JSON.stringify(AddTransactionDetails),
    };
    const fetchData = await fetch(url, options);

    if (fetchData.ok) {
      window.location.reload();
    }
  };

  return parseInt(userId) === 3 ? (
    <button className="add-transaction-button">
      <img
        src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690664517/plus_1_mvwmw5.png"
        alt="plus-log"
        className="add-transaction-plus-log"
      />
      <span className="add-transaction-text">Add Transaction</span>
    </button>
  ) : (
    <Popup
      modal
      trigger={
        <button className="add-transaction-button">
          <img
            src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690664517/plus_1_mvwmw5.png"
            alt="plus-log"
            className="add-transaction-plus-log"
          />
          <span className="add-transaction-text">Add Transaction</span>
        </button>
      }
    >
      {(close) => (
        <div className="add-transactions-main-container">
          <div className="add-transactions-sub-container">
            <div className="add-transactions-heading-container">
              <h1 className="add-transactions-main-heading">
                Add Transactions
              </h1>
              <p className="add-transactions-description">
                Lorem ipsum dolor sit amet, consectetur
              </p>
            </div>
            <button
              type="button"
              className="trigger-button-add-transaction"
              onClick={() => close()}
            >
              <AiOutlineClose />
            </button>
          </div>
          <form onSubmit={AddTransactionForm}>
            <div className="add-transactions-input-container">
              <label htmlFor="name" className="add-transactions-label">
                Transaction Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                className="add-transactions-input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>

            <div className="add-transactions-input-container">
              <label htmlFor="type" className="add-transactions-label">
                Transaction Type
              </label>
              <input
                id="type"
                type="text"
                placeholder="Select Transaction Type"
                className="add-transactions-input"
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                }}
              />
            </div>

            <div className="add-transactions-input-container">
              <label htmlFor="category" className="add-transactions-label">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Select"
                className="add-transactions-input"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              />
            </div>

            <div className="add-transactions-input-container">
              <label htmlFor="number" className="add-transactions-label">
                Amount
              </label>
              <input
                id="number"
                type="number"
                placeholder="Enter Amount"
                className="add-transactions-input"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              />
            </div>

            <div className="add-transactions-input-container">
              <label htmlFor="date" className="add-transactions-label">
                Date
              </label>
              <input
                id="date"
                type="text"
                placeholder="Date"
                className="add-transactions-input"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                }}
              />
            </div>
            <button type="submit" className="add-transaction-inpu-button">
              Add Transaction
            </button>
          </form>
        </div>
      )}
    </Popup>
  );
};
export default AddTransactions;
