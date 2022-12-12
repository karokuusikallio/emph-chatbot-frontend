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
    const isLogout = pathname === "/api/logout";

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
          } catch (error) {
            res.status(400).json({ error });
          }
        });
      };
      proxy.once("proxyRes", interceptLoginResponse);
    }
    if (isLogout) {
      const interceptLogoutRequest = () => {
        const cookies = new Cookies(req, res);
        cookies.set("auth-token", "", {
          expires: new Date("1995-12-17T03:24:00"),
        });
        res.status(200).json({ loggedIn: false });
        resolve();
      };

      proxy.once("proxyReq", interceptLogoutRequest);
    }

    proxy.once("error", reject);
    proxy.web(req, res, {
      target: API_URL,
      autoRewrite: false,
      changeOrigin: false,
      selfHandleResponse: isLogin,
    });
  });
};

export default apiProxy;
