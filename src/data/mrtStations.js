// Singapore MRT & LRT Stations Database
// Complete official network: Coordinates, codes, lines, exits, covered walkways, and historical passenger tap-out volume.

export const MRT_STATIONS = [
  {
    "id": "jurong_east",
    "name": "Jurong East",
    "codes": [
      "NS1",
      "EW24"
    ],
    "lines": [
      "NSL",
      "EWL"
    ],
    "lat": 1.333153,
    "lng": 103.742286,
    "dailyTapOuts": 118400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Jurong East Bus Interchange, JEM",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Westgate, Ng Teng Fong General Hospital",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "IMM Building via J-Walk",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Vision Exchange",
        "hasLift": false,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bukit_batok",
    "name": "Bukit Batok",
    "codes": [
      "NS2"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.349033,
    "lng": 103.749567,
    "dailyTapOuts": 56200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "West Mall, Bt Batok Central",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Bt Batok Bus Interchange (Bus 190, 61, 852)",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Bt Batok Community Club",
        "hasLift": true,
        "isSheltered": false
      }
    ]
  },
  {
    "id": "bukit_gombak",
    "name": "Bukit Gombak",
    "codes": [
      "NS3"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.358611,
    "lng": 103.751944,
    "dailyTapOuts": 38400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bt Gombak Stadium, Little Guilin",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Bt Batok West Ave 5",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "choa_chu_kang",
    "name": "Choa Chu Kang",
    "codes": [
      "NS4",
      "BP1"
    ],
    "lines": [
      "NSL",
      "BPL"
    ],
    "lat": 1.385363,
    "lng": 103.744371,
    "dailyTapOuts": 72100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Lot One Shoppers Mall",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Choa Chu Kang Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "CCK Ave 4",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "yew_tee",
    "name": "Yew Tee",
    "codes": [
      "NS5"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.397535,
    "lng": 103.747405,
    "dailyTapOuts": 49500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Yew Tee Square / Point",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Choa Chu Kang Drive",
        "hasLift": true,
        "isSheltered": false
      }
    ]
  },
  {
    "id": "kranji",
    "name": "Kranji",
    "codes": [
      "NS7"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.425085,
    "lng": 103.762137,
    "dailyTapOuts": 31200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Singapore Turf Club / Woodlands Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Kranji Rd",
        "hasLift": false,
        "isSheltered": false
      }
    ]
  },
  {
    "id": "woodlands",
    "name": "Woodlands",
    "codes": [
      "NS9",
      "TE2"
    ],
    "lines": [
      "NSL",
      "TEL"
    ],
    "lat": 1.436061,
    "lng": 103.786546,
    "dailyTapOuts": 94800,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Causeway Point, Woodlands Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "2",
        "name": "Exit 2",
        "description": "Woodlands Civic Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "3",
        "name": "Exit 3",
        "description": "Woodlands Ave 2",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "yishun",
    "name": "Yishun",
    "codes": [
      "NS13"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.429443,
    "lng": 103.835008,
    "dailyTapOuts": 79200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Northpoint City (North Wing)",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Yishun Bus Interchange via Underpass",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Yishun Ave 2",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "ang_mo_kio",
    "name": "Ang Mo Kio",
    "codes": [
      "NS16"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.369933,
    "lng": 103.849558,
    "dailyTapOuts": 83500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "AMK Hub & Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Ang Mo Kio Ave 8",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Ang Mo Kio Ave 3",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bishan",
    "name": "Bishan",
    "codes": [
      "NS17",
      "CC15"
    ],
    "lines": [
      "NSL",
      "CCL"
    ],
    "lat": 1.350839,
    "lng": 103.848144,
    "dailyTapOuts": 88700,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Junction 8 Shopping Mall",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Bishan Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Bishan Community Club",
        "hasLift": true,
        "isSheltered": false
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Bishan St 14",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "novena",
    "name": "Novena",
    "codes": [
      "NS20"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.320441,
    "lng": 103.843845,
    "dailyTapOuts": 58900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Velocity @ Novena Square",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Tan Tock Seng Hospital via linkway",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "newton",
    "name": "Newton",
    "codes": [
      "NS21",
      "DT11"
    ],
    "lines": [
      "NSL",
      "DTL"
    ],
    "lat": 1.312318,
    "lng": 103.837984,
    "dailyTapOuts": 46200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Scotts Rd, Environment Bldg",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Newton Food Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Cairnhill Rd",
        "hasLift": true,
        "isSheltered": false
      }
    ]
  },
  {
    "id": "orchard",
    "name": "Orchard",
    "codes": [
      "NS22",
      "TE14"
    ],
    "lines": [
      "NSL",
      "TEL"
    ],
    "lat": 1.304033,
    "lng": 103.831885,
    "dailyTapOuts": 98600,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "ION Orchard, Paterson Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "2",
        "name": "Exit 2",
        "description": "Wisma Atria, Ngee Ann City",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "3",
        "name": "Exit 3",
        "description": "Wheelock Place",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "4",
        "name": "Exit 4",
        "description": "Shaw House, Tangs",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "somerset",
    "name": "Somerset",
    "codes": [
      "NS23"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.300262,
    "lng": 103.839075,
    "dailyTapOuts": 57400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "313@Somerset, Orchard Central",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Orchard Gateway, Emerald Hill",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "dhoby_ghaut",
    "name": "Dhoby Ghaut",
    "codes": [
      "NS24",
      "NE6",
      "CC1"
    ],
    "lines": [
      "NSL",
      "NEL",
      "CCL"
    ],
    "lat": 1.298649,
    "lng": 103.845873,
    "dailyTapOuts": 92300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Plaza Singapura Lower Ground",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Plaza Singapura Main Street",
        "hasLift": false,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Orchard Rd / The Cathay",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Fort Canning Park, SMU",
        "hasLift": true,
        "isSheltered": false
      },
      {
        "id": "E",
        "name": "Exit E",
        "description": "Handy Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "city_hall",
    "name": "City Hall",
    "codes": [
      "NS25",
      "EW13"
    ],
    "lines": [
      "NSL",
      "EWL"
    ],
    "lat": 1.292936,
    "lng": 103.852553,
    "dailyTapOuts": 110400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Raffles City, Fairmont Hotel",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "St Andrew Cathedral, Funan Mall",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "National Gallery Singapore",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "raffles_place",
    "name": "Raffles Place",
    "codes": [
      "NS26",
      "EW14"
    ],
    "lines": [
      "NSL",
      "EWL"
    ],
    "lat": 1.283998,
    "lng": 103.851463,
    "dailyTapOuts": 145800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Chevron House, Singapore Land Tower",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "OCBC Centre, Chulia St",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Ocean Financial Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Republic Plaza, UOB Plaza",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "G",
        "name": "Exit G",
        "description": "Battery Rd, Fullerton Hotel",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "J",
        "name": "Exit J",
        "description": "Marina Bay Link Mall via Underpass",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "marina_bay",
    "name": "Marina Bay",
    "codes": [
      "NS27",
      "CE2",
      "TE20"
    ],
    "lines": [
      "NSL",
      "CEL",
      "TEL"
    ],
    "lat": 1.276412,
    "lng": 103.854598,
    "dailyTapOuts": 74600,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Marina Bay Financial Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "2",
        "name": "Exit 2",
        "description": "Marina Way",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Central Boulevard",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "marina_south_pier",
    "name": "Marina South Pier",
    "codes": [
      "NS28"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.26629,
    "lng": 103.86339,
    "dailyTapOuts": 18500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Marina South Pier, Singapore Strait Ferry Terminal",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Marina Coastal Drive",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "buona_vista",
    "name": "Buona Vista",
    "codes": [
      "EW21",
      "CC22"
    ],
    "lines": [
      "EWL",
      "CCL"
    ],
    "lat": 1.307222,
    "lng": 103.790044,
    "dailyTapOuts": 81200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "The Star Vista, Rochester Park",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "MOE Headquarters, Metropolis",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Biopolis Way",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "outram_park",
    "name": "Outram Park",
    "codes": [
      "EW16",
      "NE3",
      "TE17"
    ],
    "lines": [
      "EWL",
      "NEL",
      "TEL"
    ],
    "lat": 1.280145,
    "lng": 103.839843,
    "dailyTapOuts": 76500,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Singapore General Hospital (SGH)",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "2",
        "name": "Exit 2",
        "description": "Outram Community Hospital",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "3",
        "name": "Exit 3",
        "description": "Police Cantonment Complex",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "7",
        "name": "Exit 7",
        "description": "Pearl Bank / Keong Saik Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tanjong_pagar",
    "name": "Tanjong Pagar",
    "codes": [
      "EW15"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.276435,
    "lng": 103.845726,
    "dailyTapOuts": 89400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Guoco Tower, Tanjong Pagar Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Maxwell Rd, Amoy St Food Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Anson Rd, International Plaza",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bugis",
    "name": "Bugis",
    "codes": [
      "EW12",
      "DT14"
    ],
    "lines": [
      "EWL",
      "DTL"
    ],
    "lat": 1.300465,
    "lng": 103.855799,
    "dailyTapOuts": 88500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bugis Junction, Victoria St",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Raffles Hospital, Arab St",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Bugis+, Queen St",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "DUO Galleria, Beach Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "paya_lebar",
    "name": "Paya Lebar",
    "codes": [
      "EW8",
      "CC9"
    ],
    "lines": [
      "EWL",
      "CCL"
    ],
    "lat": 1.317765,
    "lng": 103.892365,
    "dailyTapOuts": 78900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "PLQ Mall, Paya Lebar Square",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "SingPost Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Geylang Serai Market",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "macpherson",
    "name": "MacPherson",
    "codes": [
      "CC10",
      "DT26"
    ],
    "lines": [
      "CCL",
      "DTL"
    ],
    "lat": 1.3259,
    "lng": 103.89,
    "dailyTapOuts": 52400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Circuit Rd, Ubi Ave 2",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Geylang East Ave 1",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tampines",
    "name": "Tampines",
    "codes": [
      "EW2",
      "DT32"
    ],
    "lines": [
      "EWL",
      "DTL"
    ],
    "lat": 1.353198,
    "lng": 103.945206,
    "dailyTapOuts": 86400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Tampines 1 Shopping Mall",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Tampines Mall & Century Square",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Our Tampines Hub via Linkway",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Tampines Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "changi_airport",
    "name": "Changi Airport",
    "codes": [
      "CG2"
    ],
    "lines": [
      "CGL"
    ],
    "lat": 1.357472,
    "lng": 103.988583,
    "dailyTapOuts": 64200,
    "exits": [
      {
        "id": "A",
        "name": "Terminal 2",
        "description": "Changi Airport Terminal 2 & 3",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Jewel",
        "description": "Jewel Changi Airport Linkbridge",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bukit_panjang",
    "name": "Bukit Panjang",
    "codes": [
      "DT1",
      "BP6"
    ],
    "lines": [
      "DTL",
      "BPL"
    ],
    "lat": 1.378444,
    "lng": 103.761861,
    "dailyTapOuts": 62500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Hillion Mall & Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Bukit Panjang Plaza",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Junction 10 Mall",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "beauty_world",
    "name": "Beauty World",
    "codes": [
      "DT5"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.341857,
    "lng": 103.775836,
    "dailyTapOuts": 41800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Beauty World Centre, Bukit Timah Food Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Bukit Timah Plaza",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Cheong Chin Nam Rd Food Enclave",
        "hasLift": true,
        "isSheltered": false
      }
    ]
  },
  {
    "id": "botanic_gardens",
    "name": "Botanic Gardens",
    "codes": [
      "DT9",
      "CC19"
    ],
    "lines": [
      "DTL",
      "CCL"
    ],
    "lat": 1.322394,
    "lng": 103.815336,
    "dailyTapOuts": 48900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Singapore Botanic Gardens (UNESCO Heritage)",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Cluny Park Rd / Bukit Timah Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "downtown",
    "name": "Downtown",
    "codes": [
      "DT17"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.279444,
    "lng": 103.852889,
    "dailyTapOuts": 61200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Marina Bay Financial Centre Tower 1 & 2",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Asia Square, The Promontory",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "One Raffles Quay",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "chinatown",
    "name": "Chinatown",
    "codes": [
      "DT19",
      "NE4"
    ],
    "lines": [
      "DTL",
      "NEL"
    ],
    "lat": 1.284379,
    "lng": 103.844109,
    "dailyTapOuts": 71200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Pagoda St, Chinatown Heritage Centre",
        "hasLift": true,
        "isSheltered": false
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "People Park Complex",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "People Park Centre, Upper Cross St",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "E",
        "name": "Exit E",
        "description": "Chinatown Point Mall",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bayfront",
    "name": "Bayfront",
    "codes": [
      "DT16",
      "CE1"
    ],
    "lines": [
      "DTL",
      "CEL"
    ],
    "lat": 1.281855,
    "lng": 103.859088,
    "dailyTapOuts": 82500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Marina Bay Sands Hotel & Casino",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Gardens by the Bay via Underpass",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "The Shoppes at Marina Bay Sands",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Sands Expo & Convention Centre",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "harbourfront",
    "name": "HarbourFront",
    "codes": [
      "NE1",
      "CC29"
    ],
    "lines": [
      "NEL",
      "CCL"
    ],
    "lat": 1.265389,
    "lng": 103.822222,
    "dailyTapOuts": 75400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Telok Blangah Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "HarbourFront Centre, Ferry Terminal",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "VivoCity Mall & Sentosa Express",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "clarke_quay",
    "name": "Clarke Quay",
    "codes": [
      "NE5"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.288354,
    "lng": 103.846555,
    "dailyTapOuts": 51200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Clarke Quay Central, Read St",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "The Central, Eu Tong Sen St",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "serangoon",
    "name": "Serangoon",
    "codes": [
      "NE12",
      "CC13"
    ],
    "lines": [
      "NEL",
      "CCL"
    ],
    "lat": 1.349786,
    "lng": 103.873634,
    "dailyTapOuts": 82400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Serangoon Central, Upper Serangoon Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "NEX Mall (Basement 2)",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Serangoon Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "E",
        "name": "Exit E",
        "description": "NEX Mall (Ground Level)",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "punggol",
    "name": "Punggol",
    "codes": [
      "NE17",
      "PTC"
    ],
    "lines": [
      "NEL",
      "PGLRT"
    ],
    "lat": 1.405256,
    "lng": 103.902361,
    "dailyTapOuts": 71800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Waterway Point Shopping Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Punggol Temporary Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Punggol Central",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "one_north",
    "name": "One-North",
    "codes": [
      "CC23"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.299583,
    "lng": 103.787222,
    "dailyTapOuts": 43200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Fusionopolis, Connexis, Symbiosis",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Ayer Rajah Ave, Biopolis",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "esplanade",
    "name": "Esplanade",
    "codes": [
      "CC3"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.293674,
    "lng": 103.855395,
    "dailyTapOuts": 47800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Suntec City Mall & Convention Centre",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "D",
        "name": "Exit D",
        "description": "Marina Square Linkway",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "F",
        "name": "Exit F",
        "description": "Raffles City Underpass",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "promenade",
    "name": "Promenade",
    "codes": [
      "CC4",
      "DT15"
    ],
    "lines": [
      "CCL",
      "DTL"
    ],
    "lat": 1.293111,
    "lng": 103.860889,
    "dailyTapOuts": 67300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Millenia Walk, Suntec City",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Singapore Flyer, F1 Pit Building",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "C",
        "name": "Exit C",
        "description": "Temasek Avenue",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "maxwell",
    "name": "Maxwell",
    "codes": [
      "TE18"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.280639,
    "lng": 103.843778,
    "dailyTapOuts": 38700,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Maxwell Food Centre, Buddha Tooth Relic Temple",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "2",
        "name": "Exit 2",
        "description": "Neil Rd / Club St",
        "hasLift": true,
        "isSheltered": false
      },
      {
        "id": "3",
        "name": "Exit 3",
        "description": "South Bridge Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "shenton_way",
    "name": "Shenton Way",
    "codes": [
      "TE19"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.278028,
    "lng": 103.850444,
    "dailyTapOuts": 44200,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "SGX Centre, Shenton House",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "2",
        "name": "Exit 2",
        "description": "Asia Square, UIC Building",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "clementi",
    "name": "Clementi",
    "codes": [
      "EW23"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.315111,
    "lng": 103.765222,
    "dailyTapOuts": 78900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Clementi Mall & Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Clementi Ave 3",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "boon_lay",
    "name": "Boon Lay",
    "codes": [
      "EW27"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.338611,
    "lng": 103.706,
    "dailyTapOuts": 92400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Jurong Point, Boon Lay Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "queenstown",
    "name": "Queenstown",
    "codes": [
      "EW19"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.294611,
    "lng": 103.806,
    "dailyTapOuts": 41200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Commonwealth Ave",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "redhill",
    "name": "Redhill",
    "codes": [
      "EW18"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.289611,
    "lng": 103.8168,
    "dailyTapOuts": 39800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Jalan Bukit Merah",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tiong_bahru",
    "name": "Tiong Bahru",
    "codes": [
      "EW17"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.286417,
    "lng": 103.827,
    "dailyTapOuts": 58400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Tiong Bahru Plaza",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bedok",
    "name": "Bedok",
    "codes": [
      "EW5"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.324,
    "lng": 103.93,
    "dailyTapOuts": 96500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bedok Mall & Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tanah_merah",
    "name": "Tanah Merah",
    "codes": [
      "EW4",
      "CG"
    ],
    "lines": [
      "EWL",
      "CGL"
    ],
    "lat": 1.327187,
    "lng": 103.946344,
    "dailyTapOuts": 64200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "New Upper Changi Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Bedok South Ave 3",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "pasir_ris",
    "name": "Pasir Ris",
    "codes": [
      "EW1"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.3725,
    "lng": 103.9493,
    "dailyTapOuts": 88700,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "White Sands Shopping Mall & Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "toa_payoh",
    "name": "Toa Payoh",
    "codes": [
      "NS19"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.3327,
    "lng": 103.8477,
    "dailyTapOuts": 85200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "HDB Hub, Toa Payoh Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "little_india",
    "name": "Little India",
    "codes": [
      "NE7",
      "DT12"
    ],
    "lines": [
      "NEL",
      "DTL"
    ],
    "lat": 1.3068,
    "lng": 103.8492,
    "dailyTapOuts": 64200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bukit Timah Rd, Tekka Centre",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "hougang",
    "name": "Hougang",
    "codes": [
      "NE14"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.3712,
    "lng": 103.8924,
    "dailyTapOuts": 79500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Hougang Mall, Hougang Central Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "sengkang",
    "name": "Sengkang",
    "codes": [
      "NE16",
      "STC"
    ],
    "lines": [
      "NEL",
      "SKLRT"
    ],
    "lat": 1.3916,
    "lng": 103.8954,
    "dailyTapOuts": 86400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Compass One, Sengkang Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "marine_parade",
    "name": "Marine Parade",
    "codes": [
      "TE26"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.3025,
    "lng": 103.906,
    "dailyTapOuts": 41800,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Parkway Parade, Marine Parade Central",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "expo",
    "name": "Expo",
    "codes": [
      "CG1",
      "DT35"
    ],
    "lines": [
      "EWL",
      "CGL",
      "DTL"
    ],
    "lat": 1.3353,
    "lng": 103.9616,
    "dailyTapOuts": 49800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Singapore EXPO Halls 1-6",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "marsiling",
    "name": "Marsiling",
    "codes": [
      "NS8"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.432521,
    "lng": 103.774072,
    "dailyTapOuts": 41200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Woodlands Ave 3",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Woodlands Ave 1",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "admiralty",
    "name": "Admiralty",
    "codes": [
      "NS10"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.440585,
    "lng": 103.80099,
    "dailyTapOuts": 67300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Kampung Admiralty, Woodlands Ring Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Woodlands Ave 7",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "sembawang",
    "name": "Sembawang",
    "codes": [
      "NS11"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.449051,
    "lng": 103.82005,
    "dailyTapOuts": 58900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Sun Plaza, Sembawang Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Sembawang Way",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "canberra",
    "name": "Canberra",
    "codes": [
      "NS12"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.443075,
    "lng": 103.829703,
    "dailyTapOuts": 34500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Canberra Plaza",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Canberra Link",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "khatib",
    "name": "Khatib",
    "codes": [
      "NS14"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.417383,
    "lng": 103.83298,
    "dailyTapOuts": 69800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Yishun Ave 2",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Yishun Ring Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "yio_chu_kang",
    "name": "Yio Chu Kang",
    "codes": [
      "NS15"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.381757,
    "lng": 103.84481,
    "dailyTapOuts": 47200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Nanyang Polytechnic, YCK Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Ang Mo Kio Ave 8",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "braddell",
    "name": "Braddell",
    "codes": [
      "NS18"
    ],
    "lines": [
      "NSL"
    ],
    "lat": 1.340469,
    "lng": 103.846799,
    "dailyTapOuts": 39400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Lorong 1 Toa Payoh",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Lorong 2 Toa Payoh",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "simei",
    "name": "Simei",
    "codes": [
      "EW3"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.343195,
    "lng": 103.953377,
    "dailyTapOuts": 48900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Eastpoint Mall",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Simei St 3",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "kembangan",
    "name": "Kembangan",
    "codes": [
      "EW6"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.321038,
    "lng": 103.912857,
    "dailyTapOuts": 36200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Sims Ave East / Changi Rd",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Jalan Kembangan",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "eunos",
    "name": "Eunos",
    "codes": [
      "EW7"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.319778,
    "lng": 103.903252,
    "dailyTapOuts": 51200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Eunos Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Sims Ave",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "aljunied",
    "name": "Aljunied",
    "codes": [
      "EW9"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.316433,
    "lng": 103.882906,
    "dailyTapOuts": 56700,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Aljunied Rd / Geylang",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Lorong 25 Geylang",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "kallang",
    "name": "Kallang",
    "codes": [
      "EW10"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.311489,
    "lng": 103.87138,
    "dailyTapOuts": 49800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Sims Ave, Lor 1 Geylang Bus Ter",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Geylang Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "lavender",
    "name": "Lavender",
    "codes": [
      "EW11"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.307374,
    "lng": 103.8596,
    "dailyTapOuts": 62400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Kallang Rd, ICA Building",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Victoria St, Golden Landmark",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "commonwealth",
    "name": "Commonwealth",
    "codes": [
      "EW20"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.3025,
    "lng": 103.7983,
    "dailyTapOuts": 44300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Commonwealth Ave, Tanglin Halt",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Commonwealth Dr",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "dover",
    "name": "Dover",
    "codes": [
      "EW22"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.311405,
    "lng": 103.77864,
    "dailyTapOuts": 31200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Singapore Polytechnic",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Commonwealth Ave West",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "chinese_garden",
    "name": "Chinese Garden",
    "codes": [
      "EW25"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.342353,
    "lng": 103.732596,
    "dailyTapOuts": 38200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Jurong East Ave 1",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Boon Lay Way",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "lakeside",
    "name": "Lakeside",
    "codes": [
      "EW26"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.344259,
    "lng": 103.72095,
    "dailyTapOuts": 58700,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Boon Lay Way, Jurong Lake Gardens",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Yuan Ching Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "pioneer",
    "name": "Pioneer",
    "codes": [
      "EW28"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.337587,
    "lng": 103.697321,
    "dailyTapOuts": 46200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Jurong West St 61",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Jurong West Ave 4",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "joo_koon",
    "name": "Joo Koon",
    "codes": [
      "EW29"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.327727,
    "lng": 103.67831,
    "dailyTapOuts": 41800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "FairPrice Hub, Joo Koon Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      },
      {
        "id": "B",
        "name": "Exit B",
        "description": "Benoi Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "gul_circle",
    "name": "Gul Circle",
    "codes": [
      "EW30"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.319471,
    "lng": 103.660751,
    "dailyTapOuts": 19800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Tuas Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tuas_crescent",
    "name": "Tuas Crescent",
    "codes": [
      "EW31"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.321027,
    "lng": 103.649036,
    "dailyTapOuts": 15400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Pioneer Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tuas_west_road",
    "name": "Tuas West Road",
    "codes": [
      "EW32"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.329984,
    "lng": 103.639618,
    "dailyTapOuts": 14200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Pioneer Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tuas_link",
    "name": "Tuas Link",
    "codes": [
      "EW33"
    ],
    "lines": [
      "EWL"
    ],
    "lat": 1.340882,
    "lng": 103.636991,
    "dailyTapOuts": 21200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Tuas West Dr, Tuas Bus Terminal",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "farrer_park",
    "name": "Farrer Park",
    "codes": [
      "NE8"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.312864,
    "lng": 103.854291,
    "dailyTapOuts": 48500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "City Square Mall, Rangoon Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "boon_keng",
    "name": "Boon Keng",
    "codes": [
      "NE9"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.319335,
    "lng": 103.861704,
    "dailyTapOuts": 44100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Serangoon Rd, Bendemeer Shopping Mall",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "potong_pasir",
    "name": "Potong Pasir",
    "codes": [
      "NE10"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.331379,
    "lng": 103.869058,
    "dailyTapOuts": 37800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Upper Serangoon Rd, The Poiz Centre",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "woodleigh",
    "name": "Woodleigh",
    "codes": [
      "NE11"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.33919,
    "lng": 103.870818,
    "dailyTapOuts": 32400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "The Woodleigh Mall, Bidadari",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "kovan",
    "name": "Kovan",
    "codes": [
      "NE13"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.360179,
    "lng": 103.885065,
    "dailyTapOuts": 61500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Heartland Mall, Kovan Market",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "buangkok",
    "name": "Buangkok",
    "codes": [
      "NE15"
    ],
    "lines": [
      "NEL"
    ],
    "lat": 1.38287,
    "lng": 103.89311,
    "dailyTapOuts": 42300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Sengkang Grand Mall, Buangkok Bus Interchange",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bras_basah",
    "name": "Bras Basah",
    "codes": [
      "CC2"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.29686,
    "lng": 103.85065,
    "dailyTapOuts": 24300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Singapore Art Museum, SMU",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "nicoll_highway",
    "name": "Nicoll Highway",
    "codes": [
      "CC5"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.300142,
    "lng": 103.86361,
    "dailyTapOuts": 21800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Beach Rd, Golden Mile",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "stadium",
    "name": "Stadium",
    "codes": [
      "CC6"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.302787,
    "lng": 103.875344,
    "dailyTapOuts": 35400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Singapore National Stadium, Kallang Wave Mall",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "mountbatten",
    "name": "Mountbatten",
    "codes": [
      "CC7"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.306306,
    "lng": 103.882529,
    "dailyTapOuts": 26200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Old Airport Road Food Centre",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "dakota",
    "name": "Dakota",
    "codes": [
      "CC8"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.308548,
    "lng": 103.889062,
    "dailyTapOuts": 31500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Old Airport Rd, Dunman High School",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tai_seng",
    "name": "Tai Seng",
    "codes": [
      "CC11"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.33538,
    "lng": 103.887864,
    "dailyTapOuts": 58200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "18 Tai Seng, Upper Paya Lebar Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bartley",
    "name": "Bartley",
    "codes": [
      "CC12"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.342501,
    "lng": 103.879986,
    "dailyTapOuts": 25100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bartley Rd, Maris Stella High School",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "lorong_chuan",
    "name": "Lorong Chuan",
    "codes": [
      "CC14"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.351619,
    "lng": 103.864066,
    "dailyTapOuts": 33400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Lorong Chuan, Australian International School",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "marymount",
    "name": "Marymount",
    "codes": [
      "CC16"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.348707,
    "lng": 103.839423,
    "dailyTapOuts": 36700,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Marymount Rd, Shunfu Mart",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "caldecott",
    "name": "Caldecott",
    "codes": [
      "CC17",
      "TE9"
    ],
    "lines": [
      "CCL",
      "TEL"
    ],
    "lat": 1.337245,
    "lng": 103.839525,
    "dailyTapOuts": 39800,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Toa Payoh Rise",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "farrer_road",
    "name": "Farrer Road",
    "codes": [
      "CC20"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.317438,
    "lng": 103.807538,
    "dailyTapOuts": 23100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Farrer Rd, Empress Market",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "holland_village",
    "name": "Holland Village",
    "codes": [
      "CC21"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.311795,
    "lng": 103.796067,
    "dailyTapOuts": 41200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Holland Rd, One Holland Village",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "kent_ridge",
    "name": "Kent Ridge",
    "codes": [
      "CC24"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.29352,
    "lng": 103.78457,
    "dailyTapOuts": 59300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "National University Hospital (NUH), NUS",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "haw_par_villa",
    "name": "Haw Par Villa",
    "codes": [
      "CC25"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.28257,
    "lng": 103.78184,
    "dailyTapOuts": 22400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Pasir Panjang Rd, Haw Par Villa",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "pasir_panjang",
    "name": "Pasir Panjang",
    "codes": [
      "CC26"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.27621,
    "lng": 103.79135,
    "dailyTapOuts": 27900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Pasir Panjang Wholesale Centre",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "labrador_park",
    "name": "Labrador Park",
    "codes": [
      "CC27"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.27225,
    "lng": 103.80302,
    "dailyTapOuts": 29500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "PSA Building, Alexandra Retail Centre (ARC)",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "telok_blangah",
    "name": "Telok Blangah",
    "codes": [
      "CC28"
    ],
    "lines": [
      "CCL"
    ],
    "lat": 1.27071,
    "lng": 103.80975,
    "dailyTapOuts": 21400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Telok Blangah Rd, Mount Faber Park",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "cashew",
    "name": "Cashew",
    "codes": [
      "DT2"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.369815,
    "lng": 103.764426,
    "dailyTapOuts": 18700,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Upper Bukit Timah Rd, Cashew Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "hillview",
    "name": "Hillview",
    "codes": [
      "DT3"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.362345,
    "lng": 103.767414,
    "dailyTapOuts": 27600,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "HillV2, Upper Bukit Timah Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "king_albert_park",
    "name": "King Albert Park",
    "codes": [
      "DT6"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.335661,
    "lng": 103.783158,
    "dailyTapOuts": 29400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Kap Mall, Bukit Timah Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "sixth_avenue",
    "name": "Sixth Avenue",
    "codes": [
      "DT7"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.330758,
    "lng": 103.796983,
    "dailyTapOuts": 24800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Sixth Ave, Bukit Timah Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tan_kah_kee",
    "name": "Tan Kah Kee",
    "codes": [
      "DT8"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.325608,
    "lng": 103.807755,
    "dailyTapOuts": 28900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Hwa Chong Institution, Bukit Timah Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "stevens",
    "name": "Stevens",
    "codes": [
      "DT10",
      "TE11"
    ],
    "lines": [
      "DTL",
      "TEL"
    ],
    "lat": 1.320066,
    "lng": 103.826024,
    "dailyTapOuts": 31200,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Bukit Timah Rd, Stevens Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "rochor",
    "name": "Rochor",
    "codes": [
      "DT13"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.303852,
    "lng": 103.852758,
    "dailyTapOuts": 33500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Sim Lim Square, Rochor Canal Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "telok_ayer",
    "name": "Telok Ayer",
    "codes": [
      "DT18"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.282173,
    "lng": 103.848658,
    "dailyTapOuts": 48900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Cross St, Telok Ayer St",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "fort_canning",
    "name": "Fort Canning",
    "codes": [
      "DT20"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.292483,
    "lng": 103.844332,
    "dailyTapOuts": 27400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Clarke Quay, Fort Canning Park",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bencoolen",
    "name": "Bencoolen",
    "codes": [
      "DT21"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.298912,
    "lng": 103.850654,
    "dailyTapOuts": 30100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "NAFA, Bencoolen St",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "jalan_besar",
    "name": "Jalan Besar",
    "codes": [
      "DT22"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.305179,
    "lng": 103.855294,
    "dailyTapOuts": 29800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Jalan Besar, Sungei Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bendemeer",
    "name": "Bendemeer",
    "codes": [
      "DT23"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.313665,
    "lng": 103.862973,
    "dailyTapOuts": 35200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Kallang Bahru",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "geylang_bahru",
    "name": "Geylang Bahru",
    "codes": [
      "DT24"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.321402,
    "lng": 103.871626,
    "dailyTapOuts": 33900,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Geylang Bahru Market & Food Centre",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "mattar",
    "name": "Mattar",
    "codes": [
      "DT25"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.326876,
    "lng": 103.883248,
    "dailyTapOuts": 22100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Mattar Rd, Merpati Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "ubi",
    "name": "Ubi",
    "codes": [
      "DT27"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.329972,
    "lng": 103.899234,
    "dailyTapOuts": 36400,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Ubi Ave 2",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "kaki_bukit",
    "name": "Kaki Bukit",
    "codes": [
      "DT28"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.334947,
    "lng": 103.908459,
    "dailyTapOuts": 39500,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Kaki Bukit Ave 1",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bedok_north",
    "name": "Bedok North",
    "codes": [
      "DT29"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.334742,
    "lng": 103.917997,
    "dailyTapOuts": 34100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bedok North Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bedok_reservoir",
    "name": "Bedok Reservoir",
    "codes": [
      "DT30"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.336248,
    "lng": 103.932948,
    "dailyTapOuts": 37200,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Bedok Reservoir Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tampines_west",
    "name": "Tampines West",
    "codes": [
      "DT31"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.345515,
    "lng": 103.938437,
    "dailyTapOuts": 46800,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Tampines Ave 4",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tampines_east",
    "name": "Tampines East",
    "codes": [
      "DT33"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.356241,
    "lng": 103.954634,
    "dailyTapOuts": 49100,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "Tampines Ave 2 / Ave 7",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "upper_changi",
    "name": "Upper Changi",
    "codes": [
      "DT34"
    ],
    "lines": [
      "DTL"
    ],
    "lat": 1.341739,
    "lng": 103.961473,
    "dailyTapOuts": 28300,
    "exits": [
      {
        "id": "A",
        "name": "Exit A",
        "description": "SUTD, Upper Changi Rd East",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "woodlands_north",
    "name": "Woodlands North",
    "codes": [
      "TE1"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.448296,
    "lng": 103.785694,
    "dailyTapOuts": 19400,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Republic Polytechnic",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "woodlands_south",
    "name": "Woodlands South",
    "codes": [
      "TE3"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.427396,
    "lng": 103.793312,
    "dailyTapOuts": 28500,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Woodlands Ave 1, Christ Church Secondary",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "springleaf",
    "name": "Springleaf",
    "codes": [
      "TE4"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.397583,
    "lng": 103.817889,
    "dailyTapOuts": 18200,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Upper Thomson Rd, Springleaf Nature Park",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "lentor",
    "name": "Lentor",
    "codes": [
      "TE5"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.385507,
    "lng": 103.835974,
    "dailyTapOuts": 24700,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Lentor Modern, Lentor Dr",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "mayflower",
    "name": "Mayflower",
    "codes": [
      "TE6"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.371462,
    "lng": 103.836511,
    "dailyTapOuts": 31200,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Ang Mo Kio Ave 4, Kebun Baru CC",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bright_hill",
    "name": "Bright Hill",
    "codes": [
      "TE7"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.363228,
    "lng": 103.832961,
    "dailyTapOuts": 27800,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Sin Ming Ave, Bishan-Ang Mo Kio Park",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "upper_thomson",
    "name": "Upper Thomson",
    "codes": [
      "TE8"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.354417,
    "lng": 103.832833,
    "dailyTapOuts": 34500,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Thomson Plaza, Upper Thomson Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "napier",
    "name": "Napier",
    "codes": [
      "TE12"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.306786,
    "lng": 103.818556,
    "dailyTapOuts": 22100,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Gleneagles Hospital, Botanic Gardens (Tyersall)",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "orchard_boulevard",
    "name": "Orchard Boulevard",
    "codes": [
      "TE13"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.302306,
    "lng": 103.823944,
    "dailyTapOuts": 24300,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Camden Medical, Orchard Blvd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "great_world",
    "name": "Great World",
    "codes": [
      "TE15"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.29314,
    "lng": 103.83197,
    "dailyTapOuts": 41200,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Great World City, Kim Seng Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "havelock",
    "name": "Havelock",
    "codes": [
      "TE16"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.28827,
    "lng": 103.82968,
    "dailyTapOuts": 25400,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Zion Rd, Havelock Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "gardens_by_the_bay",
    "name": "Gardens by the Bay",
    "codes": [
      "TE22"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.279028,
    "lng": 103.867778,
    "dailyTapOuts": 38200,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Gardens by the Bay South, Marina Barrage",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tanjong_rhu",
    "name": "Tanjong Rhu",
    "codes": [
      "TE23"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.297444,
    "lng": 103.873278,
    "dailyTapOuts": 21500,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Tanjong Rhu Rd, Singapore Indoor Stadium",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "katong_park",
    "name": "Katong Park",
    "codes": [
      "TE24"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.298889,
    "lng": 103.885833,
    "dailyTapOuts": 18900,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Katong Park, Meyer Rd",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "tanjong_katong",
    "name": "Tanjong Katong",
    "codes": [
      "TE25"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.300556,
    "lng": 103.898611,
    "dailyTapOuts": 26400,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Amber Rd, Tanjong Katong Rd South",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "marine_terrace",
    "name": "Marine Terrace",
    "codes": [
      "TE27"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.306111,
    "lng": 103.916111,
    "dailyTapOuts": 32100,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Marine Terrace, CHIJ Katong Convent",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "siglap",
    "name": "Siglap",
    "codes": [
      "TE28"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.309722,
    "lng": 103.929722,
    "dailyTapOuts": 29800,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Marine Parade Rd, Victoria School",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  },
  {
    "id": "bayshore",
    "name": "Bayshore",
    "codes": [
      "TE29"
    ],
    "lines": [
      "TEL"
    ],
    "lat": 1.3125,
    "lng": 103.943056,
    "dailyTapOuts": 24500,
    "exits": [
      {
        "id": "1",
        "name": "Exit 1",
        "description": "Bayshore Rd, East Coast Park",
        "hasLift": true,
        "isSheltered": true
      }
    ]
  }
];

// Ordered sequential stations along each MRT line in Singapore
export const LINE_STATION_ORDERS = {
  "NSL": [
    "jurong_east",
    "bukit_batok",
    "bukit_gombak",
    "choa_chu_kang",
    "yew_tee",
    "kranji",
    "marsiling",
    "woodlands",
    "admiralty",
    "sembawang",
    "canberra",
    "yishun",
    "khatib",
    "yio_chu_kang",
    "ang_mo_kio",
    "bishan",
    "braddell",
    "toa_payoh",
    "novena",
    "newton",
    "orchard",
    "somerset",
    "dhoby_ghaut",
    "city_hall",
    "raffles_place",
    "marina_bay",
    "marina_south_pier"
  ],
  "EWL": [
    "tuas_link",
    "tuas_west_road",
    "tuas_crescent",
    "gul_circle",
    "joo_koon",
    "pioneer",
    "boon_lay",
    "lakeside",
    "chinese_garden",
    "jurong_east",
    "clementi",
    "dover",
    "buona_vista",
    "commonwealth",
    "queenstown",
    "redhill",
    "tiong_bahru",
    "outram_park",
    "tanjong_pagar",
    "raffles_place",
    "city_hall",
    "bugis",
    "lavender",
    "kallang",
    "aljunied",
    "paya_lebar",
    "eunos",
    "kembangan",
    "bedok",
    "tanah_merah",
    "simei",
    "tampines",
    "pasir_ris"
  ],
  "CGL": [
    "tanah_merah",
    "expo",
    "changi_airport"
  ],
  "NEL": [
    "harbourfront",
    "outram_park",
    "chinatown",
    "clarke_quay",
    "dhoby_ghaut",
    "little_india",
    "farrer_park",
    "boon_keng",
    "potong_pasir",
    "woodleigh",
    "serangoon",
    "kovan",
    "hougang",
    "buangkok",
    "sengkang",
    "punggol"
  ],
  "CCL": [
    "dhoby_ghaut",
    "bras_basah",
    "esplanade",
    "promenade",
    "nicoll_highway",
    "stadium",
    "mountbatten",
    "dakota",
    "paya_lebar",
    "macpherson",
    "tai_seng",
    "bartley",
    "serangoon",
    "lorong_chuan",
    "bishan",
    "marymount",
    "caldecott",
    "botanic_gardens",
    "farrer_road",
    "holland_village",
    "buona_vista",
    "one_north",
    "kent_ridge",
    "haw_par_villa",
    "pasir_panjang",
    "labrador_park",
    "telok_blangah",
    "harbourfront"
  ],
  "CEL": [
    "promenade",
    "bayfront",
    "marina_bay"
  ],
  "DTL": [
    "bukit_panjang",
    "cashew",
    "hillview",
    "beauty_world",
    "king_albert_park",
    "sixth_avenue",
    "tan_kah_kee",
    "botanic_gardens",
    "stevens",
    "newton",
    "little_india",
    "rochor",
    "bugis",
    "promenade",
    "bayfront",
    "downtown",
    "telok_ayer",
    "chinatown",
    "fort_canning",
    "bencoolen",
    "jalan_besar",
    "bendemeer",
    "geylang_bahru",
    "mattar",
    "macpherson",
    "ubi",
    "kaki_bukit",
    "bedok_north",
    "bedok_reservoir",
    "tampines_west",
    "tampines",
    "tampines_east",
    "upper_changi",
    "expo"
  ],
  "TEL": [
    "woodlands_north",
    "woodlands",
    "woodlands_south",
    "springleaf",
    "lentor",
    "mayflower",
    "bright_hill",
    "upper_thomson",
    "caldecott",
    "stevens",
    "napier",
    "orchard_boulevard",
    "orchard",
    "great_world",
    "havelock",
    "outram_park",
    "maxwell",
    "shenton_way",
    "marina_bay",
    "gardens_by_the_bay",
    "tanjong_rhu",
    "katong_park",
    "tanjong_katong",
    "marine_parade",
    "marine_terrace",
    "siglap",
    "bayshore"
  ],
  "BPL": [
    "choa_chu_kang",
    "bukit_panjang"
  ]
};

// Helper to find station by code (e.g. "NS1" or "EW14")
export function getStationByCode(code) {
  if (!code) return null;
  const upper = String(code).trim().toUpperCase();
  return MRT_STATIONS.find(stn => stn.codes.some(c => c.toUpperCase() === upper)) || null;
}

// Helper to find station by ID
export function getStationById(id) {
  return MRT_STATIONS.find(stn => stn.id === id) || null;
}

// Helper to get nearest station to GPS coordinates
export function getNearestStation(lat, lng) {
  let nearest = null;
  let minDist = Infinity;
  for (const stn of MRT_STATIONS) {
    const dist = Math.hypot(stn.lat - lat, (stn.lng - lng) * Math.cos((lat * Math.PI) / 180));
    if (dist < minDist) {
      minDist = dist;
      nearest = stn;
    }
  }
  return { station: nearest, distanceKm: minDist * 111 };
}

// Helper to get line-specific station code (e.g. NS2 for Bukit Batok on NSL, DT11 for Newton on DTL)
export function getStationCodeForLine(stationOrId, lineId) {
  const stn = typeof stationOrId === 'string' ? getStationById(stationOrId) : stationOrId;
  if (!stn || !stn.codes || !stn.codes.length) return '';

  const prefixMap = {
    NSL: ['NS'],
    EWL: ['EW', 'CG'],
    CCL: ['CC', 'CE'],
    CEL: ['CE', 'CC'],
    NEL: ['NE'],
    DTL: ['DT'],
    TEL: ['TE'],
    CGL: ['CG', 'EW'],
    BPL: ['BP'],
  };

  const allowedPrefixes = prefixMap[lineId] || [];
  for (const prefix of allowedPrefixes) {
    const match = stn.codes.find(c => c.toUpperCase().startsWith(prefix));
    if (match) return match;
  }

  return stn.codes[0] || '';
}

// Check if station is an interchange
export function isInterchangeStation(stationOrId) {
  const stn = typeof stationOrId === 'string' ? getStationById(stationOrId) : stationOrId;
  return Boolean(stn && stn.lines && stn.lines.length > 1);
}
