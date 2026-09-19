// Metro Configuration for Expo
// Includes local proxy middleware for LTA DataMall to bypass browser CORS in web mode.

const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Proxy /api/lta/* requests directly to LTA DataMall servers
      if (req.url.startsWith('/api/lta/')) {
        const endpoint = req.url.replace('/api/lta/', '');
        const targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/${endpoint}`;

        const accountKey = req.headers['accountkey'] || req.headers['accountKey'] || '';
        const apiKey = req.headers['apikey'] || req.headers['apiKey'] || '';

        const headers = {
          'accept': 'application/json',
        };
        if (accountKey) headers['AccountKey'] = accountKey;
        if (apiKey) headers['ApiKey'] = apiKey;

        const proxyReq = https.request(
          targetUrl,
          {
            method: req.method,
            headers,
          },
          (proxyRes) => {
            res.statusCode = proxyRes.statusCode;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');

            proxyRes.pipe(res);
          }
        );

        proxyReq.on('error', (err) => {
          console.error('[LTA Proxy Error]:', err.message);
          res.statusCode = 502;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ error: 'Failed to connect to LTA DataMall', details: err.message }));
        });

        req.pipe(proxyReq);
        return;
      }

      // Handle CORS preflight for /api/lta
      if (req.method === 'OPTIONS' && req.url.startsWith('/api/lta/')) {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.end();
        return;
      }

      return middleware(req, res, next);
    };
  },
};

module.exports = config;

