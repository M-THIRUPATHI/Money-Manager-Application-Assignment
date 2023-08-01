import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import AddTransactions from "../AddTransactions";
import Popup from "reactjs-popup";
import Cookies from "js-cookie";
import { AiOutlineClose } from "react-icons/ai";
import "./index.css";

const tabs = [
  { id: 1, tab: "All Transactions" },
  {
    id: 2,
    tab: "Credit",
  },
  {
    id: 3,
    tab: "Dedit",
  },
];

const Transactions = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [transactions, setTransactions] = useState([]);

  const userId = Cookies.get("jwt_token");

  useEffect(() => {
    const getTransactions = async () => {
      const apiUrl =
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions";

      const requestData = {
        limit: 15,
        offset: 0,
      };

      const queryParams = Object.keys(requestData)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(requestData[key])}`
        )
        .join("&");

      const options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "user",
          "x-hasura-user-id": `${userId}`,
        },
      };

      const urlWithQueryParams = `${apiUrl}?${queryParams}`;
      const fetchedData = await fetch(urlWithQueryParams, options);
      const response = await fetchedData.json();
      const transactionsData = response.transactions.map((eachLast) => ({
        id: eachLast.id,
        amount: eachLast.amount,
        type: eachLast.type,
        category: eachLast.category,
        date: eachLast.date,
        transactionName: eachLast.transaction_name,
        userId: eachLast.user_id,
      }));

      if (activeTab === 1) {
        setTransactions(transactionsData);
      } else if (activeTab === 2) {
        const filterData = transactionsData.filter(
          (eachData) => eachData.type === "credit"
        );
        setTransactions(filterData);
      } else {
        const filterData = transactionsData.filter(
          (eachData) => eachData.type === "debit"
        );
        setTransactions(filterData);
      }
    };
    getTransactions();
  }, [activeTab, userId]);

  return (
    <div className="dashboard-main-container">
      <Navbar />
      <div>
        <nav className="add-transactions-container">
          <h1 className="add-transactions-heading-accounts">Accounts</h1>
          <AddTransactions />
        </nav>
        <ul className="tabs-list">
          {tabs.map((eachTab) => (
            <ActiveTab
              key={eachTab.id}
              eachTab={eachTab}
              setActiveTab={setActiveTab}
              activeId={eachTab.id === activeTab}
            />
          ))}
        </ul>
        <ul className="last-transaction-list">
          {transactions.map((each) => (
            <TransactionsListDetails each={each} key={each.id} />
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Transactions;

export const ActiveTab = (props) => {
  const { eachTab, setActiveTab, activeId } = props;
  const activeClass = activeId ? "tabs-button-active" : "tabs-button";
  return (
    <li className="tabs-list-items">
      <button
        onClick={() => {
          setActiveTab(eachTab.id);
        }}
        className={activeClass}
      >
        {eachTab.tab}
      </button>
    </li>
  );
};

export const TransactionsListDetails = (props) => {
  const { each } = props;
  const { id, amount, type, category, date, transactionName } = each;
  const typeImg =
    type === "credit"
      ? "https://res.cloudinary.com/dzscdp79g/image/upload/v1690715198/Group_414_y9dyyn.png"
      : "https://res.cloudinary.com/dzscdp79g/image/upload/v1690715188/Group_73_qwp2td.png";
  const amountClass =
    type === "credit"
      ? "last-transaction-list-credit"
      : "last-transaction-list-debit";
  const amountType = type === "credit" ? `+$${amount}` : `-$${amount}`;
  const categoryType = category === "" ? "-" : category;

  const [name, setName] = useState("");
  const [updateType, setType] = useState("");
  const [updateCategory, setCategory] = useState("");
  const [updateAmount, setAmount] = useState("");
  const [updateDate, setDate] = useState("");

  const userId = Cookies.get("jwt_token");

  const UpdateTransactionForm = async (event) => {
    event.preventDefault();

    const UpdateTransactionDetails = {
      id: id,
      name: name,
      type: updateType,
      category: updateCategory,
      amount: updateAmount,
      date: updateDate,
    };

    setName("");
    setType("");
    setCategory("");
    setAmount("");
    setDate("");

    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/update-transaction";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
      body: JSON.stringify(UpdateTransactionDetails),
    };
    const fetchData = await fetch(url, options);

    if (fetchData.ok) {
      window.location.reload();
    }
  };

  const onClickDeleteTransaction = async () => {
    const deleteTransactionDetails = {
      id: id,
    };

    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
      body: JSON.stringify(deleteTransactionDetails),
    };
    const fetchData = await fetch(url, options);

    if (fetchData.ok) {
      window.location.reload();
    }
  };

  return (
    <li className="last-transaction-list-items">
      <img src={typeImg} alt="type" className="last-transaction-type-img" />
      {parseInt(userId) === 3 && (
        <img
          src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690817368/Ellipse_103_qvxiab.png"
          alt="user-profile"
        />
      )}
      <p className="last-transaction-name">{transactionName}</p>
      <p className="last-transaction-category">{categoryType}</p>
      <p className="last-transaction-date">{date.slice(0, 10)}</p>
      <p className={amountClass}>{amountType}</p>

      {parseInt(userId) === 3 ? (
        <button className="pencil-button-icon">
          <img
            src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690715207/Icon_2_rpphrf.png"
            alt="pencil"
            className="last-pencil-icon"
          />
        </button>
      ) : (
        <Popup
          modal
          trigger={
            <button className="pencil-button-icon">
              <img
                src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690715207/Icon_2_rpphrf.png"
                alt="pencil"
                className="last-pencil-icon"
              />
            </button>
          }
        >
          {(close) => (
            <div className="add-transactions-main-container">
              <div className="add-transactions-sub-container">
                <div className="add-transactions-heading-container">
                  <h1 className="add-transactions-main-heading">
                    Update Transaction
                  </h1>
                  <p className="add-transactions-description">
                    You can update your transaction here
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
              <form onSubmit={UpdateTransactionForm}>
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
                    value={updateType}
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
                    value={updateCategory}
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
                    value={updateAmount}
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
                    value={updateDate}
                    onChange={(event) => {
                      setDate(event.target.value);
                    }}
                  />
                </div>
                <button type="submit" className="add-transaction-inpu-button">
                  Update Transaction
                </button>
              </form>
            </div>
          )}
        </Popup>
      )}

      <div className="popup-container">
        {parseInt(userId) === 3 ? (
          <button type="button" className="nav-profile-button">
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690715215/Icon_1_ielx2b.png"
              alt="delete-icon"
              className="last-delete-icon"
            />
          </button>
        ) : (
          <Popup
            modal
            trigger={
              <button type="button" className="nav-profile-button">
                <img
                  src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690715215/Icon_1_ielx2b.png"
                  alt="delete-icon"
                  className="last-delete-icon"
                />
              </button>
            }
          >
            {(close) => (
              <div className="popup-logout-container">
                <img
                  src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690747398/Group_848_1_sjvqxq.png"
                  alt="delete-button"
                  className="popup-logout-log"
                />
                <div className="popup-logout-description-container">
                  <p className="popup-logout-description">
                    Are you sure you want to Delete?
                  </p>
                  <p className="popup-logout-content">
                    This transaction will be deleted immediately. You can’t undo
                    this action.
                  </p>
                  <button
                    className="popup-logout"
                    onClick={onClickDeleteTransaction}
                  >
                    Yes, Delete
                  </button>
                  <button className="popup-calcel" onClick={() => close()}>
                    No, Leave it
                  </button>
                </div>
                <button
                  type="button"
                  className="trigger-button"
                  onClick={() => close()}
                >
                  <AiOutlineClose className="popup-close-icon" />
                </button>
              </div>
            )}
          </Popup>
        )}
      </div>
    </li>
  );
};
