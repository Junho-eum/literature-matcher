const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/anthropic",
    createProxyMiddleware({
      target: "https://api.anthropic.com",
      changeOrigin: true,
      pathRewrite: { "^/anthropic": "" },
      on: {
        proxyReq: (proxyReq, req) => {
          const apiKey = req.headers["x-api-key"];
          if (apiKey) proxyReq.setHeader("x-api-key", apiKey);
          // Add CORS bypass header server-side
          proxyReq.setHeader(
            "anthropic-dangerous-direct-browser-access",
            "true",
          );
        },
      },
    }),
  );
};
