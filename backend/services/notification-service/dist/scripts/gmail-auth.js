import "dotenv/config";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import { google } from "googleapis";
import http from "node:http";
import { URL } from "node:url";
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
if (!CLIENT_ID) {
    throw new Error("GMAIL_CLIENT_ID is missing in .env");
}
if (!CLIENT_SECRET) {
    throw new Error("GMAIL_CLIENT_SECRET is missing in .env");
}
const REDIRECT_URI = "http://localhost:8002/oauth2callback";
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const scopes = [
    "https://www.googleapis.com/auth/gmail.send",
];
const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
});
console.log("\n=================================");
console.log("Google Gmail OAuth");
console.log("=================================\n");
console.log("Open this URL in your browser:\n");
console.log(authorizationUrl);
console.log("\nWaiting for Google callback...\n");
const server = http.createServer(async (req, res) => {
    if (!req.url) {
        return;
    }
    const url = new URL(req.url, REDIRECT_URI);
    if (url.pathname !== "/oauth2callback") {
        res.writeHead(404);
        res.end("Not found");
        return;
    }
    const error = url.searchParams.get("error");
    if (error) {
        console.error("\nGoogle OAuth error:", error);
        res.writeHead(400, {
            "Content-Type": "text/html",
        });
        res.end(`
        <h2>OAuth failed</h2>
        <p>${error}</p>
        <p>You can close this tab.</p>
      `);
        server.close();
        return;
    }
    const code = url.searchParams.get("code");
    if (!code) {
        res.writeHead(400, {
            "Content-Type": "text/html",
        });
        res.end(`
        <h2>Authorization code missing</h2>
      `);
        server.close();
        return;
    }
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log("\n=================================");
        console.log("OAuth successful!");
        console.log("=================================\n");
        console.log("Access Token:", tokens.access_token);
        console.log("\nRefresh Token:", tokens.refresh_token);
        console.log("\nScope:", tokens.scope);
        console.log("\nToken Type:", tokens.token_type);
        res.writeHead(200, {
            "Content-Type": "text/html",
        });
        res.end(`
        <html>
          <body>
            <h2>Gmail authorization successful!</h2>
            <p>You can close this browser tab.</p>
            <p>Check your terminal for the refresh token.</p>
          </body>
        </html>
      `);
        server.close();
    }
    catch (error) {
        console.error("\nFailed to exchange authorization code:");
        console.error(error?.response?.data ||
            error.message ||
            error);
        res.writeHead(500, {
            "Content-Type": "text/html",
        });
        res.end(`
        <h2>OAuth failed</h2>
        <p>Check your terminal.</p>
      `);
        server.close();
    }
});
server.listen(8002, () => {
    console.log("OAuth callback server listening on:");
    console.log("http://localhost:8002/oauth2callback\n");
});
