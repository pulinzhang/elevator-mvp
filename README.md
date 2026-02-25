# Elevator Pricing System

A professional elevator pricing and quotation system built with Next.js, designed for sales teams to create accurate, visually appealing quotes for customers. Deployed on Cloudflare Pages with D1 database.

![Elevator Pricing System](https://picsum.photos/800/400?random=1)

## Features

### 💰 Professional Pricing Calculator
- Configure elevator models from major manufacturers
- Add multiple configuration options (speed, cabin finish, door types, smart controls, energy saving)
- Automatic price calculation with company-defined profit margins
- Clean, professional interface for customer presentations

### 🎯 Sales Mode
- Designed for in-person customer meetings
- Shows only the selling price in large, bold display
- Hides all internal cost information and profit margins
- Professional "limited time offer" messaging

### ⚙️ Admin Panel
- Manage manufacturers, elevator models, and configuration options
- View recent quotes and customer history
- System-wide settings configuration
- Excel import for bulk data upload

### 📊 Excel Import
- Import manufacturers, models, and options from Excel files
- Multi-sheet support (Models, Options, Pricing Rules)
- Automatic duplicate detection
- Download official template for data entry

### ☁️ Cloud Deployment
- Built on Cloudflare Pages for global edge performance
- D1 serverless database for data storage
- Edge runtime for fast API responses

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Inline CSS, Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **Build Tool**: Turbopack
- **Excel Processing**: xlsx library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Environment Variables

Create a `.dev.vars` file for local development:
```bash
USE_MOCK_DATA=true
```

When `USE_MOCK_DATA=true`, the app uses in-memory mock data instead of D1 database.

## Project Structure

```
elevator-mvp/
├── public/                    # Static assets
│   └── Elevator_Supplier_Cost_Template_v1.xlsx
├── src/
│   └── app/
│       ├── admin/             # Admin panel
│       │   └── page.tsx
│       ├── api/              # API routes
│       │   ├── calculate/   # Price calculation
│       │   ├── config/       # System configuration
│       │   ├── models/      # Elevator models
│       │   ├── manufacturers/
│       │   ├── options/     # Configuration options
│       │   ├── quotes/      # Quote management
│       │   └── admin/
│       │       └── import/  # Excel import
│       ├── pricing/         # Pricing calculator page
│       │   └── page.tsx
│       └── page.tsx         # Homepage
├── schema.sql               # Database schema
├── seed.sql                 # Demo data
├── wrangler.toml            # Cloudflare configuration
└── package.json
```

## Database Schema

### Tables

- **manufacturers**: Elevator manufacturers (Otis, KONE, Schindler, Mitsubishi)
- **elevator_models**: Product models with base prices and images
- **configuration_options**: Optional upgrades and features
- **quotes**: Customer quotes with configuration and pricing
- **system_config**: System-wide settings (default margin, etc.)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview Cloudflare deployment |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run d1:local:init` | Initialize local D1 database |
| `npm run d1:remote:init` | Initialize remote D1 database |

## Deployment to Cloudflare

1. **Create D1 database**:
   ```bash
   wrangler d1 create elevator-db
   ```

2. **Update wrangler.toml**:
   Replace `database_id` with your actual D1 database ID.

3. **Initialize remote database**:
   ```bash
   npm run d1:remote:init
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manufacturers` | List all manufacturers |
| POST | `/api/manufacturers` | Add new manufacturer |
| GET | `/api/models` | List models (optional: `?manufacturer_id=x`) |
| POST | `/api/models` | Add new model |
| GET | `/api/options` | List options (optional: `?model_id=x`) |
| POST | `/api/options` | Add new option |
| POST | `/api/calculate` | Calculate price |
| GET/POST | `/api/config` | Get/Set system configuration |
| GET | `/api/quotes` | List recent quotes |
| POST | `/api/quotes` | Create new quote |
| POST | `/api/admin/import` | Import Excel data |

## Pages

| Path | Description |
|------|-------------|
| `/` | Homepage with hero and features |
| `/pricing` | Main pricing calculator |
| `/admin` | Admin panel for data management |

## License

MIT License
