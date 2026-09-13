```jsx
import "../styles/home.css";
import {
  ArrowRight,
  Building2,
  Handshake,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Handshake size={22} />
          </div>
          <span>RFQHub</span>
        </div>

        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
        </div>

        <div className="nav-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            Get started
          </button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">
              <span></span>
              B2B procurement made simple
            </div>

            <h1>
              Find the right
              <span> suppliers.</span>
              <br />
              Get better quotes.
            </h1>

            <p>
              RFQHub connects businesses with qualified suppliers. Post your
              requirements, receive competitive quotations, and make smarter
              purchasing decisions.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate("/register")}
              >
                Post an RFQ
                <ArrowRight size={18} />
              </button>

              <button
                className="btn btn-secondary btn-large"
                onClick={() => navigate("/login")}
              >
                Browse RFQs
              </button>
            </div>

            <div className="trust-row">
              <div>
                <ShieldCheck size={18} />
                Secure platform
              </div>

              <div>
                <Building2 size={18} />
                Built for businesses
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <div>
                <span className="small-label">ACTIVE RFQ</span>
                <h3>Industrial Safety Helmets</h3>
              </div>

              <span className="status">Open</span>
            </div>

            <p className="card-description">
              Looking for certified industrial safety helmets for our
              manufacturing facility.
            </p>

            <div className="rfq-info">
              <div>
                <span>Quantity</span>
                <strong>500 units</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>Hyderabad</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>Sep 25, 2026</strong>
              </div>
            </div>

            <div className="quote-preview">
              <div className="quote-icon">
                <Search size={18} />
              </div>

              <div>
                <strong>8 quotations received</strong>
                <span>Compare supplier offers</span>
              </div>

              <ArrowRight size={18} />
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>1,200+</strong>
            <span>Active RFQs</span>
          </div>

          <div>
            <strong>850+</strong>
            <span>Suppliers</span>
          </div>

          <div>
            <strong>3,500+</strong>
            <span>Quotations</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Marketplace access</span>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="section-heading">
            <span>WHY RFQHUB</span>
            <h2>Everything you need to source smarter.</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Search />
              </div>

              <h3>Discover suppliers</h3>

              <p>
                Suppliers can discover relevant business requirements and
                respond to opportunities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Handshake />
              </div>

              <h3>Compare quotations</h3>

              <p>
                Receive multiple supplier quotations and compare pricing and
                delivery times.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck />
              </div>

              <h3>Built for business</h3>

              <p>
                Secure authentication, role-based access and structured
                procurement workflows.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
```
