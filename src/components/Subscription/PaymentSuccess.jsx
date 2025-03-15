import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../../assets/css/subscription/paymentSuccess.css"

const PaymentSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-header">
          <div className="success-icon-container">
            <CheckCircle className="success-icon" />
          </div>
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-subtitle">Thank you for your subscription. Your account has been upgraded.</p>
        </div>
        <div className="success-content">
          <p className="success-message">
            You will receive a confirmation email shortly with your receipt and account details.
          </p>
        </div>
        <div className="success-footer">
          <Link to="/dashboard" className="success-button">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

