# Kiasu Transit

Kiasu Transit is a Singapore commuter companion that helps people plan practical journeys across MRT, bus, and walking routes. It combines local transport data, live location search, disruption awareness, and route alternatives in one mobile and web-friendly Expo app.

## Purpose

The app is designed for commuters who want more than a single fastest route. It helps answer:

- Is the MRT network operating normally?
- Which route is best when a line is disrupted?
- How long will the complete door-to-door journey take?
- Are there bus or walking alternatives?
- What is the nearest station or bus stop from my current location?

## Features

### Journey planning

- Search Singapore destinations, addresses, landmarks, and postal codes.
- Use the device location to set the commuter origin.
- Plan door-to-door journeys from the origin to the selected destination.
- View journey legs, transfer points, estimated durations, arrival times, and route summaries.
- Compare recommended and alternative routes.

### MRT routing

- A* transit routing across Singapore MRT stations and lines.
- Transfer penalties and generalized travel costs to produce practical routes.
- Multiple route candidates for comparing alternatives.
- Support for line and station interchange journeys.

### Disruption-aware alternatives

- Simulated operational scenarios for testing commuter decisions.
- MRT disruption notices and affected-corridor warnings.
- Rerouting around disrupted rail corridors.
- Bridging shuttle alternatives where appropriate.
- Direct bus alternatives and short walking routes when they are useful.

### Live transport and location data

- LTA DataMall integration for train service alerts and station crowd levels.
- Singapore location search through local data and live OneMap/OSM search.
- Nearby bus information and route details.
- Graceful fallback to local scenario data when live services are unavailable.

### Commuter experience

- Recent destination history stored in browser storage.
- Popular Singapore destinations for quick planning.
- Settings for transport scenarios and optional LTA credentials.
- Responsive React Native for Web interface.
- Installable-style web metadata with branded theme colors and favicon.

## Technology

Kiasu Transit is built with Expo SDK 57, React 19, and React Native 0.86. React Native for Web enables the same JavaScript application to run as a responsive browser experience alongside the iOS and Android targets. Expo and Metro handle development and platform bundling.

The routing engine uses A* search across MRT station and line nodes. It combines estimated travel time, transfer penalties, waiting time, and disruption costs to prioritize practical routes. A heuristic estimates the remaining journey distance, while route reopening supports better paths discovered during the search. Multiple A* results are used to present recommended and alternative journeys.

Local MRT, bus, destination, and disruption data is combined with optional LTA DataMall and OneMap/OSM services. The site is hosted using Google Cloud.

## Getting started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in Web Browser (Recommended for quick testing):**
   ```bash
   npm run web
   ```
   Or launch with Expo and press `w`:
   ```bash
   npx expo start
   ```

3. **Run on iOS Simulator / Android Emulator:**
   ```bash
   npm run ios
   # or
   npm run android
   ```

4. **Build static web export:**
   ```bash
   npm run export:web
   ```

---

## Interactive Feature Guide: What to Press to Try Features

Follow these steps to test all key capabilities of Kiasu Transit:

### 1. Try Commuter Personas & Simulated Schedules
- Tap the **Settings (gear icon)** at the top-right of the Home Screen.
- Tap the **Disruption** tab in the segmented menu.
- Under **COMMUTER PERSONA**, select one of the personas:
  - **Alex (Punggol ➔ Ngee Ann Poly)**: Tap this card. The app sets the start to *Meridian LRT (PE2)* and destination to *Ngee Ann Polytechnic*, simulating a `07:30 AM` morning departure to reach by `09:00 AM` (`NEL ➔ DTL`).
  - **Kay (Eunos ➔ one-north)**: Tap this card. The app sets start to *Eunos (EW7)* and destination to *one-north (CC23)* with crowd-avoidance routing between `9:00 AM – 10:00 AM` (`EWL ➔ CCL` transfer at Buona Vista).
  - **None**: Reverts to your actual live GPS location and current device clock.

### 2. Simulate MRT Disruptions & Proactive Rerouting
- Open **Settings (gear icon)** ➔ **Disruption** tab.
- Scroll down to **DISRUPTION SCENARIO** and choose an incident to simulate:
  - **NSL Track Disruption**: Simulates Jurong East ↔ Choa Chu Kang fault with free bridging buses.
  - **EWL Breakdown**: Simulates Jurong East ↔ Queenstown disruption.
  - **NEL Line Disruption**: Simulates a complete North East Line breakdown and reroutes via alternative lines/buses.
  - **CCL Sector Fault**: Simulates Dhoby Ghaut ➔ Promenade segment disruption.
- Tap **Done** or close the modal. Notice the homepage disruption banner and the dynamic rerouting recommendations.

### 3. Manage Regular Commute Places
- Open **Settings (gear icon)** ➔ **Regular Places** tab.
- Add, view, or remove places you regularly visit:
  - Set custom names (e.g. "Office", "Campus", "Gym").
  - Set target destinations and arrive-by times with day-of-the-week schedule pills.
  - Tap any configured place to immediately trigger door-to-door routing to that venue.

### 4. Search & Plan Door-to-Door Journeys
- On the **Home Screen**, tap the **Search Bar**.
- Type any Singapore landmark, MRT station, address, or 6-digit postal code (e.g., `"599489"`, `"Meridian"`, `"one-north"`, `"Raffles Place"`).
- Tap a search result to open the **Route Diagram Screen**.
- Tap **Start** or **Destination** to edit endpoints, swap them with the swap button, or compare alternative transit routes and transfer walking steps.

### 5. Use Live GPS Detection
- On the **Home Screen**, tap the **GPS crosshair icon** inside the search bar.
- Grant browser/device location permission. The app automatically detects your actual neighborhood and nearest MRT station.

### 6. Configure LTA DataMall Live Keys (Optional)
- Open **Settings (gear icon)** ➔ **DataMall Keys** tab.
- Enter your LTA `AccountKey` and toggle **Live API Mode** to pull real-time train alerts and bus arrivals from LTA DataMall directly.

The project includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

Build the static web export locally:

```bash
npm run export:web
```

To deploy through GitHub Pages:

1. Push the repository to GitHub.
2. Open **Settings > Pages**.
3. Set the Pages source to **GitHub Actions**.
4. Push to the `main` branch or manually run the deployment workflow from the **Actions** tab.

The workflow builds the Expo web export into `dist` and publishes it using the official GitHub Pages actions.

If the repository is deployed under a project URL such as `/ReactNative_railtime/`, set the matching Expo web base path in `app.json` under `expo.experiments.baseUrl`. For a custom domain or root user site, use an empty base path instead.

## LTA DataMall credentials

Live LTA requests are optional. The app can run with scenario data without credentials.

For live train alerts and crowd data, enter credentials through the app's Settings screen. Credentials are stored in browser local storage and should not be committed to the repository.

The tracked credential helper uses empty defaults so GitHub Actions can build the web app without access to private keys. The old local `keys/` directory is intentionally ignored by Git.

## Project structure

```text
App.js                         App state and screen navigation
src/components/                Reusable interface components
src/data/                      MRT, bus, destination, and scenario data
src/screens/                   Home and route diagram screens
src/services/                  Routing, location, LTA, and walking services
src/theme/                     Shared visual theme values
.github/workflows/             GitHub Pages deployment workflow
app.json                       Expo and web configuration
package.json                   Scripts and dependencies
```

## Current scope

This project is a commuter planning companion, not an official transit authority service. Journey durations, crowd levels, disruption information, and live service availability may change. Always check official LTA announcements and station information when making time-sensitive travel decisions.
