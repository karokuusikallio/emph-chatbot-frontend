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
    const interceptLoginResponse = (proxyRes: http.IncomingMessage) => {
      let apiResponseBody = "";
      proxyRes.on("data", (chunk) => {
        apiResponseBody += chunk;
      });
      proxyRes.on("end", () => {
        const { authToken } = JSON.parse(apiResponseBody);
        if (authToken) {
          const cookies = new Cookies(req, res);
          cookies.set("auth-token", authToken, {
            httpOnly: true,
            sameSite: "lax",
          });
          return res.status(200).json({ loggedIn: true });
        }

        return res.status(400).json({ error: "Invalid credentials." });
      });
    };

    const interceptLogoutRequest = () => {
      const cookies = new Cookies(req, res);
      cookies.set("auth-token", "", {
        expires: new Date("1995-12-17T03:24:00"),
      });
      return res.status(200).json({ loggedIn: false });
    };

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
      proxy.once("proxyRes", interceptLoginResponse);
    }
    if (isLogout) {
      proxy.once("proxyReq", interceptLogoutRequest);
    }

    proxy.once("error", reject);
    proxy.web(req, res, {
      target: API_URL,
      autoRewrite: false,
      changeOrigin: true,
      selfHandleResponse: isLogin || isLogout,
    });
  });
};

export default apiProxy;
