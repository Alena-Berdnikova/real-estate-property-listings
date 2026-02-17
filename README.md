# Real Estate Property Listings

A real estate property listings web application built with Next.js 15, React 19, and TypeScript.

## Features

- **City Search**: Search for property listings by city and state
- **Address Search**: Look up specific property details by full address
- **Image Gallery**: Browse property photos with navigation arrows
- **Pagination**: Navigate through search results (5 per page)
- **Input Validation**: Real-time validation for city and address formats
- **Address Autocomplete**: Smart address suggestions while typing
- **City Autocomplete**: City suggestions from US cities database

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- CSS Modules

## API Integrations

| API | Purpose |
|-----|---------|
| Apify Real Estate Aggregator | City search listings from Realtor.com |
| SmartyStreets Autocomplete Pro | Address autocomplete suggestions |
| Estated API | Detailed property data lookup |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# SmartyStreets (Autocomplete)
NEXT_PUBLIC_SMARTY_EMBEDDED_KEY=your_embedded_key

# Apify (City Search)
APIFY_API_TOKEN=your_apify_token

# Estated (Property Lookup)
ESTATED_API_TOKEN=your_estated_token
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Input Validation

### City Search
- Format: `City, ST` (e.g., "Austin, TX")
- City: minimum 2 characters, letters only
- State: 2-letter US state abbreviation (validated against list)

### Address Search
- Format: `Street, City, ST 12345` (e.g., "123 Main St, Austin, TX 78701")
- Street: must start with number, minimum 3 characters
- City: minimum 2 characters
- State: 2-letter US state abbreviation (validated)
- Zip: 5-digit US zip code

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── city-search/      # Apify API route
│   │   └── property-lookup/  # Estated API route
│   ├── page.tsx              # Main search page
│   └── page.module.css
├── components/
│   ├── SearchForm.tsx        # Search form orchestrator
│   ├── CitySearchInput.tsx   # City input with autocomplete
│   ├── AddressSearchInput.tsx # Address input with autocomplete
│   ├── ListingCard.tsx       # City listing card with gallery
│   └── PropertyCard.tsx      # Property details card
├── constants/
│   ├── usStates.ts           # US states data
│   └── usCities.json         # US cities for autocomplete
└── services/
    ├── citySearch.ts         # City search client
    ├── propertyLookup.ts     # Property lookup client
    ├── autocomplete.ts       # Address autocomplete client
    └── validation.ts         # Input validation
```

## Known Limitations

- No property images available for full address search results

## Areas for Improvement

- [ ] Add authentication and authorization
- [ ] Add search filters (price range, number of bedrooms, etc.)
- [ ] Add search by ZIP code
- [ ] Add sorting options for results
- [ ] Add interactive map to display properties
- [ ] Add price analytics (e.g., "Below market value by $X")
- [ ] Add "Similar Listings" feature on property cards
- [ ] Add multiple data sources (currently only Realtor.com)
- [ ] Improve styling and UI/UX