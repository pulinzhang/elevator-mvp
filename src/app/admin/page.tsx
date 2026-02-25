"use client";

import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

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

interface Quote {
  id: number;
  customer_name: string | null;
  configuration_json: string;
  total_cost: number;
  selling_price: number;
  margin: number;
  created_at: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"manufacturers" | "models" | "options" | "quotes" | "import" | "settings">("manufacturers");
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [models, setModels] = useState<ElevatorModel[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Form states
  const [manufacturerName, setManufacturerName] = useState("");
  const [modelManufacturerId, setModelManufacturerId] = useState<number | "">("");
  const [modelName, setModelName] = useState("");
  const [modelBasePrice, setModelBasePrice] = useState("");
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [optionModelId, setOptionModelId] = useState<number | "">("");
  const [optionCategory, setOptionCategory] = useState("");
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<Record<string, unknown[]>>({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    manufacturers_created: number;
    models_created: number;
    options_created: number;
    total_rows: number;
  } | null>(null);
  const [settingsMargin, setSettingsMargin] = useState<string>("20");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data on tab change
  useEffect(() => {
    if (activeTab === "manufacturers") {
      fetchManufacturers();
    } else if (activeTab === "models") {
      fetchManufacturers();
      fetchModels();
    } else if (activeTab === "options") {
      fetchModels();
    } else if (activeTab === "quotes") {
      fetchQuotes();
    } else if (activeTab === "settings") {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchSettings = () => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data: { key: string; value: string }[]) => {
        const marginConfig = data.find((c) => c.key === "default_margin");
        if (marginConfig) {
          setSettingsMargin(marginConfig.value);
        }
      })
      .catch(console.error);
  };

  const fetchManufacturers = () => {
    fetch("/api/manufacturers")
      .then((res) => res.json())
      .then((data) => setManufacturers(data));
  };

  const fetchModels = () => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => setModels(data));
  };

  const fetchQuotes = () => {
    fetch("/api/quotes")
      .then((res) => res.json())
      .then((data) => setQuotes(data));
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "default_margin", value: settingsMargin }),
    });

    if (response.ok) {
      showMessage("Settings saved successfully!");
    } else {
      showMessage("Failed to save settings");
    }
    setLoading(false);
  };

  const handleAddManufacturer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/manufacturers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: manufacturerName }),
    });

    if (response.ok) {
      showMessage("Manufacturer added successfully!");
      setManufacturerName("");
      fetchManufacturers();
    } else {
      showMessage("Failed to add manufacturer.");
    }
    setLoading(false);
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manufacturer_id: modelManufacturerId,
        name: modelName,
        base_price: Number(modelBasePrice),
        image_url: modelImageUrl,
      }),
    });

    if (response.ok) {
      showMessage("Model added successfully!");
      setModelName("");
      setModelBasePrice("");
      setModelImageUrl("");
      fetchModels();
    } else {
      showMessage("Failed to add model.");
    }
    setLoading(false);
  };

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_id: optionModelId,
        category: optionCategory,
        name: optionName,
        price: Number(optionPrice),
      }),
    });

    if (response.ok) {
      showMessage("Option added successfully!");
      setOptionCategory("");
      setOptionName("");
      setOptionPrice("");
    } else {
      showMessage("Failed to add option.");
    }
    setLoading(false);
  };

  // Handle Excel file upload and parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        // Parse all sheets
        const parsedData: Record<string, unknown[]> = {};
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          parsedData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });
        
        setImportData(parsedData);
        
        const totalRows = Object.values(parsedData).reduce((sum, arr) => sum + arr.length, 0);
        showMessage(`Loaded ${workbook.SheetNames.join(', ')} sheets (${totalRows} total rows)`);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        showMessage("Failed to parse Excel file");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle import to backend
  const handleImport = async () => {
    if (Object.keys(importData).length === 0) return;

    setImporting(true);
    try {
      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: importData }),
      });

      const result = await response.json();
      if (response.ok) {
        setImportResult(result);
        showMessage("Import completed!");
        // Refresh data
        fetchManufacturers();
        fetchModels();
      } else {
        showMessage(result.error || "Import failed");
      }
    } catch (error) {
      console.error("Import error:", error);
      showMessage("Import failed");
    }
    setImporting(false);
  };

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    
    // Models sheet
    const modelsData = [
      { Manufacturer: "Otis", "Model Code": "OT-STD", "Model Name": "Standard", "Base Cost": 30000, "Load Capacity (kg)": 630, "Max Floors": 10, "Lead Time (weeks)": 6, Active: true },
      { Manufacturer: "Otis", "Model Code": "OT-PRM", "Model Name": "Premium", "Base Cost": 50000, "Load Capacity (kg)": 1000, "Max Floors": 20, "Lead Time (weeks)": 8, Active: true },
    ];
    const wsModels = XLSX.utils.json_to_sheet(modelsData);
    XLSX.utils.book_append_sheet(wb, wsModels, "Models");
    
    // Options sheet
    const optionsData = [
      { "Model Code": "OT-STD", Category: "Speed", "Option Code": "SPD-1", "Option Name": "1.0m/s", "Option Cost": 1000, "Is Default": true },
      { "Model Code": "OT-STD", Category: "Speed", "Option Code": "SPD-2", "Option Name": "1.5m/s", "Option Cost": 2000, "Is Default": false },
      { "Model Code": "OT-STD", Category: "Cabin Finish", "Option Code": "CAB-1", "Option Name": "Stainless Steel", "Option Cost": 1500, "Is Default": true },
    ];
    const wsOptions = XLSX.utils.json_to_sheet(optionsData);
    XLSX.utils.book_append_sheet(wb, wsOptions, "Options");
    
    // Pricing Rules sheet
    const pricingData = [
      { "Rule Type": "Default Margin", Target: "ALL", Value: 25 },
      { "Rule Type": "Category Margin", Target: "Cabin Finish", Value: 35 },
    ];
    const wsPricing = XLSX.utils.json_to_sheet(pricingData);
    XLSX.utils.book_append_sheet(wb, wsPricing, "Pricing Rules");
    
    XLSX.writeFile(wb, "elevator_import_template.xlsx");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getManufacturerName = (id: number) => {
    const m = manufacturers.find((m) => m.id === id);
    return m ? m.name : "Unknown";
  };

  const getModelName = (id: number) => {
    const m = models.find((m) => m.id === id);
    return m ? m.name : "Unknown";
  };

  const tabs = [
    { key: "manufacturers", label: "Add Manufacturer" },
    { key: "models", label: "Add Model" },
    { key: "options", label: "Add Option" },
    { key: "import", label: "Import Excel" },
    { key: "quotes", label: "Recent Quotes" },
    { key: "settings", label: "⚙️ System Settings" },
  ] as const;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && <div style={styles.message}>{message}</div>}

      {/* Add Manufacturer */}
      {activeTab === "manufacturers" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add New Manufacturer</h2>
          <form onSubmit={handleAddManufacturer} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Manufacturer Name</label>
              <input
                type="text"
                style={styles.input}
                value={manufacturerName}
                onChange={(e) => setManufacturerName(e.target.value)}
                placeholder="e.g., Otis, Schindler"
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Adding..." : "Add Manufacturer"}
            </button>
          </form>

          {/* Existing Manufacturers */}
          <div style={styles.listSection}>
            <h3 style={styles.listTitle}>Existing Manufacturers</h3>
            <div style={styles.list}>
              {manufacturers.map((m) => (
                <div key={m.id} style={styles.listItem}>
                  <span>{m.id}</span>
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Model */}
      {activeTab === "models" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add New Elevator Model</h2>
          <form onSubmit={handleAddModel} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Manufacturer</label>
              <select
                style={styles.select}
                value={modelManufacturerId}
                onChange={(e) => setModelManufacturerId(e.target.value ? Number(e.target.value) : "")}
                required
              >
                <option value="">-- Select Manufacturer --</option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Model Name</label>
              <input
                type="text"
                style={styles.input}
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g., Gen2"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Base Price ($)</label>
              <input
                type="number"
                style={styles.input}
                value={modelBasePrice}
                onChange={(e) => setModelBasePrice(e.target.value)}
                placeholder="25000"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Image URL</label>
              <input
                type="text"
                style={styles.input}
                value={modelImageUrl}
                onChange={(e) => setModelImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Adding..." : "Add Model"}
            </button>
          </form>

          {/* Existing Models */}
          <div style={styles.listSection}>
            <h3 style={styles.listTitle}>Existing Models</h3>
            <div style={styles.list}>
              {models.map((m) => (
                <div key={m.id} style={styles.listItem}>
                  <span>{m.id}</span>
                  <span>{getManufacturerName(m.manufacturer_id)}</span>
                  <span>{m.name}</span>
                  <span>{formatPrice(m.base_price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Option */}
      {activeTab === "options" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add Configuration Option</h2>
          <form onSubmit={handleAddOption} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Model</label>
              <select
                style={styles.select}
                value={optionModelId}
                onChange={(e) => setOptionModelId(e.target.value ? Number(e.target.value) : "")}
                required
              >
                <option value="">-- Select Model --</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <input
                type="text"
                style={styles.input}
                value={optionCategory}
                onChange={(e) => setOptionCategory(e.target.value)}
                placeholder="e.g., Speed, Cabin Finish"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Option Name</label>
              <input
                type="text"
                style={styles.input}
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                placeholder="e.g., 2.5 m/s"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Price ($)</label>
              <input
                type="number"
                style={styles.input}
                value={optionPrice}
                onChange={(e) => setOptionPrice(e.target.value)}
                placeholder="1000"
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Adding..." : "Add Option"}
            </button>
          </form>
        </div>
      )}

      {/* Import Excel */}
      {activeTab === "import" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Import Data from Excel</h2>
          
          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "#6b7280", marginBottom: "16px" }}>
              Upload the Excel template with multiple sheets (Models, Options, Pricing Rules):
            </p>
            <div style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
              <code style={{ fontSize: "13px" }}>
                Models: Manufacturer, Model Code, Model Name, Base Cost<br/>
                Options: Model Code, Category, Option Name, Option Cost
              </code>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <a 
                href="/Elevator_Supplier_Cost_Template_v1.xlsx" 
                download
                style={{ ...styles.button, backgroundColor: "#059669", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                📥 Download Official Template
              </a>
              <button 
                onClick={downloadTemplate}
                style={{ ...styles.button, backgroundColor: "#6b7280" }}
              >
                🆕 Generate Sample Template
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ ...styles.button, backgroundColor: "#8b5cf6" }}
            >
              📤 Upload Excel File
            </button>
            {importFile && (
              <p style={{ marginTop: "8px", color: "#059669" }}>
                ✓ Selected: {importFile.name} ({Object.keys(importData).length} sheets)
              </p>
            )}
          </div>

          {importData && Object.keys(importData).length > 0 && (
            <>
              {/* Show sheet names and counts */}
              <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {Object.entries(importData).map(([sheetName, rows]) => (
                  <div key={sheetName} style={{ 
                    backgroundColor: "#e0e7ff", 
                    padding: "8px 16px", 
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#3730a3"
                  }}>
                    {sheetName}: {Array.isArray(rows) ? rows.length : 0} rows
                  </div>
                ))}
              </div>

              {/* Show Models sheet preview */}
              {importData["Models"] && Array.isArray(importData["Models"]) && importData["Models"].length > 0 && (
                <div style={{ marginBottom: "24px", maxHeight: "300px", overflow: "auto" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Models Preview:</h3>
                  <table style={{ ...styles.table, fontSize: "12px" }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Manufacturer</th>
                        <th style={styles.th}>Model Code</th>
                        <th style={styles.th}>Model Name</th>
                        <th style={styles.th}>Base Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(importData["Models"] as unknown[]).slice(0, 5).map((row: unknown, idx: number) => {
                        const r = row as Record<string, unknown>;
                        return (
                          <tr key={idx}>
                            <td style={styles.td}>{String(r.Manufacturer || "")}</td>
                            <td style={styles.td}>{String(r["Model Code"] || "")}</td>
                            <td style={styles.td}>{String(r["Model Name"] || "")}</td>
                            <td style={styles.td}>{String(r["Base Cost"] || "")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Show Options sheet preview */}
              {importData["Options"] && Array.isArray(importData["Options"]) && importData["Options"].length > 0 && (
                <div style={{ marginBottom: "24px", maxHeight: "300px", overflow: "auto" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Options Preview:</h3>
                  <table style={{ ...styles.table, fontSize: "12px" }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Model Code</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Option Name</th>
                        <th style={styles.th}>Option Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(importData["Options"] as unknown[]).slice(0, 5).map((row: unknown, idx: number) => {
                        const r = row as Record<string, unknown>;
                        return (
                          <tr key={idx}>
                            <td style={styles.td}>{String(r["Model Code"] || "")}</td>
                            <td style={styles.td}>{String(r.Category || "")}</td>
                            <td style={styles.td}>{String(r["Option Name"] || "")}</td>
                            <td style={styles.td}>{String(r["Option Cost"] || "")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={importing}
                style={{ ...styles.button, ...(importing ? { opacity: 0.6 } : {}) }}
              >
                {importing ? "⏳ Importing..." : "🚀 Import Data"}
              </button>

              {importResult && (
                <div style={{ 
                  marginTop: "24px", 
                  padding: "20px", 
                  backgroundColor: "#d1fae5", 
                  borderRadius: "8px",
                  border: "1px solid #10b981"
                }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#065f46", marginBottom: "12px" }}>
                    ✓ Import Successful!
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "24px", fontWeight: 700, color: "#059669" }}>
                        {importResult.manufacturers_created}
                      </div>
                      <div style={{ fontSize: "12px", color: "#065f46" }}>Manufacturers</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "24px", fontWeight: 700, color: "#059669" }}>
                        {importResult.models_created}
                      </div>
                      <div style={{ fontSize: "12px", color: "#065f46" }}>Models</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "24px", fontWeight: 700, color: "#059669" }}>
                        {importResult.options_created}
                      </div>
                      <div style={{ fontSize: "12px", color: "#065f46" }}>Options</div>
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", fontSize: "13px", color: "#065f46" }}>
                    Total rows processed: {importResult.total_rows}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Recent Quotes */}
      {activeTab === "quotes" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Quotes</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>Total Cost</th>
                  <th style={styles.th}>Selling Price</th>
                  <th style={styles.th}>Margin %</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => {
                  let modelName = "Unknown";
                  try {
                    const config = JSON.parse(quote.configuration_json);
                    modelName = getModelName(config.model_id);
                  } catch {}

                  return (
                    <tr key={quote.id} style={styles.tr}>
                      <td style={styles.td}>{quote.id}</td>
                      <td style={styles.td}>{quote.customer_name || "-"}</td>
                      <td style={styles.td}>{modelName}</td>
                      <td style={styles.td}>{formatPrice(quote.total_cost)}</td>
                      <td style={styles.td}>{formatPrice(quote.selling_price)}</td>
                      <td style={styles.td}>{quote.margin}%</td>
                      <td style={styles.td}>{formatDate(quote.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {quotes.length === 0 && (
              <p style={styles.emptyText}>No quotes yet.</p>
            )}
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === "settings" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚙️ System Configuration</h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            Configure system-wide settings that affect pricing calculations.
          </p>

          <form onSubmit={handleSaveSettings}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Default Profit Margin (%)</label>
              <input
                type="number"
                style={styles.input}
                value={settingsMargin}
                onChange={(e) => setSettingsMargin(e.target.value)}
                min={0}
                max={100}
                required
              />
              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                This is the default profit margin applied to all quotes. Sales staff cannot modify this value.
              </p>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: "#2563eb",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save Settings"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "24px",
    textAlign: "center",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "8px",
  },
  tab: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  message: {
    padding: "12px 16px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  section: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "20px",
    marginTop: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: 400,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
  },
  select: {
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  button: {
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "8px",
  },
  listSection: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },
  listTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "12px",
    marginTop: 0,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 1fr 100px",
    gap: "16px",
    padding: "10px 12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#374151",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f9fafb",
    color: "#374151",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "12px",
    color: "#374151",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    padding: "24px",
  },
};
