import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../../assets/css/subscription/payment-success.css"

const PaymentSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-card animate-scale-in">
        <div className="success-header">
          <div className="success-icon-container animate-bounce-in" style={{ animationDelay: "0.5s" }}>
            <div className="icon-wrapper animate-pulse">
              <CheckCircle className="success-icon" />
            </div>
          </div>
          <h1 className="success-title animate-fade-up" style={{ animationDelay: "0.7s" }}>
            Payment Successful!
          </h1>
          <p className="success-subtitle animate-fade-up" style={{ animationDelay: "0.8s" }}>
            Thank you for your subscription. Your account has been upgraded.
          </p>
        </div>
        <div className="success-content animate-fade-up" style={{ animationDelay: "0.9s" }}>
          <p className="success-message">
            You will receive a confirmation email shortly with your receipt and account details.
          </p>
        </div>
        <div className="success-footer animate-fade-up" style={{ animationDelay: "1s" }}>
          <Link to="/dashboard" className="success-button">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

