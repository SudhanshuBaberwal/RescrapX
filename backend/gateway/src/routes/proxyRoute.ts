import proxy from "express-http-proxy";

export const proxyRoutes = (target: string) => {
  return proxy(target, {
    parseReqBody: false,

    proxyReqOptDecorator(proxyReqOpts, srcReq: any) {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
        proxyReqOpts.headers["x-user-role"] = srcReq.user.role;
      }

      let token: string | undefined;
      if (srcReq.cookies?.accessToken) {
        token = srcReq.cookies.accessToken;
      }
      if (!token && srcReq.headers.authorization) {
        const authHeader = srcReq.headers.authorization;

        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }
      if (token) {
        proxyReqOpts.headers["authorization"] = `Bearer ${token}`;
      }

      return proxyReqOpts;
    },
  });
};