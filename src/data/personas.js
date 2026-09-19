// Commuter Personas Configuration
// Predefined commuter archetypes for testing and simulation
// 1. Alex: Lives in Punggol, reports to Ngee Ann Polytechnic by 9:00am. Departs at 7:30am from Meridian LRT.
// 2. Kay: Lives in Eunos, travels to one-north. Flexible 9:00am - 10:00am, avoids crowds at all costs, prefers minimal transfers.
// 3. None: Uses actual live current location and current real-time clock.

export const COMMUTER_PERSONAS = [
  {
    id: 'persona_alex',
    name: 'Alex',
    tagline: 'Punggol ➔ Ngee Ann Poly',
    description: 'Lives in Punggol, reports to Ngee Ann Polytechnic by 9:00am every day. Departs at 7:30am.',
    simulatedTime: '07:30',
    arriveBy: '09:00',
    preference: 'fastest',
    origin: {
      id: 'origin_alex_meridian',
      name: 'Meridian LRT Station',
      shortName: 'Meridian LRT',
      address: 'Meridian LRT (PE2), Punggol Central, Singapore',
      lat: 1.4052,
      lng: 103.8972,
      nearestStationId: 'punggol',
      isGps: false,
    },
    destination: {
      id: 'dest_ngee_ann_poly',
      name: 'Ngee Ann Polytechnic',
      shortName: 'Ngee Ann Poly',
      postalCode: '599489',
      address: '535 Clementi Road, Singapore 599489',
      category: 'Educational Institute',
      nearestStationId: 'beauty_world',
      subtitle: 'Clementi / Beauty World',
      dailyTapOuts: 32000,
      lat: 1.3332,
      lng: 103.7746,
    },
  },
  {
    id: 'persona_kay',
    name: 'Kay',
    tagline: 'Eunos ➔ one-north',
    description: 'Lives in Eunos, heads to one-north. Flexible 9am–10am. Avoids crowds at all costs and prefers direct route with minimal transfers.',
    simulatedTime: '08:45',
    arriveBy: '09:45',
    preference: 'crowd', // Least crowded / crowd-avoidance & direct minimal transfers
    origin: {
      id: 'origin_kay_eunos',
      name: 'Eunos MRT Station',
      shortName: 'Eunos',
      address: 'Eunos MRT (EW7), Jalan Eunos, Singapore',
      lat: 1.319778,
      lng: 103.903252,
      nearestStationId: 'eunos',
      isGps: false,
    },
    destination: {
      id: 'dest_one_north',
      name: 'one-north',
      shortName: 'one-north',
      postalCode: '138647',
      address: 'Fusionopolis / Biopolis, Singapore 138647',
      category: 'Tech & Innovation Hub',
      nearestStationId: 'one_north',
      subtitle: 'Circle Line',
      dailyTapOuts: 43200,
      lat: 1.299583,
      lng: 103.787222,
    },
  },
  {
    id: 'none',
    name: 'None',
    tagline: 'Current Location & Real-Time Clock',
    description: 'Clear persona. Uses your actual GPS location and current time.',
    simulatedTime: null,
    arriveBy: null,
    preference: 'fastest',
    origin: null,
    destination: null,
  },
];

export function getPersonaById(id) {
  return COMMUTER_PERSONAS.find(p => p.id === id) || COMMUTER_PERSONAS[2];
}

