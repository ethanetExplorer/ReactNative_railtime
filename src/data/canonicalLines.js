// Canonical MRT & LRT Line Registry
// Resolves discrepancies across TrainServiceAlerts, PCDRealTime, PCDForecast, and public signage.

export const CANONICAL_LINES = {
  NSL: {
    id: 'NSL',
    name: 'North-South Line',
    shortName: 'North-South',
    color: '#D42E12', // Official LTA Red
    textColor: '#FFFFFF',
    codePrefix: 'NS',
    alertCode: 'NSL',
    pcdCode: 'NSL',
    routeType: 'mrt',
  },
  EWL: {
    id: 'EWL',
    name: 'East-West Line',
    shortName: 'East-West',
    color: '#009645', // Official LTA Green
    textColor: '#FFFFFF',
    codePrefix: 'EW',
    alertCode: 'EWL',
    pcdCode: 'EWL',
    routeType: 'mrt',
  },
  CGL: {
    id: 'CGL',
    name: 'Changi Airport Branch',
    shortName: 'Changi Branch',
    color: '#009645', // Branch of EWL Green
    textColor: '#FFFFFF',
    codePrefix: 'CG',
    alertCode: 'EWL', // Folded into EWL in TrainServiceAlerts
    pcdCode: 'CGL',   // Separate code in PCD
    routeType: 'mrt',
  },
  NEL: {
    id: 'NEL',
    name: 'North East Line',
    shortName: 'North East',
    color: '#9900AA', // Official LTA Purple
    textColor: '#FFFFFF',
    codePrefix: 'NE',
    alertCode: 'NEL',
    pcdCode: 'NEL',
    routeType: 'mrt',
  },
  CCL: {
    id: 'CCL',
    name: 'Circle Line',
    shortName: 'Circle',
    color: '#FA9E0D', // Official LTA Orange
    textColor: '#FFFFFF',
    codePrefix: 'CC',
    alertCode: 'CCL',
    pcdCode: 'CCL',
    routeType: 'mrt',
  },
  CEL: {
    id: 'CEL',
    name: 'Circle Line Extension (Marina Bay)',
    shortName: 'Circle Ext',
    color: '#FA9E0D', // Official LTA Orange
    textColor: '#FFFFFF',
    codePrefix: 'CE',
    alertCode: 'CCL', // Folded into CCL in alerts
    pcdCode: 'CEL',   // Separate code in PCD
    routeType: 'mrt',
  },
  DTL: {
    id: 'DTL',
    name: 'Downtown Line',
    shortName: 'Downtown',
    color: '#005EC4', // Official LTA Blue
    textColor: '#FFFFFF',
    codePrefix: 'DT',
    alertCode: 'DTL',
    pcdCode: 'DTL',
    routeType: 'mrt',
  },
  TEL: {
    id: 'TEL',
    name: 'Thomson-East Coast Line',
    shortName: 'Thomson-East Coast',
    color: '#9D5B25', // Official LTA Brown
    textColor: '#FFFFFF',
    codePrefix: 'TE',
    alertCode: 'TEL',
    pcdCode: 'TEL',
    routeType: 'mrt',
  },
  BPL: {
    id: 'BPL',
    name: 'Bukit Panjang LRT',
    shortName: 'Bt Panjang LRT',
    color: '#748477', // Official LTA LRT Grey
    textColor: '#FFFFFF',
    codePrefix: 'BP',
    alertCode: 'BPL',
    pcdCode: 'BPL',
    routeType: 'lrt',
  },
  SKLRT: {
    id: 'SKLRT',
    name: 'Sengkang LRT',
    shortName: 'Sengkang LRT',
    color: '#748477',
    textColor: '#FFFFFF',
    codePrefix: 'STC',
    alertCode: 'STL', // STL in alerts
    pcdCode: 'SLRT',  // SLRT in PCD
    routeType: 'lrt',
  },
  PGLRT: {
    id: 'PGLRT',
    name: 'Punggol LRT',
    shortName: 'Punggol LRT',
    color: '#748477',
    textColor: '#FFFFFF',
    codePrefix: 'PTC',
    alertCode: 'PTL', // PTL in alerts
    pcdCode: 'PLRT',  // PLRT in PCD
    routeType: 'lrt',
  },
  BUS: {
    id: 'BUS',
    name: 'Public Bus Service',
    shortName: 'Bus',
    color: '#E91E63', // Pink per problem statement
    textColor: '#FFFFFF',
    codePrefix: 'B',
    alertCode: 'BUS',
    pcdCode: 'BUS',
    routeType: 'bus',
  },
};

// Maps any external code to its canonical line object
export function getCanonicalLine(code) {
  if (!code) return null;
  const upper = String(code).trim().toUpperCase();

  // Direct ID check
  if (CANONICAL_LINES[upper]) return CANONICAL_LINES[upper];

  // Check alert codes
  for (const line of Object.values(CANONICAL_LINES)) {
    if (line.alertCode === upper) return line;
    if (line.pcdCode === upper) return line;
    if (line.codePrefix === upper) return line;
  }

  // Station prefix heuristic (e.g. "NS" -> NSL, "EW" -> EWL)
  if (upper.startsWith('NS')) return CANONICAL_LINES.NSL;
  if (upper.startsWith('EW')) return CANONICAL_LINES.EWL;
  if (upper.startsWith('CG')) return CANONICAL_LINES.CGL;
  if (upper.startsWith('NE')) return CANONICAL_LINES.NEL;
  if (upper.startsWith('CC')) return CANONICAL_LINES.CCL;
  if (upper.startsWith('CE')) return CANONICAL_LINES.CEL;
  if (upper.startsWith('DT')) return CANONICAL_LINES.DTL;
  if (upper.startsWith('TE')) return CANONICAL_LINES.TEL;
  if (upper.startsWith('BP') || upper === 'BPL') return CANONICAL_LINES.BPL;
  if (upper === 'SK' || upper.startsWith('SE') || upper.startsWith('SW') || upper.startsWith('STC') || upper === 'SKLRT' || upper === 'STL') return CANONICAL_LINES.SKLRT;
  if (upper === 'PG' || upper.startsWith('PE') || upper.startsWith('PW') || upper.startsWith('PTC') || upper === 'PGLRT' || upper === 'PTL') return CANONICAL_LINES.PGLRT;

  return null;
}

// Convert canonical line ID to PCD query code
export function toPCDLineCode(canonicalId) {
  const line = CANONICAL_LINES[canonicalId];
  return line ? line.pcdCode : canonicalId;
}

// Convert canonical line ID to TrainServiceAlerts code
export function toAlertLineCode(canonicalId) {
  const line = CANONICAL_LINES[canonicalId];
  return line ? line.alertCode : canonicalId;
}

