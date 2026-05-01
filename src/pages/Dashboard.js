import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useWallet } from "../context/walletContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import UpgradeModal from "../components/UpgradeModal";
// import ServiceTable from "../components/ServiceTable";
import VirtualAccountModal from "../components/VirtualAccountModal";
import DataTypeTicker from "../components/DataTypeTicker";

import "./Dashboard.css";

const Dashboard = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showVirtualAccountModal, setShowVirtualAccountModal] = useState(false);
  const [account, setAccount] = useState(false);

  // const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState({
    onloadSuccess: "",
    onbtnSuccess: "",
  });

  const { user } = useAuth();

  const {
    // loading,
    balance,
    fundWallet,
    fetchDataPlans,
    dataPlans,
    totalFunded,
    totalSpent,
    upgradeToReseller,
    virtualAccounts,
    refreshWallet,
  } = useWallet();

  const navigate = useNavigate();

  const { referralEarnings, referralsCount } = user;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  useEffect(() => {
    fetchDataPlans();
  }, [fetchDataPlans]);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);

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

      if (result.success) {
        // Show success message
        alert("Successfully upgraded to Reseller!");
        handleCloseModal();
      }
    } catch (error) {
      alert(error.message || "Upgrade failed. Please try again.");
    }
  };

  const serviceCards = [
    { icon: "📱", title: "Data card Printing", color: "#f59e42" },
    {
      icon: "💳",
      title: "Airtime TopUp",
      color: "#3b9fd8",
      page: () => {
        navigate("/buy-airtime");
      },
    },
    {
      icon: "📶",
      title: "Buy Data",
      color: "#6ca843",
      page: () => {
        navigate("/buy-data");
      },
    },
    { icon: "💰", title: "Airtime to cash", color: "#2d6f3f" },
    {
      icon: "💡",
      title: "Electricity Bills",
      color: "#f59e42",
      page: () => {
        navigate("/utilities/recharge-meter");
      },
    },
    {
      icon: "📺",
      title: "Cable Subscription",
      color: "#5c7cfa",
      page: () => {
        navigate("/utilities/recharge-cable");
      },
    },
    { icon: "💳", title: "Bonus to wallet", color: "#3b9fd8" },
    { icon: "📚", title: "Result Checker", color: "#2d5f8f" },
    { icon: "🎫", title: "Recharge card Printing", color: "#888" },
    { icon: "👥", title: "My Referrals", color: "#6c5ce7" },
  ];

  const balanceCards = [
    {
      icon: "💰",
      title: "Total Funded",
      amount: `${totalFunded !== null ? formatCurrency(totalFunded) : "Loading..."}`,
      color: "#3b9fd8",
    },
    {
      icon: "💰",
      title: "Total Spent",
      amount: `${totalSpent !== null ? formatCurrency(totalSpent) : "Loading..."}`,
      color: "#3b9fd8",
    },

    {
      icon: "💰",
      title: "Referral Bonus",
      amount: `${formatCurrency(referralEarnings)}`,
      color: "#3b9fd8",
    },
    {
      icon: "💳",
      title: "Wallet Balance",
      amount: `${balance !== null ? formatCurrency(balance) : "Loading..."}`,
      color: "#3b9fd8",
    },
    {
      icon: "👥",
      title: "My Total Referral",
      amount: `${referralsCount}`,
      color: "#6c5ce7",
    },
  ];

  const quickActions = [
    { icon: "🔄", title: "get VFB Account", color: "#6c5ce7" },
    {
      icon: "📋",
      title: "Transactions",
      color: "#6c5ce7",
      page: () => {
        navigate("/transactions");
      },
    },
    // { icon: "📱", title: "Data Transactions", color: "#6c5ce7" },
    // { icon: "📶", title: "Airtime Transactions", color: "#6c5ce7" },
    { icon: "💳", title: "Wallet summary", color: "#f59e42" },
    {
      icon: "⬆️",
      title: "Upgrade to Reseller ₦1000",
      color: "#e74c3c",
      page: handleUpgradeClick,
    },
  ];

  // Stop watching when modal closes
  const handleCloseVirtualModal = () => {
    setShowVirtualAccountModal(false);
  };

  useEffect(() => {
    const fund = async () => {
      setError("");
      setSuccess((msg) => ({
        ...msg,
        onloadSuccess: "",
      }));
      setLoading(true);

      const result = await fundWallet();

      if (result.success) {
        setSuccess((msg) => ({
          ...msg,
          onloadSuccess: "Account generated successfully",
        }));
        setAccount(result.virtualAccounts?.[0] || null);
      } else {
        setError(result.message || "Failed to get virtual account.");
      }

      setLoading(false);
    };

    fund();
  }, [fundWallet]); // ✅ no warning, no loop

  const handleFundWallet = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess((msg) => ({
      ...msg,
      onbtnSuccess: "",
    }));
    setLoading(true);

    const result = await fundWallet();

    if (result.success) {
      setSuccess((msg) => ({
        ...msg,
        onbtnSuccess: "Account generated successfully",
      }));
      setShowVirtualAccountModal(true);
    } else {
      setError(result.message || "Failed to get virtual account.");
    }

    setLoading(false);
  };

  const plansReady = dataPlans && Object.keys(dataPlans).length > 0;

  const networks = useMemo(() => {
    if (!plansReady) return [];

    return Object.entries(dataPlans).map(([networkLabel, plans]) => ({
      label: networkLabel,
      types: [...new Set(plans.map((plan) => plan.planType).filter(Boolean))],
    }));
  }, [plansReady, dataPlans]);

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
          {success && <p className="success-message">{success.onbtnSuccess}</p>}
        </form>

        <div className="content">
          <div className="greeting-section">
            <div className="package-title">
              Package:
              <span className={user.role === "reseller" ? "premium" : ""}>
                {user.role === "user" ? "Smart Earner" : user.role}
              </span>
            </div>

            {/* <a
              href="https://play.google.com/store/apps/details?id=your.app.id"
              target="_blank"
              rel="noopener noreferrer"
              className="google-play-btn"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
              />
            </a> */}

            <NavLink className="generate-vfb-btn" to="/buy-data">
              <span>Buy Data</span>
            </NavLink>

            {/* <button
              className="generate-vfb-btn"
              // onClick={handleGenerateVirtualAccount}
            >
              Generate Virtual Account
              <br />
              to fund your wallet
            </button> */}
          </div>

          <DataTypeTicker networks={networks} />

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
                  Upgrade to Reseller Now
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
          <div className="dashboard-account-container">
            <div className="fund-wallet-card">
              {error && <div className="alert alert-error">{error}</div>}
              {success.onloadSuccess && (
                <div className="alert alert-success">
                  {success.onloadSuccess}
                </div>
              )}
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
          <div className="quick-actions-grid">
            {quickActions.map(
              (action, index) =>
                action.title !== "Upgrade to Reseller ₦1000" &&
                user.role === "user" && (
                  <div
                    key={index}
                    className="quick-action-card"
                    onClick={action.page}
                  >
                    <div
                      className="quick-action-icon"
                      style={{ background: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="quick-action-title">{action.title}</div>
                  </div>
                ),
            )}
          </div>

          <div className="balance-cards-grid">
            {balanceCards.map((card, index) => (
              <div key={index} className="balance-card">
                <div
                  className="balance-icon"
                  style={{ background: card.color }}
                >
                  {card.icon}
                </div>
                <div className="balance-info">
                  <div className="balance-title">{card.title}</div>
                  <div className="balance-amount">{card.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="info-cards-row">
            <div className="info-card">
              <h3>Notifications</h3>
            </div>
            <div className="info-card">
              <h3>FAQs:</h3>
              <p>
                Please go through them to have a better knowledge of this
                platform
              </p>
              <button className="info-card-btn">❓ FAQs</button>
            </div>
            <div className="info-card">
              <h3>Support Team:</h3>
              <p>
                Have anything to say to us? Please contact our Support Team on
                Whatsapp
              </p>
              <button className="whatsapp-btn">💬 whatsapp us</button>
              <button className="whatsapp-btn">
                💬 Join Our Whatsapp group
              </button>
            </div>
          </div>
          <div className="services-grid">
            {serviceCards.map((service, index) => (
              <div
                key={index}
                className="dashboard-service-card"
                onClick={service.page}
              >
                <div
                  className="service-icon"
                  style={{ background: service.color }}
                >
                  {service.icon}
                </div>
                <div className="service-title">{service.title}</div>
              </div>
            ))}
          </div>
          {/* <ServiceTable
            dataPlans={dataPlans}
            role={user.role}
            loading={loading}
          /> */}
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

export default Dashboard;
