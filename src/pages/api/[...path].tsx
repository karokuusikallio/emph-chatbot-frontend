import httpProxy from "http-proxy";
import * as http from "http";
import Cookies from "cookies";
import url from "url";
import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.API_URL;
const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiProxy = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    const pathname = url.parse(req.url as string).pathname;
    const isLogin = pathname === "/api/login";

    const cookies = new Cookies(req, res);
    const authToken = cookies.get("auth-token");
    req.headers.cookie = "";
    if (authToken) {
      req.headers["auth-token"] = authToken;
    }
    if (isLogin) {
      const interceptLoginResponse = (proxyRes: http.IncomingMessage) => {
        let apiResponseBody = "";
        proxyRes.on("data", (chunk) => {
          apiResponseBody += chunk;
        });
        proxyRes.on("end", () => {
          try {
            const { authToken } = JSON.parse(apiResponseBody);
            const cookies = new Cookies(req, res);
            cookies.set("auth-token", authToken, {
              httpOnly: true,
              sameSite: "lax",
            });
            res.status(200).json({ loggedIn: true });
            resolve();
          } catch (err) {
            res.status(200).json({ err });
          }
        });
      };
      proxy.once("proxyRes", interceptLoginResponse);
    }
    proxy.once("error", reject);
    proxy.web(req, res, {
      target: API_URL,
      autoRewrite: false,

      selfHandleResponse: isLogin,
    });
  });
};

export default apiProxy;
