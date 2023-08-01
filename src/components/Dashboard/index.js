import Navbar from "../Navbar";
import AddTransactions from "../AddTransactions";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./index.css";

const Dashboard = () => {
  const userId = Cookies.get("jwt_token");

  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    const getAllTransactions = async () => {
      const apiUrl =
        parseInt(userId) === 3
          ? "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin"
          : "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals";
      const options =
        parseInt(userId) === 3
          ? {
              method: "GET",
              headers: {
                "content-type": "application/json",
                "x-hasura-admin-secret":
                  "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
                "x-hasura-role": "admin",
              },
            }
          : {
              method: "GET",
              headers: {
                "content-type": "application/json",
                "x-hasura-admin-secret":
                  "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
                "x-hasura-role": "user",
                "x-hasura-user-id": `${userId}`,
              },
            };

      const fetchedData = await fetch(apiUrl, options);
      const response = await fetchedData.json();
      const transactionsData =
        parseInt(userId) === 3
          ? response.transaction_totals_admin.map((eachLast) => ({
              sum: eachLast.sum,
              type: eachLast.type,
            }))
          : response.totals_credit_debit_transactions.map((eachLast) => ({
              sum: eachLast.sum,
              type: eachLast.type,
            }));
      setAllTransactions(transactionsData);
    };
    getAllTransactions();
  }, [userId]);

  let credit = 0;
  let debit = 0;
  for (let eachTransaction of allTransactions) {
    if (eachTransaction.type === "credit") {
      credit += parseInt(eachTransaction.sum);
    } else {
      debit += parseInt(eachTransaction.sum);
    }
  }

  return (
    <div className="dashboard-main-container">
      <Navbar />
      <div>
        <nav className="add-transactions-container">
          <h1 className="add-transactions-heading-accounts">Accounts</h1>
          <AddTransactions />
        </nav>
        <div className="credit-debit-container">
          <div className="credit-container">
            <div>
              <h1 className="credit-amount">{`$${credit}`}</h1>
              <h1 className="credit-heading">Credit</h1>
            </div>
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690665674/Group_2_usd9ne.png"
              alt="credit-img"
              className="credit-img"
            />
          </div>
          <div className="debit-container">
            <div>
              <h1 className="debit-amount">{`$${debit}`}</h1>
              <h1 className="debit-heading">Debit</h1>
            </div>
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690665712/Group_3_ak1fs5.png"
              alt="debit-img"
              className="debit-img"
            />
          </div>
        </div>
        <h1 className="last-transaction-heading">Last Transactions</h1>
        <div>
          <LastTransactions />
        </div>
        <h1 className="Debit-Credit-Overview">Debit & Credit Overview</h1>
        <div>
          <DebitCreditOverview />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

const LastTransactions = () => {
  const [lastTransactions, setLastTransactions] = useState([]);

  const userId = Cookies.get("jwt_token");

  useEffect(() => {
    const getLastTransactions = async () => {
      const apiUrl =
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions";

      const requestData = {
        limit: 3,
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
      const lastTransactionsData = response.transactions.map((eachLast) => ({
        id: eachLast.id,
        amount: eachLast.amount,
        type: eachLast.type,
        category: eachLast.category,
        date: eachLast.date,
        transactionName: eachLast.transaction_name,
        userId: eachLast.user_id,
      }));

      setLastTransactions(lastTransactionsData);
    };
    getLastTransactions();
  }, [userId]);

  return (
    <ul className="last-transaction-list">
      {lastTransactions.map((each) => (
        <LastTransactionsResult each={each} key={each.id} />
      ))}
    </ul>
  );
};

const LastTransactionsResult = (props) => {
  const { each } = props;
  const { amount, type, category, date, transactionName } = each;
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

  const userId = Cookies.get("jwt_token");

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
      <img
        src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690715207/Icon_2_rpphrf.png"
        alt="pencil"
        className="last-pencil-icon"
      />
      <img
        src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690715215/Icon_1_ielx2b.png"
        alt="delete-icon"
        className="last-delete-icon"
      />
    </li>
  );
};

const DebitCreditOverview = () => {
  const [debitCreditOverview, setdebitCreditOverview] = useState([]);

  const userId = Cookies.get("jwt_token");

  useEffect(() => {
    const getDebitCreditOverview = async () => {
      const apiUrl =
        parseInt(userId) === 3
          ? "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin"
          : "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days";

      const options =
        parseInt(userId) === 3
          ? {
              method: "GET",
              headers: {
                "content-type": "application/json",
                "x-hasura-admin-secret":
                  "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
                "x-hasura-role": "admin",
              },
            }
          : {
              method: "GET",
              headers: {
                "content-type": "application/json",
                "x-hasura-admin-secret":
                  "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
                "x-hasura-role": "user",
                "x-hasura-user-id": `${userId}`,
              },
            };

      const fetchedData = await fetch(apiUrl, options);
      const response = await fetchedData.json();
      const responseData =
        parseInt(userId) === 3
          ? response.last_7_days_transactions_totals_admin.map((eachDay) => ({
              sum: eachDay.sum,
              type: eachDay.type,
              date: eachDay.date.slice(0, 10),
            }))
          : response.last_7_days_transactions_credit_debit_totals.map(
              (eachDay) => ({
                sum: eachDay.sum,
                type: eachDay.type,
                date: eachDay.date.slice(0, 10),
              })
            );
      setdebitCreditOverview(responseData);
    };
    getDebitCreditOverview();
  }, [userId]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={debitCreditOverview}
        margin={{ top: 50, right: 40, left: 30, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sum" fill="#FCAA0B" />
      </BarChart>
    </ResponsiveContainer>
  );
};
