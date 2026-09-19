// Optional LTA DataMall credentials. Keep real credentials out of source control.
const LTA_CONFIG = {
  accountKey: '',
  apiKey: '',
};

export function getEffectiveCredentials() {
  let accountKey = LTA_CONFIG.accountKey.trim();
  let apiKey = LTA_CONFIG.apiKey.trim();

  if (typeof window !== 'undefined' && window.localStorage) {
    const storedAccountKey = window.localStorage.getItem('LTA_DATAMALL_ACCOUNT_KEY');
    const storedApiKey = window.localStorage.getItem('LTA_DATAMALL_SECONDARY_API_KEY');

    if (storedAccountKey && storedAccountKey.trim().length > 0) {
      accountKey = storedAccountKey.trim();
    }
    if (storedApiKey && storedApiKey.trim().length > 0) {
      apiKey = storedApiKey.trim();
    }
  }

  return { accountKey, apiKey };
}

export function getEffectiveApiKey() {
  const { accountKey, apiKey } = getEffectiveCredentials();
  return accountKey || apiKey;
}

export function saveEffectiveCredentials({ accountKey, apiKey }) {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (accountKey && accountKey.trim().length > 0) {
      window.localStorage.setItem('LTA_DATAMALL_ACCOUNT_KEY', accountKey.trim());
    } else {
      window.localStorage.removeItem('LTA_DATAMALL_ACCOUNT_KEY');
    }

    if (apiKey && apiKey.trim().length > 0) {
      window.localStorage.setItem('LTA_DATAMALL_SECONDARY_API_KEY', apiKey.trim());
    } else {
      window.localStorage.removeItem('LTA_DATAMALL_SECONDARY_API_KEY');
    }
  }
}