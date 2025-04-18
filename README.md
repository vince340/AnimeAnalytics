# Anime Focus Analytics Dashboard

A modern, interactive web analytics dashboard for tracking visitor statistics of [anime-focus-v2.vercel.app](https://anime-focus-v2.vercel.app) with clean visualizations and essential metrics.

![Anime Focus Analytics Dashboard](https://github.com/username/anime-focus-analytics/raw/main/screenshot.png)

## Features

- **Real-time Overview Metrics**: Track unique visitors, page views, bounce rates, and session durations
- **Interactive Visitors Chart**: Visualize visitor trends with day/week/month interval options
- **Geography Map**: See where your visitors are coming from with country-based analytics
- **Traffic Sources Analysis**: Understand which platforms are driving traffic to your site
- **Popular Pages Tracking**: Identify your most visited content with detailed metrics
- **Device Breakdown**: Monitor usage across desktop, mobile, and tablet devices
- **Customizable Date Ranges**: Filter data by predefined periods or custom date selections

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Data Visualization**: Recharts
- **State Management**: React Query
- **Backend**: Node.js, Express
- **Data Storage**: In-memory storage (easily extendable to PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/username/anime-focus-analytics.git
   cd anime-focus-analytics
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # React components
│   │   │   ├── analytics/ # Analytics-specific components
│   │   │   └── ui/    # UI components from shadcn
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions and configurations
│   │   ├── pages/     # Page components
│   │   └── utils/     # Helper utilities
│   └── index.html     # HTML entry point
├── server/            # Backend Express server
│   ├── index.ts       # Server entry point
│   ├── routes.ts      # API route definitions
│   ├── storage.ts     # Data storage implementation
│   └── vite.ts        # Vite configuration
├── shared/            # Shared code between client and server
│   └── schema.ts      # Data schema definitions
└── package.json       # Project dependencies and scripts
```

## API Endpoints

The dashboard uses the following API endpoints:

- `GET /api/analytics/overview`: Provides summary metrics like visitors, page views, etc.
- `GET /api/analytics/visitors-over-time`: Returns visitor data over time intervals
- `GET /api/analytics/geography`: Provides visitor data by country
- `GET /api/analytics/traffic-sources`: Shows where visitors are coming from
- `GET /api/analytics/popular-pages`: Lists the most visited pages
- `GET /api/analytics/devices`: Shows device type breakdown
- `POST /api/analytics/track`: Records a page view

## Customization

### Theming

The dashboard uses a customizable theme defined in `theme.json`. You can modify the primary color, appearance, and other design elements by editing this file.

### Adding New Metrics

1. Define the new metric in the data schema (`shared/schema.ts`)
2. Implement the data aggregation in the storage layer (`server/storage.ts`)
3. Add the API endpoint in `server/routes.ts`
4. Create a new component in `client/src/components/analytics/`
5. Add the component to the dashboard layout in `client/src/pages/dashboard.tsx`

## Deployment

This application can be easily deployed to platforms like Vercel, Netlify, or any Node.js hosting service.

1. Build the application:
   ```
   npm run build
   ```

2. Deploy the built files to your hosting service of choice.

## Future Improvements

- Integration with actual tracking script for real-time data collection
- User authentication and multiple website tracking
- Data export functionality (CSV, PDF)
- Custom alerts and notifications
- Additional visualization options

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by Google Analytics and Plausible Analytics
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Data visualization using [Recharts](https://recharts.org/)