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

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4
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

   Or use wrangler (supports D1 binding, but requires setting up local database first):
   ```bash
   npx wrangler dev
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

**Important Notes:**
- When `USE_MOCK_DATA=true`, the app uses in-memory mock data instead of D1 database
- During local development, `env.DB` is `undefined` (D1 binding only works after deploying to Cloudflare)
- After deploying to Cloudflare, D1 database binding will automatically activate and connect to the real database

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
├── open-next.config.ts       # @opennextjs/cloudflare config
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
| `npm run build` | Build Next.js for production |
| `npm run build:cf` | Build for Cloudflare Pages |
| `npm run preview` | Preview Cloudflare deployment locally |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run d1:local:create` | Create local D1 database |
| `npm run d1:local:init` | Initialize local D1 database with schema |
| `npm run d1:local:reset` | Reset local D1 database |
| `npm run d1:remote:create` | Create remote D1 database |
| `npm run d1:remote:init` | Initialize remote D1 database with schema |
| `npm run d1:remote:reset` | Reset remote D1 database |

## Deployment to Cloudflare

### Important: Using @opennextjs/cloudflare

This project uses `@opennextjs/cloudflare` for Cloudflare Pages deployment. The build process is:

1. Cloudflare Pages runs `npx @opennextjs/cloudflare build`
2. `@opennextjs/cloudflare` internally calls `npm run build` (which runs `next build`)
3. `@opennextjs/cloudflare` packages the result for Cloudflare Workers

**⚠️ Important:** Do NOT include `@opennextjs/cloudflare` in your `package.json` build script, otherwise it will cause an infinite build loop.

### Cloudflare Pages Configuration

In your Cloudflare Pages project settings:

- **Build command:** `npx @opennextjs/cloudflare build`
- **Output directory:** (leave empty or set to `.open-next/assets`)

### Local Build & Deploy

1. **Build for Cloudflare:**
   ```bash
   npm run build:cf
   ```

2. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

Or combine them:
```bash
npm run build:cf && npm run deploy
```

### Create D1 Database (first time only)

```bash
# Create remote D1 database
npm run d1:remote:create

# Or create local D1 database
npm run d1:local:create
```

Then update `wrangler.toml` with the new `database_id`.

### Initialize Remote Database

```bash
npm run d1:remote:init
```

**Note:** The D1 database is already configured in `wrangler.toml` with `database_id` as `a6b043f2-0849-4b62-bede-e6526486bf91`.

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

## Troubleshooting

### 1. Infinite Build Loop

**Error:** Build command runs infinitely without completing.

**Cause:** The `package.json` build script includes `@opennextjs/cloudflare build`, causing recursive execution.

**Solution:** Set your `package.json` build script to just `next build`:

```json
"build": "next build"
```

Then in Cloudflare Pages, set the build command to `npx @opennextjs/cloudflare build`.

### 2. Missing open-next.config.ts

**Error:**
```
? Missing required `open-next.config.ts` file, do you want to create one?
```

**Solution:** Make sure `open-next.config.ts` is committed to your Git repository. Cloudflare Pages builds from your Git repository.

### 3. D1 Database Binding Not Found

**Error:**
```
Error: env.DB is not defined
```

**Solution:** Ensure your `wrangler.toml` has the correct D1 configuration:

```toml
[[d1_databases]]
binding = "DB"
database_name = "elevator-db"
database_id = "your-database-id-here"
```

### 4. Using Mock Data Locally

For local development without D1, create a `.dev.vars` file:

```bash
USE_MOCK_DATA=true
```

This will use in-memory mock data instead of the D1 database.

### 5. env.DB is undefined (Local Development)

**Symptom:** During local development, API logs show `env DB: undefined`, which is normal!

**Cause:** D1 database binding only works after deploying to Cloudflare. During local development, `env.DB` defaults to `undefined`.

**Solution:** Set `USE_MOCK_DATA=true` in `.dev.vars` file, or use `--remote` mode:

```bash
npx wrangler dev --remote
```

After deploying to Cloudflare, D1 binding will automatically work.
