import React, { useEffect, useState } from "react";
import { useWallet } from "../context/walletContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

import "./PaymentForm.css";

const VirtualAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [account, setAccount] = useState(null);

  const { fundWallet } = useWallet();

  useEffect(() => {
    const fund = async () => {
      setError("");
      setSuccess("");
      setLoading(true);

      const result = await fundWallet();

      if (result.success) {
        setSuccess("Virtual account generated successfully");
        setAccount(result.virtualAccounts?.[0] || null);
      } else {
        setError(result.message || "Failed to get virtual account.");
      }

      setLoading(false);
    };

    fund();
  }, [fundWallet]); // ✅ no warning, no loop

  return (
    <div className="funding-container">
      <SideBar />
      <div className="funding">
        <Header />
        <div className="wallet-container">
          <div className="wallet-header">
            <h1>Account</h1>
          </div>

          <div className="fund-wallet-card">
            {error && <div className="alert alert-error">{error}</div>}
            {loading && <div className="alert alert-info">Loading...</div>}

            {success && <div className="alert alert-success">{success}</div>}
            {account ? (
              <div className="account-info">
                <p>
                  Account Number: <strong>{account.accountNumber}</strong>
                </p>
                <p>
                  Bank: <strong>{account.bankName}</strong>
                </p>
                <p>
                  Account Name: <strong>{account.accountName}</strong>
                </p>
              </div>
            ) : (
              <p>No virtual account found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualAccount;
