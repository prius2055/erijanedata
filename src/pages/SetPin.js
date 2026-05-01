import React, { useState } from "react";
import { useWallet } from "../context/walletContext";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import "./BuyData.css";
import { Eye, EyeOff } from "lucide-react";

const SetPin = () => {
  const navigate = useNavigate();

  const { setPin } = useWallet();

  const [formData, setFormData] = useState({
    pin: "",
    confirmPin: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.pin || !formData.confirmPin) {
      setError("Please enter and confirm your pin");
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      setError("Pins do not match");
      return;
    }

    const payload = {
      pin: formData.pin,
      confirmPin: formData.confirmPin,
    };

    setSubmitting(true);

    const result = await setPin(payload);

    if (result?.success) {
      setSubmitting(false);
      setSuccess("Pin set successfully");
      setError("");
      navigate("/dashboard", { replace: true });
    } else {
      setError(result?.message || "Transaction failed");
      setSubmitting(false);
    }

    setSubmitting(false);
  };

  /* -----------------------------
    UI
 ------------------------------ */

  return (
    <div className="buy-data-container">
      <SideBar />
      <div className="buy-data-content">
        <Header />

        <div className="popup-container">
          <h2 className="popup-title">Create Transaction Pin</h2>

          <form onSubmit={handleSubmit} className="popup-form">
            <div className="buy-data-form-row">
              <div className="form-column">
                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                {/* PIN */}
                <div className="form-group">
                  <label> Enter 4 digit Pin *</label>
                  <input
                    type={showPin ? "text" : "password"}
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    maxLength="4"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPin((prev) => !prev)}
                    aria-label={showPin ? "Hide pin" : "Show pin"}
                    tabIndex={-1}
                  >
                    {showPin ? <Eye /> : <EyeOff />}
                  </button>
                </div>

                <div className="form-group">
                  <label> Confirm 4 digit Pin *</label>
                  <input
                    type={showPin ? "text" : "password"}
                    name="confirmPin"
                    value={formData.confirmPin}
                    onChange={handleChange}
                    maxLength="4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!formData.pin || !formData.confirmPin || submitting}
                  className="btn-buy-now"
                >
                  {submitting ? "Processing..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPin;
