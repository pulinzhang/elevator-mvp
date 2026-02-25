"use client";

import { useState, useEffect } from "react";

export const runtime = "edge";

interface Manufacturer {
  id: number;
  name: string;
}

interface ElevatorModel {
  id: number;
  manufacturer_id: number;
  name: string;
  base_price: number;
  image_url: string;
}

interface ConfigurationOption {
  id: number;
  model_id: number;
  category: string;
  name: string;
  price: number;
}

interface CalculationResult {
  base_price: number;
  options_total: number;
  total_cost: number;
  selling_price: number;
}

export default function PricingPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<ElevatorModel[]>([]);
  const [options, setOptions] = useState<ConfigurationOption[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | "">("");
  const [selectedModel, setSelectedModel] = useState<number | "">("");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [margin, setMargin] = useState<number>(20);
  const [defaultMargin, setDefaultMargin] = useState<number>(20);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [salesMode, setSalesMode] = useState(false);

  // Fetch system config on mount
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data: { key: string; value: string }[]) => {
        const marginConfig = data.find((c) => c.key === "default_margin");
        if (marginConfig) {
          const defaultMarginValue = parseInt(marginConfig.value, 10);
          setDefaultMargin(defaultMarginValue);
          setMargin(defaultMarginValue);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/manufacturers")
      .then((res) => res.json())
      .then((data) => setManufacturers(data));
  }, []);

  useEffect(() => {
    if (selectedManufacturer) {
      fetch(`/api/models?manufacturer_id=${selectedManufacturer}`)
        .then((res) => res.json())
        .then((data) => {
          setModels(data);
          setSelectedModel("");
          setOptions([]);
          setSelectedOptions([]);
          setResult(null);
        });
    } else {
      setModels([]);
      setSelectedModel("");
      setOptions([]);
      setSelectedOptions([]);
      setResult(null);
    }
  }, [selectedManufacturer]);

  useEffect(() => {
    if (selectedModel) {
      fetch(`/api/options?model_id=${selectedModel}`)
        .then((res) => res.json())
        .then((data) => {
          setOptions(data);
          setSelectedOptions([]);
          setResult(null);
        });
    } else {
      setOptions([]);
      setSelectedOptions([]);
      setResult(null);
    }
  }, [selectedModel]);

  const handleOptionToggle = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
    setResult(null);
  };

  const calculate = async () => {
    if (!selectedModel) return;
    setLoading(true);
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: selectedModel,
          selected_options: selectedOptions,
          margin: margin,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Calculate error:", error);
    }
    setLoading(false);
  };

  const optionsByCategory = options.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, ConfigurationOption[]>);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏗️</span>
          <div>
            <h1 style={styles.title}>Elevator Quote</h1>
            <p style={styles.subtitle}>Professional Pricing Calculator</p>
          </div>
        </div>
        <div style={styles.modeToggle}>
          <button
            style={salesMode ? styles.modeButtonActive : styles.modeButton}
            onClick={() => setSalesMode(true)}
          >
            👤 Sales Mode
          </button>
          <button
            style={!salesMode ? styles.modeButtonActive : styles.modeButton}
            onClick={() => setSalesMode(false)}
          >
            ⚙️ Admin View
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Left Panel - Configuration */}
        <div style={styles.leftPanel}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📋</span>
              <h2 style={styles.cardTitle}>Configuration</h2>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Manufacturer</label>
              <select
                style={styles.select}
                value={selectedManufacturer}
                onChange={(e) =>
                  setSelectedManufacturer(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">Select a manufacturer...</option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Elevator Model</label>
              <select
                style={styles.select}
                value={selectedModel}
                onChange={(e) =>
                  setSelectedModel(e.target.value ? Number(e.target.value) : "")
                }
                disabled={!selectedManufacturer}
              >
                <option value="">Select a model...</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {formatPrice(m.base_price)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Profit Margin (Company Policy)
                <span style={styles.marginBadge}>{defaultMargin}%</span>
              </label>
              <div style={styles.configuredMargin}>
                <span style={styles.configuredMarginIcon}>📋</span>
                <span style={styles.configuredMarginText}>
                  This margin is configured by your company and cannot be modified.
                </span>
              </div>
            </div>
          </div>

          {/* Options Card */}
          {Object.entries(optionsByCategory).length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>⚡</span>
                <h2 style={styles.cardTitle}>Options & Upgrades</h2>
              </div>

              {Object.entries(optionsByCategory).map(([category, categoryOptions]) => (
                <div key={category} style={styles.optionGroup}>
                  <h3 style={styles.optionCategory}>{category}</h3>
                  {categoryOptions.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        ...styles.optionItem,
                        ...(selectedOptions.includes(option.id) ? styles.optionItemSelected : {}),
                      }}
                    >
                      <div style={styles.optionCheck}>
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => handleOptionToggle(option.id)}
                          style={styles.checkbox}
                        />
                      </div>
                      <span style={styles.optionName}>{option.name}</span>
                      <span
                        style={{
                          ...styles.optionPrice,
                          ...(option.price === 0 ? styles.optionPriceFree : {}),
                        }}
                      >
                        {option.price === 0 ? "Included" : `+${formatPrice(option.price)}`}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button
            style={{
              ...styles.calculateButton,
              ...(!selectedModel || loading ? styles.calculateButtonDisabled : {}),
            }}
            onClick={calculate}
            disabled={!selectedModel || loading}
          >
            {loading ? (
              <>
                <span style={styles.buttonSpinner}>⏳</span> Calculating...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>🧮</span> Calculate Quote
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Result */}
        <div style={styles.rightPanel}>
          {selectedModelData && (
            <div style={styles.imageCard}>
              <img
                src={selectedModelData.image_url}
                alt={`${selectedModelData.name} elevator`}
                style={styles.image}
              />
              <div style={styles.imageOverlay}>
                <h3 style={styles.imageTitle}>{selectedModelData.name}</h3>
                <p style={styles.imageSubtitle}>
                  {manufacturers.find((m) => m.id === selectedModelData.manufacturer_id)?.name}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div
              style={{
                ...styles.resultCard,
                ...(salesMode ? styles.resultCardSales : {}),
              }}
            >
              {salesMode ? (
                <>
                  <div style={styles.salesHeader}>
                    <span style={styles.salesIcon}>🎯</span>
                    <span style={styles.salesLabel}>Your Special Price</span>
                  </div>
                  <div style={styles.salesPrice}>{formatPrice(result.selling_price)}</div>
                  <div style={styles.salesSavings}>
                    Limited Time Offer - Lock in This Price!
                  </div>
                  <button style={styles.salesButton}>
                    📧 Email This Quote
                  </button>
                  <button style={styles.newQuoteButton} onClick={() => setResult(null)}>
                    🔄 Start New Quote
                  </button>
                </>
              ) : (
                <>
                  <div style={styles.adminHeader}>
                    <span style={styles.adminIcon}>📊</span>
                    <span style={styles.adminLabel}>Price Breakdown</span>
                  </div>

                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Base Model</span>
                    <span style={styles.priceValue}>{formatPrice(result.base_price)}</span>
                  </div>

                  {result.options_total > 0 && (
                    <div style={styles.priceRow}>
                      <span style={styles.priceLabel}>
                        Options ({selectedOptions.length} selected)
                      </span>
                      <span style={styles.priceValue}>+{formatPrice(result.options_total)}</span>
                    </div>
                  )}

                  <div style={styles.priceDivider} />

                  <div style={styles.priceRow}>
                    <span style={styles.priceLabelBold}>Total Cost</span>
                    <span style={styles.priceValueBold}>{formatPrice(result.total_cost)}</span>
                  </div>

                  <div style={styles.marginRow}>
                    <span style={styles.marginLabel}>Profit Margin ({defaultMargin}%)</span>
                    <span style={styles.marginValue}>
                      +{formatPrice(result.selling_price - result.total_cost)}
                    </span>
                  </div>

                  <div style={styles.finalPriceCard}>
                    <span style={styles.finalPriceLabel}>Selling Price</span>
                    <span style={styles.finalPriceValue}>{formatPrice(result.selling_price)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {!result && (
            <div style={styles.placeholderCard}>
              <span style={styles.placeholderIcon}>📝</span>
              <p style={styles.placeholderText}>
                Select options and click Calculate to see the quote
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logoIcon: {
    fontSize: "36px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  modeToggle: {
    display: "flex",
    gap: "8px",
    backgroundColor: "#f1f5f9",
    padding: "4px",
    borderRadius: "10px",
  },
  modeButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  modeButtonActive: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 440px",
    gap: "32px",
    padding: "32px 40px",
    maxWidth: "1600px",
    margin: "0 auto",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "sticky",
    top: "100px",
    height: "fit-content",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e2e8f0",
  },
  cardIcon: {
    fontSize: "24px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  marginBadge: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "border-color 0.2s",
    outline: "none",
  },
  sliderContainer: {
    padding: "8px 0",
  },
  slider: {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    background: "#e2e8f0",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  configuredMargin: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    backgroundColor: "#f0fdf4",
    borderRadius: "10px",
    border: "1px solid #bbf7d0",
  },
  configuredMarginIcon: {
    fontSize: "18px",
  },
  configuredMarginText: {
    fontSize: "13px",
    color: "#047857",
  },
  optionGroup: {
    marginBottom: "20px",
  },
  optionCategory: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "12px",
    marginTop: "16px",
  },
  optionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
    backgroundColor: "#f8fafc",
  },
  optionItemSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  optionCheck: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  optionName: {
    flex: 1,
    fontSize: "15px",
    fontWeight: 500,
    color: "#1e293b",
  },
  optionPrice: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#059669",
    backgroundColor: "#d1fae5",
    padding: "4px 12px",
    borderRadius: "6px",
  },
  optionPriceFree: {
    backgroundColor: "#e2e8f0",
    color: "#475569",
  },
  calculateButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "18px 32px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
    transition: "all 0.2s",
  },
  calculateButtonDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonIcon: {
    fontSize: "20px",
  },
  buttonSpinner: {
    fontSize: "18px",
  },
  imageCard: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    display: "block",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "20px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
  },
  imageTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
  },
  imageSubtitle: {
    fontSize: "14px",
    color: "#cbd5e1",
    margin: "4px 0 0 0",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  resultCardSales: {
    backgroundColor: "#ffffff",
    border: "3px solid #10b981",
    boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)",
  },
  salesHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  salesIcon: {
    fontSize: "32px",
  },
  salesLabel: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#047857",
  },
  salesPrice: {
    fontSize: "56px",
    fontWeight: 800,
    color: "#10b981",
    textAlign: "center",
    letterSpacing: "-2px",
  },
  salesSavings: {
    textAlign: "center",
    fontSize: "14px",
    color: "#059669",
    marginBottom: "24px",
  },
  salesButton: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#10b981",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "12px",
  },
  newQuoteButton: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  adminHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  adminIcon: {
    fontSize: "24px",
  },
  adminLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#334155",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
  },
  priceLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  priceValue: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#334155",
  },
  priceDivider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "8px 0",
  },
  priceLabelBold: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1e293b",
  },
  priceValueBold: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#334155",
  },
  marginRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    margin: "8px -28px",
    padding: "12px 28px",
  },
  marginLabel: {
    fontSize: "13px",
    color: "#047857",
  },
  marginValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#059669",
  },
  finalPriceCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    margin: "16px -28px -28px",
    padding: "20px 28px",
    borderRadius: "0 0 13px 13px",
  },
  finalPriceLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#94a3b8",
  },
  finalPriceValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#ffffff",
  },
  placeholderCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  placeholderIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px",
  },
  placeholderText: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0,
  },
};
