import proxy from "express-http-proxy";

export const proxyRoutes = (target: string) => {
  return proxy(target, {
    parseReqBody:false,
    proxyReqOptDecorator(proxyReqOpts, srcReq: any) {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
        proxyReqOpts.headers["x-user-role"] = srcReq.user.role;
      }
      console.log(srcReq.user)
      return proxyReqOpts;
    },
  });
};