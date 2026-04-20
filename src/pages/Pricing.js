import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useWallet } from "../context/walletContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import UpgradeModal from "../components/UpgradeModal";
import ServiceTable from "../components/ServiceTable";
import VirtualAccountModal from "../components/VirtualAccountModal";

import "./Dashboard.css";

const Pricing = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showVirtualAccountModal, setShowVirtualAccountModal] = useState(false);

  // const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();

  const {
    // loading,
    balance,
    fundWallet,
    fetchDataPlans,
    dataPlans,

    upgradeToReseller,
    virtualAccounts,
    refreshWallet,
  } = useWallet();

  useEffect(() => {
    fetchDataPlans();
  }, [fetchDataPlans]);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);

    console.log("clicked to upgrade");
    // Prevent body scroll
    document.body.classList.add("modal-open");
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
    // Re-enable body scroll
    document.body.classList.remove("modal-open");
  };

  const handleConfirmUpgrade = async () => {
    try {
      const result = await upgradeToReseller();
      console.log(result);
      if (result.success) {
        // Show success message
        alert("Successfully upgraded to Reseller!");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert(error.message || "Upgrade failed. Please try again.");
    }
  };

  // Stop watching when modal closes
  const handleCloseVirtualModal = () => {
    setShowVirtualAccountModal(false);
  };

  const handleFundWallet = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await fundWallet();

    if (result.success) {
      setSuccess("Virtual account generated successfully");
      setShowVirtualAccountModal(true);
    } else {
      setError(result.message || "Failed to get virtual account.");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="main-content">
        <Header />
        <form className="fund-wallet-form" onSubmit={handleFundWallet}>
          <button type="submit" className="fund-wallet-btn" disabled={loading}>
            {loading ? "Processing..." : "Fund Wallet"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>

        <div className="content">
          {user.role === "user" && (
            <div className="hero-cta">
              <button className="cta-button" onClick={handleUpgradeClick}>
                <span className="button-content">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Click to upgrade to Reseller Now
                </span>
                {/* <span className="button-shine"></span> */}
                <p className="cta-subtext">
                  Only ₦1,000 one-time fee • Instant activation
                </p>
              </button>
              {/* <p className="cta-subtext">
                    Only ₦1,000 one-time fee • Instant activation
                  </p> */}
            </div>
          )}
          <div className="greeting-section">
            <div className="package-title">Data Plans & Pricing</div>

            {/* <button
              className="generate-vfb-btn"
              // onClick={handleGenerateVirtualAccount}
            >
              Generate Virtual Account
              <br />
              to fund your wallet
            </button> */}
          </div>

          <ServiceTable
            dataPlans={dataPlans}
            role={user.role}
            loading={loading}
          />
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpgrade}
        walletBalance={balance}
        upgradeFee={1000}
      />

      {showVirtualAccountModal && (
        <VirtualAccountModal
          accounts={virtualAccounts}
          onClose={handleCloseVirtualModal} // ✅ stops interval on close
          onBalanceRefresh={refreshWallet} // ✅ modal polls internally too
          currentBalance={balance} // ✅ modal detects balance change
        />
      )}
    </div>
  );
};

export default Pricing;
