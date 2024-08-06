import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import { join } from "path";

export function generateJWT(): string {
  const filePath = join(process.cwd(), "./AuthKey_D78TR2BW8M.p8");

  const privateKey = fs.readFileSync(filePath, "utf-8").toString();
  // read this from env vars

  const teamId = process.env.APPLE_DEVELOPER_TEAM_ID;
  const keyId = process.env.APPLE_DEVELOPER_KEY_ID;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 15777000, // 6 months in seconds
  };

  const header = {
    alg: "ES256",
    kid: keyId,
  };

  return jwt.sign(payload, privateKey, { algorithm: "ES256", header: header });
}
