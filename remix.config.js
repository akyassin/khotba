const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  future: {
    v2_dev: { port: 8002 },
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    v2_meta: true,
    v2_headers: true,
  },
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes);
  },
};
