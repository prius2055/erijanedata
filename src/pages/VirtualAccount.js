import React, { useEffect, useState } from "react";
import { useWallet } from "../context/walletContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import "./VirtualAccount.css";

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
        setSuccess("Account generated successfully");
        setAccount(result.virtualAccounts?.[0] || null);
      } else {
        setError(result.message || "Failed to get virtual account.");
      }

      setLoading(false);
    };

    fund();
  }, [fundWallet]); // ✅ no warning, no loop

  if (loading) {
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
              <div className="alert alert-info">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {success && <div className="alert alert-success">{success}</div>}
            {account ? (
              <div className="account-info">
                <p>
                  Account Number:
                  <span>
                    <strong>{account.accountNumber}</strong>
                  </span>
                </p>
                <p>
                  Account Name:
                  <span>
                    <strong>{account.accountName}</strong>
                  </span>
                </p>
                <p>
                  Bank:
                  <span>
                    <strong>{account.bankName}</strong>
                  </span>
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
