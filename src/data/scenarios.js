// Realistic Demonstration Scenarios for Planned and Unplanned Events
// Accurately mirrors LTA DataMall schemas for TrainServiceAlerts, PCDRealTime, PCDForecast, BusArrival, FacilitiesMaintenance.

export const SCENARIOS = {
  NORMAL: {
    id: 'NORMAL',
    name: 'Normal Service',
    badge: 'All Systems Normal',
    type: 'normal',
    description: 'Clear morning commute. All MRT & LRT lines running normal frequencies with low-to-moderate platform crowding.',
    trainServiceAlerts: {
      Status: 1,
      AffectedSegments: [],
      Message: [],
    },
    weather: {
      condition: 'Fair',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      jurong_east: 'm',
      bukit_batok: 'l',
      choa_chu_kang: 'm',
      woodlands: 'm',
      bishan: 'm',
      orchard: 'm',
      city_hall: 'm',
      raffles_place: 'm',
      dhoby_ghaut: 'm',
      buona_vista: 'l',
    },
    facilitiesMaintenance: [],
  },

  NSL_UNPLANNED_FAULT: {
    id: 'NSL_UNPLANNED_FAULT',
    name: 'NSL Signalling Fault (08:15)',
    badge: 'Major Rail Disruption',
    type: 'unplanned',
    description: 'Signalling fault halts trains between Jurong East and Choa Chu Kang. Free MRT Shuttle and regular public bus bridging activated.',
    trainServiceAlerts: {
      Status: 2,
      AffectedSegments: [
        {
          Line: 'NSL',
          Direction: 'Both',
          Stations: 'NS1,NS2,NS3,NS4', // Jurong East, Bukit Batok, Bukit Gombak, Choa Chu Kang
          FreePublicBus: 'NS1,NS2,NS3,NS4',
          FreeMRTShuttle: 'NS1,NS2,NS3,NS4',
          MRTShuttleDirection: 'Both',
        },
      ],
      Message: [
        {
          Content: '08:15 hrs: No train service between Jurong East and Choa Chu Kang due to a signalling fault. Free regular bus and MRT shuttle services are available at affected stations.',
          CreatedDate: '2026-09-19 08:15:24',
        },
      ],
    },
    weather: {
      condition: 'Cloudy',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      jurong_east: 'h', // Platform packed
      bukit_batok: 'h',
      choa_chu_kang: 'h',
      woodlands: 'm',
      bishan: 'h',
      orchard: 'm',
      city_hall: 'h',
      raffles_place: 'm',
      dhoby_ghaut: 'm',
    },
    proactiveDecision: {
      recommendedAction: 'Take Bus 190 from Bt Batok (+11 min)',
      secondaryAction: 'Take Free MRT Shuttle to CCK or connect to Downtown Line via Beauty World',
      tradeoff: '+11 min vs normal schedule, saves ~28 min over waiting on disrupted NSL platform',
      reasoning: 'Signalling fault between NS1 (Jurong East) and NS4 (Choa Chu Kang). Platform crowd level is High (h). Bus 190 express bypasses the bottleneck via BKE/PIE directly into the city.',
    },
    facilitiesMaintenance: [],
  },

  EWL_JURONG_QUEENSTOWN: {
    id: 'EWL_JURONG_QUEENSTOWN',
    name: 'EWL Disruption (Jurong East ⇄ Queenstown)',
    badge: 'EWL Major Fault',
    type: 'unplanned',
    description: 'Traction power fault suspends EWL trains between EW24 Jurong East and EW19 Queenstown. Free bridging buses active at Clementi, Dover, Buona Vista, and Commonwealth.',
    trainServiceAlerts: {
      Status: 2,
      AffectedSegments: [
        {
          Line: 'EWL',
          Direction: 'Both',
          Stations: 'EW24,EW23,EW22,EW21,EW20,EW19', // Jurong East, Clementi, Dover, Buona Vista, Commonwealth, Queenstown
          FreePublicBus: 'EW24,EW23,EW22,EW21,EW20,EW19',
          FreeMRTShuttle: 'EW24,EW23,EW22,EW21,EW20,EW19',
          MRTShuttleDirection: 'Both',
        },
      ],
      Message: [
        {
          Content: '08:30 hrs: No train service on East-West Line between EW24 Jurong East and EW19 Queenstown due to a traction power fault. Free bridging bus services available at all affected stations.',
          CreatedDate: '2026-09-19 08:30:15',
        },
      ],
    },
    weather: {
      condition: 'Cloudy',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      jurong_east: 'h',
      clementi: 'h',
      buona_vista: 'h',
      queenstown: 'h',
      redhill: 'm',
      raffles_place: 'm',
      city_hall: 'm',
    },
    proactiveDecision: {
      recommendedAction: 'Transfer to Circle Line at Buona Vista or take bridging bus to Queenstown',
      secondaryAction: 'Connect via Downtown Line (Beauty World / King Albert Park) to downtown',
      tradeoff: 'Bypasses severe platform congestion along western East-West Line corridor',
      reasoning: 'East-West Line train service halted between EW24 Jurong East and EW19 Queenstown. Free bridging buses activated across Clementi, Dover, Buona Vista, Commonwealth, and Queenstown.',
    },
    facilitiesMaintenance: [],
  },

  NEL_ENTIRE_LINE: {
    id: 'NEL_ENTIRE_LINE',
    name: 'NEL Island-wide Disruption',
    badge: 'Entire Line Down',
    type: 'unplanned',
    description: 'System-wide power tripping halts all train services along the entire North East Line from HarbourFront to Punggol. Free bridging buses and trunk services activated.',
    trainServiceAlerts: {
      Status: 2,
      AffectedSegments: [
        {
          Line: 'NEL',
          Direction: 'Both',
          Stations: 'NE1,NE3,NE4,NE5,NE6,NE7,NE8,NE9,NE10,NE11,NE12,NE13,NE14,NE15,NE16,NE17',
          FreePublicBus: 'ALL_NEL',
          FreeMRTShuttle: 'ALL_NEL',
          MRTShuttleDirection: 'Both',
        },
      ],
      Message: [
        {
          Content: '08:40 hrs: No train service on the ENTIRE North East Line due to power tripping. Free regular public buses and free MRT bridging buses operating at all NEL stations.',
          CreatedDate: '2026-09-19 08:40:00',
        },
      ],
    },
    weather: {
      condition: 'Fair',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      harbourfront: 'h',
      outram_park: 'h',
      chinatown: 'h',
      dhoby_ghaut: 'h',
      little_india: 'h',
      serangoon: 'h',
      hougang: 'h',
      sengkang: 'h',
      punggol: 'h',
    },
    proactiveDecision: {
      recommendedAction: 'Reroute via Circle Line at Serangoon or Downtown Line at Little India / Chinatown',
      secondaryAction: 'Take Express Trunk Bus 147 / 80 towards CBD corridor',
      tradeoff: 'Avoids complete NEL shutdown; connections via CCL, DTL, and NSL operating normally',
      reasoning: 'Total North East Line shutdown. Directing passengers to North-South Line, Circle Line, Downtown Line, and bridging buses.',
    },
    facilitiesMaintenance: [],
  },

  CCL_DHOBY_PROMENADE: {
    id: 'CCL_DHOBY_PROMENADE',
    name: 'Circle Line Disruption (Dhoby Ghaut ⇄ Promenade)',
    badge: 'CCL Track Fault',
    type: 'unplanned',
    description: 'Track circuit failure suspends Circle Line trains between CC1 Dhoby Ghaut and CC4 Promenade (including Bras Basah & Esplanade). Free bridging buses activated.',
    trainServiceAlerts: {
      Status: 2,
      AffectedSegments: [
        {
          Line: 'CCL',
          Direction: 'Both',
          Stations: 'CC1,CC2,CC3,CC4', // Dhoby Ghaut, Bras Basah, Esplanade, Promenade
          FreePublicBus: 'CC1,CC2,CC3,CC4',
          FreeMRTShuttle: 'CC1,CC2,CC3,CC4',
          MRTShuttleDirection: 'Both',
        },
      ],
      Message: [
        {
          Content: '09:00 hrs: Circle Line train service unavailable between CC1 Dhoby Ghaut and CC4 Promenade due to a track circuit fault. Free bridging buses active between Dhoby Ghaut and Promenade.',
          CreatedDate: '2026-09-19 09:00:10',
        },
      ],
    },
    weather: {
      condition: 'Fair',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      dhoby_ghaut: 'h',
      bras_basah: 'm',
      esplanade: 'm',
      promenade: 'h',
      bayfront: 'm',
      marina_bay: 'm',
    },
    proactiveDecision: {
      recommendedAction: 'Transfer to Downtown Line at Promenade / Bugis or walk to City Hall / Bugis',
      secondaryAction: 'Take Free Bridging Bus connecting Dhoby Ghaut, Bras Basah, Esplanade, and Promenade',
      tradeoff: 'Bypasses civic district Circle Line bottleneck directly via Downtown Line or East-West Line',
      reasoning: 'CCL trains unable to run between CC1 Dhoby Ghaut and CC4 Promenade. Alternative rail lines (DTL, EWL, NSL) are unaffected in the central area.',
    },
    facilitiesMaintenance: [],
  },

  DOWNPOUR_RAIN_ALERT: {
    id: 'DOWNPOUR_RAIN_ALERT',
    name: 'Heavy Downpour & Flood Alert',
    badge: 'Weather Advisory',
    type: 'weather',
    description: 'Intense monsoon rain. Walk legs turn into soggy decisions. Prioritizes 100% CoveredLinkWay sheltered walkways.',
    trainServiceAlerts: {
      Status: 1,
      AffectedSegments: [],
      Message: [
        {
          Content: 'Heavy rain advisory: Wet weather conditions island-wide. Commuters are advised to exercise care on wet station platforms and walkways.',
          CreatedDate: '2026-09-19 08:05:00',
        },
      ],
    },
    weather: {
      condition: 'Heavy Downpour',
      isRaining: true,
      rainfallMm: 45.8,
      floodAlerts: [
        {
          location: 'Dunearn Road / Bukit Timah Road',
          advisory: 'Risk of flash flood. Avoid unsheltered roadside walks and underpasses.',
        },
      ],
    },
    pcdCrowdLevels: {
      jurong_east: 'h',
      bukit_batok: 'm',
      orchard: 'h',
      city_hall: 'h',
      raffles_place: 'h',
      dhoby_ghaut: 'h',
    },
    proactiveDecision: {
      recommendedAction: 'Take 100% Sheltered Route via J-Walk & Underground Concourse (+4 min)',
      secondaryAction: 'Board MRT instead of surface feeder bus to stay dry',
      tradeoff: '+4 min walking detour, 100% sheltered vs soaking unsheltered street walk',
      reasoning: 'Tropical downpour (45.8mm/hr) detected. OpenStreetMap covered walkway layer activated to guarantee dry connection door-to-door.',
    },
    facilitiesMaintenance: [],
  },

  PCD_CROWD_SURGE_FORECAST: {
    id: 'PCD_CROWD_SURGE_FORECAST',
    name: 'PCD Peak Crowd Forecast (08:15 Surge)',
    badge: 'Proactive Forecast',
    type: 'planned',
    description: 'PCDForecast projects High (h) platform density at Bishan and Jurong East during peak 08:00 - 08:45 window.',
    trainServiceAlerts: {
      Status: 1,
      AffectedSegments: [],
      Message: [
        {
          Content: 'Peak crowd density advisory: High passenger volume expected on NSL Southbound between 08:00 - 08:45 hrs.',
          CreatedDate: '2026-09-19 07:30:00',
        },
      ],
    },
    weather: {
      condition: 'Fair',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      jurong_east: 'h',
      bishan: 'h',
      woodlands: 'h',
      ang_mo_kio: 'h',
      orchard: 'm',
      city_hall: 'h',
      raffles_place: 'h',
    },
    proactiveDecision: {
      recommendedAction: 'Depart 15 min earlier at 07:45, or take Downtown Line via Newton',
      secondaryAction: 'Board rear carriages (Car 5 & 6) where crowd level is Moderate (m)',
      tradeoff: 'Leaving at 07:45 avoids 18 min boarding queue; DTL option guarantees seat (SEA)',
      reasoning: 'PCDForecast projects station crowd level High (h) for NS17 Bishan at 08:15. Commuters waiting until 08:15 face 2-3 train wait times.',
    },
    facilitiesMaintenance: [],
  },

  LIFT_MAINTENANCE_ACCESSIBLE: {
    id: 'LIFT_MAINTENANCE_ACCESSIBLE',
    name: 'Lift Maintenance (Accessibility Persona)',
    badge: 'Facilities Maintenance',
    type: 'planned',
    description: 'Ad hoc lift maintenance at Dhoby Ghaut Exit B per v2/FacilitiesMaintenance feed. Reroutes step-free commuters to Exit C.',
    trainServiceAlerts: {
      Status: 1,
      AffectedSegments: [],
      Message: [],
    },
    weather: {
      condition: 'Fair',
      isRaining: false,
      rainfallMm: 0,
      floodAlerts: [],
    },
    pcdCrowdLevels: {
      dhoby_ghaut: 'm',
      city_hall: 'm',
      raffles_place: 'm',
    },
    facilitiesMaintenance: [
      {
        Station: 'NS24/NE6/CC1',
        StationName: 'Dhoby Ghaut',
        UnitNumber: 'LIFT-02',
        Exit: 'Exit B (Plaza Singapura Street Level)',
        Status: 'Under Maintenance',
        AlternativeExit: 'Exit C (Orchard Rd Lift) or Exit A (Lower Ground Lift)',
        EstimatedRestoration: '14:00 hrs',
      },
    ],
    proactiveDecision: {
      recommendedAction: 'Use Exit C instead of Exit B for Step-Free Access (+2 min)',
      secondaryAction: 'Connect to Plaza Singapura via Concourse Underpass at Basement 2',
      tradeoff: '+2 min walk, 100% barrier-free with operational high-capacity lift',
      reasoning: 'LTA FacilitiesMaintenance feed reports Lift LIFT-02 at Exit B is currently undergoing scheduled overhaul until 14:00.',
    },
  },
};

