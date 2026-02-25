export const runtime = "edge";

export default function Home() {
  const features = [
    {
      title: "Live Pricing",
      description: "Calculate elevator costs in real-time with accurate pricing based on your configuration.",
      icon: "💰",
    },
    {
      title: "Visual Configuration",
      description: "Select from multiple manufacturers, models, and customization options visually.",
      icon: "🎨",
    },
    {
      title: "Instant Quote",
      description: "Get immediate price quotes with detailed breakdowns and margin calculations.",
      icon: "⚡",
    },
    {
      title: "Cloud Deployment",
      description: "Powered by Cloudflare Edge for global, low-latency performance.",
      icon: "☁️",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>ElevatorHub</div>
        <nav style={styles.nav}>
          <a href="/pricing" style={styles.navLink}>Pricing</a>
          <a href="/admin" style={styles.navLink}>Admin</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Elevator Pricing System</h1>
        <p style={styles.heroSubtitle}>
          Professional elevator configuration and pricing solution built for the modern era.
          Calculate, configure, and quote in seconds.
        </p>
        <a href="/pricing" style={styles.heroButton}>
          Try Demo
        </a>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Key Features</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>Powered by Cloudflare Edge</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#fafafa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.5px",
  },
  nav: {
    display: "flex",
    gap: "24px",
  },
  navLink: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#6b7280",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  hero: {
    padding: "100px 40px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  heroTitle: {
    fontSize: "52px",
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 20px 0",
    letterSpacing: "-1px",
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#6b7280",
    maxWidth: "600px",
    margin: "0 auto 36px",
    lineHeight: 1.6,
  },
  heroButton: {
    display: "inline-block",
    padding: "16px 40px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#2563eb",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "background-color 0.2s, transform 0.2s",
  },
  features: {
    padding: "80px 40px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  featuresTitle: {
    fontSize: "32px",
    fontWeight: 600,
    color: "#1a1a1a",
    textAlign: "center",
    margin: "0 0 48px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "32px",
  },
  featureCard: {
    padding: "32px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 12px",
  },
  featureDescription: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  },
  footer: {
    marginTop: "auto",
    padding: "24px 40px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: "14px",
    color: "#9ca3af",
    margin: 0,
  },
};
