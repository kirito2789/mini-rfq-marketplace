import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Handshake,
  Search,
  ShieldCheck,
} from "lucide-react";

import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* =========================
          NAVBAR
      ========================= */}
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
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              B2B procurement made simple
            </div>

            <h1>
              Find the right
              <span> suppliers.</span>
              <br />
              Get better quotes.
            </h1>

            <p className="hero-description">
              RFQHub connects businesses with qualified suppliers. Post your
              requirements, receive competitive quotations, and make smarter
              purchasing decisions.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={() => navigate("/register")}
              >
                Post an RFQ
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-large"
                onClick={() => navigate("/login")}
              >
                Browse RFQs
              </button>
            </div>

            <div className="trust-row">
              <div className="trust-item">
                <ShieldCheck size={18} />
                <span>Secure platform</span>
              </div>

              <div className="trust-item">
                <Building2 size={18} />
                <span>Built for businesses</span>
              </div>
            </div>
          </div>

          <div className="hero-card-wrapper">
            <div className="rfq-card">
              <div className="rfq-card-header">
                <div>
                  <span className="rfq-label">ACTIVE RFQ</span>
                </div>

                <span className="rfq-status">Open</span>
              </div>

              <h3>Industrial Safety Helmets</h3>

              <p className="rfq-description">
                Looking for certified industrial safety helmets for our
                manufacturing facility.
              </p>

              <div className="rfq-details">
                <div className="rfq-detail">
                  <span className="rfq-detail-label">Quantity</span>
                  <strong className="rfq-detail-value">500 units</strong>
                </div>

                <div className="rfq-detail">
                  <span className="rfq-detail-label">Location</span>
                  <strong className="rfq-detail-value">Hyderabad</strong>
                </div>

                <div className="rfq-detail">
                  <span className="rfq-detail-label">Deadline</span>
                  <strong className="rfq-detail-value">
                    Sep 25, 2026
                  </strong>
                </div>

                <div className="rfq-detail">
                  <span className="rfq-detail-label">Category</span>
                  <strong className="rfq-detail-value">Safety Equipment</strong>
                </div>
              </div>

              <div className="rfq-footer">
                <div className="quotation-count">
                  <div className="quotation-icon">
                    <Search size={17} />
                  </div>

                  <div>
                    <strong>8 quotations received</strong>
                    <span>Compare supplier offers</span>
                  </div>
                </div>

                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            STATS
        ========================= */}
        <section className="stats">
          <div className="stat">
            <strong className="stat-number">1,200+</strong>
            <span className="stat-label">Active RFQs</span>
          </div>

          <div className="stat">
            <strong className="stat-number">850+</strong>
            <span className="stat-label">Suppliers</span>
          </div>

          <div className="stat">
            <strong className="stat-number">3,500+</strong>
            <span className="stat-label">Quotations</span>
          </div>

          <div className="stat">
            <strong className="stat-number">24/7</strong>
            <span className="stat-label">Marketplace access</span>
          </div>
        </section>

        {/* =========================
            HOW IT WORKS
        ========================= */}
        <section id="how-it-works" className="how-section">
          <div className="section-heading">
            <span className="section-eyebrow">HOW IT WORKS</span>

            <h2>
              Procurement without the usual complexity.
            </h2>

            <p>
              RFQHub makes it simple for buyers to publish requirements and
              suppliers to discover and respond to relevant opportunities.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>

              <h3>Post your requirement</h3>

              <p>
                Buyers create an RFQ with product requirements, quantities,
                budget and delivery information.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>

              <h3>Receive quotations</h3>

              <p>
                Suppliers discover relevant RFQs and submit competitive
                quotations directly through the marketplace.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>

              <h3>Compare and choose</h3>

              <p>
                Buyers compare supplier offers and select the quotation that
                best matches their requirements.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURES
        ========================= */}
        <section id="features" className="features">
          <div className="section-heading">
            <span className="section-eyebrow">WHY RFQHUB</span>

            <h2>Everything you need to source smarter.</h2>

            <p>
              A structured B2B marketplace designed to make procurement faster,
              clearer and easier to manage.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={22} />
              </div>

              <h3>Discover suppliers</h3>

              <p>
                Suppliers can discover relevant business requirements and
                respond to opportunities that match their capabilities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Handshake size={22} />
              </div>

              <h3>Compare quotations</h3>

              <p>
                Receive multiple supplier quotations and compare pricing,
                delivery times and commercial terms.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>

              <h3>Built for business</h3>

              <p>
                Secure authentication, role-based access and structured
                procurement workflows keep the marketplace organized.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            CTA
        ========================= */}
        <section className="cta-section">
          <div className="cta-content">
            <span className="section-eyebrow">START SOURCING</span>

            <h2>Ready to simplify your procurement?</h2>

            <p>
              Create an account and start connecting with buyers and suppliers
              on RFQHub.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={() => navigate("/register")}
            >
              Get started
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;