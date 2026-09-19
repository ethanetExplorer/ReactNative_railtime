// Comprehensive Singapore Public Bus Database
// Interchanges, popular bus stops, trunk/express routes, and helper lookup functions.

export const BUS_STOPS = [
  // Western Singapore & Hubs
  {
    code: '43009',
    name: 'Bt Batok Bus Interchange',
    road: 'Bt Batok Central',
    lat: 1.3496,
    lng: 103.7497,
    services: ['61', '77', '106', '173', '177', '189', '852', '941', '945', '947', '990'],
    nearestMrt: 'bukit_batok',
  },
  {
    code: '43179',
    name: 'Opp West Mall',
    road: 'Bt Batok Ctrl',
    lat: 1.3508,
    lng: 103.7485,
    services: ['176', '187', '188', '945', '985'],
    nearestMrt: 'bukit_batok',
  },
  {
    code: '43399',
    name: 'Blk 102',
    road: 'Bt Batok East Ave 6',
    lat: 1.3458,
    lng: 103.7533,
    services: ['61', '177', '947'],
    nearestMrt: 'bukit_batok',
  },
  {
    code: '28009',
    name: 'Jurong East Bus Interchange',
    road: 'Jurong Gateway Rd',
    lat: 1.3331,
    lng: 103.7423,
    services: ['41', '49', '51', '52', '66', '78', '79', '97', '98', '105', '143', '160', '183', '197', '333', '334', '335', '506'],
    nearestMrt: 'jurong_east',
  },
  {
    code: '17009',
    name: 'Clementi Bus Interchange',
    road: 'Clementi Ave 3',
    lat: 1.3151,
    lng: 103.7651,
    services: ['14', '52', '96', '99', '147', '156', '165', '166', '175', '196', '282', '284', '285'],
    nearestMrt: 'clementi',
  },
  {
    code: '44009',
    name: 'Choa Chu Kang Bus Interchange',
    road: 'Choa Chu Kang Loop',
    lat: 1.3855,
    lng: 103.7445,
    services: ['67', '172', '188', '190', '300', '301', '302', '307', '925', '927', '983', '985'],
    nearestMrt: 'choa_chu_kang',
  },
  {
    code: '22009',
    name: 'Boon Lay Bus Interchange',
    road: 'Jurong West Ctrl 3',
    lat: 1.3392,
    lng: 103.7058,
    services: ['30', '79', '154', '157', '174', '179', '181', '192', '193', '194', '198', '199', '240', '241', '242', '243'],
    nearestMrt: 'boon_lay',
  },

  // Central & City Hubs
  {
    code: '09023',
    name: 'Orchard Stn / Lucky Plaza',
    road: 'Orchard Rd',
    lat: 1.3041,
    lng: 103.8340,
    services: ['7', '14', '16', '36', '65', '106', '111', '123', '174', '175', '190', '502'],
    nearestMrt: 'orchard',
  },
  {
    code: '40189',
    name: 'Newton Stn Exit B',
    road: 'Scotts Rd',
    lat: 1.3134,
    lng: 103.8378,
    services: ['5', '54', '124', '143', '162', '167', '190', '518', '960'],
    nearestMrt: 'newton',
  },
  {
    code: '08057',
    name: 'Dhoby Ghaut Stn Exit B',
    road: 'Orchard Rd',
    lat: 1.2995,
    lng: 103.8458,
    services: ['7', '14', '16', '36', '65', '106', '111', '124', '162', '167', '174', '175', '190', '502'],
    nearestMrt: 'dhoby_ghaut',
  },
  {
    code: '03031',
    name: 'Fullerton Sq / Raffles Place',
    road: 'Fullerton Rd',
    lat: 1.2858,
    lng: 103.8532,
    services: ['10', '57', '70', '100', '107', '130', '131', '167', '196'],
    nearestMrt: 'raffles_place',
  },
  {
    code: '03511',
    name: 'Marina Bay Sands Theatre',
    road: 'Bayfront Ave',
    lat: 1.2838,
    lng: 103.8598,
    services: ['97', '106', '133', '502', '518'],
    nearestMrt: 'bayfront',
  },
  {
    code: '01112',
    name: 'Bugis Stn Exit A',
    road: 'Victoria St',
    lat: 1.3006,
    lng: 103.8560,
    services: ['2', '12', '33', '130', '133', '960'],
    nearestMrt: 'bugis',
  },
  {
    code: '05049',
    name: 'Chinatown Stn Exit E',
    road: 'New Bridge Rd',
    lat: 1.2848,
    lng: 103.8440,
    services: ['2', '12', '33', '54', '61', '143', '147', '190'],
    nearestMrt: 'chinatown',
  },
  {
    code: '14009',
    name: 'HarbourFront Bus Interchange',
    road: 'Seah Im Rd',
    lat: 1.2662,
    lng: 103.8188,
    services: ['65', '80', '93', '124', '188', '855', '963'],
    nearestMrt: 'harbourfront',
  },

  // Northern & Eastern Hubs
  {
    code: '46009',
    name: 'Woodlands Integrated Transport Hub',
    road: 'Woodlands Sq',
    lat: 1.4368,
    lng: 103.7865,
    services: ['161', '168', '169', '178', '187', '856', '900', '901', '903', '911', '912', '913', '925', '960', '961', '963', '964', '965', '966', '969'],
    nearestMrt: 'woodlands',
  },
  {
    code: '53009',
    name: 'Bishan Bus Interchange',
    road: 'Bishan Place',
    lat: 1.3508,
    lng: 103.8488,
    services: ['50', '52', '53', '54', '55', '56', '57', '58', '59', '410G', '410W'],
    nearestMrt: 'bishan',
  },
  {
    code: '54009',
    name: 'Ang Mo Kio Bus Interchange',
    road: 'Ang Mo Kio Ave 8',
    lat: 1.3698,
    lng: 103.8495,
    services: ['22', '24', '25', '73', '86', '130', '133', '135', '136', '138', '166', '169', '261', '262', '265', '268', '269'],
    nearestMrt: 'ang_mo_kio',
  },
  {
    code: '66009',
    name: 'Serangoon Bus Interchange',
    road: 'Serangoon Ave 2',
    lat: 1.3503,
    lng: 103.8732,
    services: ['100', '101', '103', '105', '109', '158', '315', '317'],
    nearestMrt: 'serangoon',
  },
  {
    code: '75009',
    name: 'Tampines Bus Interchange',
    road: 'Tampines Central 1',
    lat: 1.3541,
    lng: 103.9431,
    services: ['3', '4', '8', '10', '19', '20', '23', '28', '29', '31', '37', '38', '65', '67', '68', '69', '72', '81', '291', '292', '293'],
    nearestMrt: 'tampines',
  },
  {
    code: '84009',
    name: 'Bedok Bus Interchange',
    road: 'Bedok North Ave 1',
    lat: 1.3242,
    lng: 103.9298,
    services: ['7', '9', '14', '16', '17', '18', '26', '30', '32', '33', '35', '38', '40', '60', '66', '69', '87', '196', '197', '222', '225', '228', '229'],
    nearestMrt: 'bedok',
  },
  {
    code: '95011',
    name: 'Changi Airport PTB3',
    road: 'Airport Blvd',
    lat: 1.3565,
    lng: 103.9870,
    services: ['24', '27', '34', '36', '53', '110', '858'],
    nearestMrt: 'changi_airport',
  },

  // Upper Thomson & Tagore Area (Directly matching commuter reference corridor)
  {
    code: '56071',
    name: 'Bef Old Upp Thomson Rd',
    road: 'Upp Thomson Rd',
    lat: 1.3855,
    lng: 103.8312,
    services: ['138', '167', '169', '860', '980'],
    nearestMrt: 'springleaf',
  },
  {
    code: '56079',
    name: 'Aft Old Upp Thomson Rd',
    road: 'Upp Thomson Rd',
    lat: 1.3852,
    lng: 103.8318,
    services: ['138', '167', '169', '860', '980'],
    nearestMrt: 'springleaf',
  },
  {
    code: '56061',
    name: 'Aft Tagore Dr',
    road: 'Upp Thomson Rd',
    lat: 1.3831,
    lng: 103.8329,
    services: ['138', '167', '169', '860', '980'],
    nearestMrt: 'springleaf',
  },
  {
    code: '56069',
    name: 'Bef Tagore Dr',
    road: 'Upp Thomson Rd',
    lat: 1.3828,
    lng: 103.8335,
    services: ['138', '167', '169', '860', '980'],
    nearestMrt: 'springleaf',
  },
  {
    code: '56051',
    name: 'Opp Tagore Rd',
    road: 'Upp Thomson Rd',
    lat: 1.3804,
    lng: 103.8346,
    services: ['138', '167', '169', '860', '980'],
    nearestMrt: 'springleaf',
  },
  {
    code: '56059',
    name: 'Bef Tagore Rd',
    road: 'Upp Thomson Rd',
    lat: 1.3801,
    lng: 103.8352,
    services: ['138', '167', '169', '860', '980'],
    nearestMrt: 'springleaf',
  },

  // Additional Bukit Batok Area Stops (Default Commuter Location)
  {
    code: '43419',
    name: 'Blk 109',
    road: 'Bt Batok Central',
    lat: 1.3482,
    lng: 103.7512,
    services: ['61', '178', '852', '947'],
    nearestMrt: 'bukit_batok',
  },
  {
    code: '43189',
    name: 'West Mall',
    road: 'Bt Batok Ctrl',
    lat: 1.3503,
    lng: 103.7491,
    services: ['176', '187', '188', '945', '985'],
    nearestMrt: 'bukit_batok',
  },
  {
    code: '43159',
    name: 'Opp Blk 140',
    road: 'Bt Batok West Ave 6',
    lat: 1.3475,
    lng: 103.7468,
    services: ['66', '157', '174', '178', '506'],
    nearestMrt: 'bukit_batok',
  },
];

// Major High-Demand Bus Routes in Singapore (Express & Trunk)
export const MAJOR_BUS_SERVICES = {
  '190': {
    serviceNo: '190',
    operator: 'SMRT',
    category: 'Express / Trunk',
    color: '#E91E63',
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    direction1: {
      origin: 'Choa Chu Kang Int',
      destination: 'Kampong Bahru Ter',
      stops: [
        { code: '44009', name: 'Choa Chu Kang Int' },
        { code: '43009', name: 'Bt Batok Central (via linkway)' },
        { code: '43179', name: 'Opp West Mall' },
        { code: '44539', name: 'Opp Phoenix Stn' },
        { code: '44019', name: 'Bukit Panjang Rd' },
        { code: '40189', name: 'Newton Stn Exit B' },
        { code: '09023', name: 'Orchard Stn / Lucky Plaza' },
        { code: '08057', name: 'Dhoby Ghaut Stn' },
        { code: '04121', name: 'Clarke Quay Stn' },
        { code: '05049', name: 'Chinatown Stn' },
      ],
      durationMin: 32,
      peakFreq: '4 - 7 min',
    },
    description: 'High-speed express link connecting Western hubs directly to Orchard & Chinatown via BKE/PIE.',
  },

  '106': {
    serviceNo: '106',
    operator: 'TTS',
    category: 'Trunk',
    color: '#E91E63',
    origin: 'Bt Batok Int',
    destination: 'Shenton Way Ter',
    direction1: {
      origin: 'Bt Batok Int',
      destination: 'Shenton Way Ter',
      stops: [
        { code: '43009', name: 'Bt Batok Bus Interchange' },
        { code: '43179', name: 'Opp West Mall' },
        { code: '28009', name: 'Jurong Gateway' },
        { code: '17009', name: 'Clementi MRT' },
        { code: '11261', name: 'Holland Village MRT' },
        { code: '09023', name: 'Orchard Stn / Lucky Plaza' },
        { code: '08057', name: 'Dhoby Ghaut Stn' },
        { code: '03511', name: 'Marina Bay Sands' },
        { code: '03031', name: 'Raffles Place' },
      ],
      durationMin: 45,
      peakFreq: '6 - 9 min',
    },
    description: 'Direct trunk connector linking Bukit Batok and Clementi to Holland Village, Orchard, and Marina Bay.',
  },

  '174': {
    serviceNo: '174',
    operator: 'SBST',
    category: 'Trunk',
    color: '#E91E63',
    origin: 'Boon Lay Int',
    destination: 'New Bridge Rd Ter',
    direction1: {
      origin: 'Boon Lay Int',
      destination: 'New Bridge Rd Ter',
      stops: [
        { code: '22009', name: 'Boon Lay Int' },
        { code: '43009', name: 'Bt Batok Central' },
        { code: '42099', name: 'Beauty World Stn' },
        { code: '09023', name: 'Orchard Stn' },
        { code: '08057', name: 'Dhoby Ghaut Stn' },
        { code: '05049', name: 'Chinatown Stn' },
      ],
      durationMin: 50,
      peakFreq: '7 - 10 min',
    },
    description: 'Connects Jurong West & Bukit Batok to Beauty World, Orchard and Chinatown.',
  },

  '960': {
    serviceNo: '960',
    operator: 'SMRT',
    category: 'Express / Trunk',
    color: '#E91E63',
    origin: 'Woodlands Int',
    destination: 'Marina Centre Ter',
    direction1: {
      origin: 'Woodlands Int',
      destination: 'Marina Centre Ter',
      stops: [
        { code: '46009', name: 'Woodlands Int' },
        { code: '44019', name: 'Bukit Panjang' },
        { code: '40189', name: 'Newton Stn' },
        { code: '44029', name: 'Little India Stn' },
        { code: '01112', name: 'Bugis Stn' },
        { code: '02099', name: 'Marina Centre Ter' },
      ],
      durationMin: 42,
      peakFreq: '6 - 8 min',
    },
    description: 'Direct express route from Woodlands down to Little India, Bugis and Marina Centre.',
  },

  '502': {
    serviceNo: '502',
    operator: 'SBST',
    category: 'Express',
    color: '#E91E63',
    origin: 'Pioneer Stn',
    destination: 'Bayfront Ave (MBS)',
    direction1: {
      origin: 'Pioneer Stn',
      destination: 'Bayfront Ave (MBS)',
      stops: [
        { code: '22009', name: 'Boon Lay' },
        { code: '28009', name: 'Jurong East' },
        { code: '09023', name: 'Orchard Stn' },
        { code: '08057', name: 'Dhoby Ghaut Stn' },
        { code: '03511', name: 'Marina Bay Sands' },
      ],
      durationMin: 38,
      peakFreq: '9 - 12 min',
    },
    description: 'Fast express bus bypassing multiple train transfers via AYE to Orchard and Marina Bay.',
  },

  '61': {
    serviceNo: '61',
    operator: 'SMRT',
    category: 'Trunk',
    color: '#E91E63',
    origin: 'Bt Batok Int',
    destination: 'Eunos Int',
    direction1: {
      origin: 'Bt Batok Int',
      destination: 'Eunos Int',
      stops: [
        { code: '43009', name: 'Bt Batok Int' },
        { code: '14009', name: 'HarbourFront Stn' },
        { code: '05049', name: 'Chinatown Stn' },
        { code: '01112', name: 'Bugis Stn' },
      ],
      durationMin: 55,
      peakFreq: '8 - 12 min',
    },
    description: 'Cross-island trunk from Bukit Batok via HarbourFront to Chinatown and Bugis.',
  },

  '990': {
    serviceNo: '990',
    operator: 'TTS',
    category: 'Short Trunk',
    color: '#E91E63',
    origin: 'Bt Batok Int',
    destination: 'Jurong Gateway Rd',
    direction1: {
      origin: 'Bt Batok Int',
      destination: 'Jurong Gateway Rd',
      stops: [
        { code: '43009', name: 'Bt Batok Int' },
        { code: '43179', name: 'Opp West Mall' },
        { code: '28009', name: 'Jurong East MRT' },
      ],
      durationMin: 12,
      peakFreq: '6 - 9 min',
    },
    description: 'Direct, frequent shuttle connector between Bukit Batok and Jurong East commercial hub.',
  },
};

// Helper: Haversine distance
function haversineDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Helper: Get nearest bus stops from coordinate
export function getNearestBusStops(lat, lng, limit = 6) {
  const sorted = BUS_STOPS.map(stop => ({
    ...stop,
    distanceKm: haversineDistKm(lat, lng, stop.lat, stop.lng),
    distanceM: Math.round(haversineDistKm(lat, lng, stop.lat, stop.lng) * 1000),
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  return sorted.slice(0, limit);
}

// Helper: Get bus stop by 5-digit code
export function getBusStopByCode(code) {
  if (!code) return null;
  const clean = String(code).trim();
  return BUS_STOPS.find(s => s.code === clean) || null;
}

// Helper: Search bus stops by name, road or code
export function searchBusStops(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return BUS_STOPS.filter(
    s =>
      s.code.includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.road.toLowerCase().includes(q) ||
      s.services.some(srv => srv.toLowerCase() === q)
  );
}

// Helper: Get bus service details
export function getBusService(serviceNo) {
  if (!serviceNo) return null;
  return MAJOR_BUS_SERVICES[String(serviceNo).trim()] || null;
}

