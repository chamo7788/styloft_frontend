import { useNavigate } from "react-router-dom"
import { Check, Award, Shield, Crown } from 'lucide-react'
import "../../assets/css/Subscription/subscriptionPlans.css"

const plans = [
  {
    id: "free",
    name: "Bronze",
    price: 0,
    description: "Perfect for getting started with Styloft",
    features: [
      "Can explore designs",
      "Social media access",
      "User account creation",
      "Limited access to some features",
      "Maintain your future career",
    ],
    buttonText: "Get Started",
    period: "Free forever",
    icon: <Shield className="plan-icon plan-icon-bronze" />,
    color: "bronze",
  },
  {
    id: "pro",
    name: "Silver",
    price: 3,
    description: "Advanced features for serious designers",
    features: [
      "Many advanced features",
      "Compete with other athletes",
      "Exclusive content access",
      "Personalized design suggestions",
      "Advanced analytics dashboard",
    ],
    popular: true,
    buttonText: "Start Silver Plan",
    period: "per month",
    icon: <Award className="plan-icon plan-icon-silver" />,
    color: "silver",
  },
  {
    id: "commercial",
    name: "Gold",
    price: 20,
    description: "Everything you need for professional work",
    features: [
      "Create your own contests",
      "Collaborate with professionals",
      "Exclusive branding tools",
      "Enhanced marketing options",
      "Advanced analytics dashboard",
    ],
    buttonText: "Start Gold Plan",
    period: "per month",
    icon: <Crown className="plan-icon plan-icon-gold" />,
    color: "gold",
  },
]

const SubscriptionPlans = () => {
  const navigate = useNavigate()

  const handleSelectPlan = (plan) => {
    if (plan.price > 0) {
      // Navigate to payment page if the plan has a price greater than 0
      navigate(`/payment/${plan.id}`)
    } else {
      // Navigate to the signup page if it's a free plan
      navigate("/signup")
    }
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header animate-fade-down">
        <h1 className="subscription-title">Choose Your Plan</h1>
        <p className="subscription-subtitle">
          Select the perfect plan for your design needs. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="plans-grid">
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className={`plan-card plan-card-${plan.color} ${plan.popular ? "plan-card-popular" : ""} animate-fade-up`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {plan.popular && (
              <span className="popular-badge animate-scale-in">
                Popular
              </span>
            )}

            <div className="plan-header">
              <div className="plan-header-content">
                <div className="animate-bounce-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  {plan.icon}
                </div>
                <h3 className="plan-name">{plan.name}</h3>
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-content">
              <div className="plan-price animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <span className="price-amount">${plan.price}</span>
                <span className="price-period">/{plan.period}</span>
              </div>

              <ul className="feature-list">
                {plan.features.map((feature, featureIndex) => (
                  <li 
                    key={feature} 
                    className="feature-item animate-slide-in"
                    style={{ animationDelay: `${0.5 + featureIndex * 0.1 + index * 0.1}s` }}
                  >
                    <div className="animate-scale-in" style={{ animationDelay: `${0.6 + featureIndex * 0.1 + index * 0.1}s` }}>
                      <Check className={`feature-icon feature-icon-${plan.color}`} />
                    </div>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-footer">
              <button 
                onClick={() => handleSelectPlan(plan)} 
                className={`plan-button plan-button-${plan.color}`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionPlans
