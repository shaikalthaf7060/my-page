import { Client } from "basic-ftp";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

async function deploy() {
  const host = process.env.FTP_HOST || "ftpupload.net";
  const user = process.env.FTP_USER || "cpfr_42955704";
  const password = process.env.FTP_PASSWORD;
  const port = parseInt(process.env.FTP_PORT, 10) || 21;
  const remoteDir = process.env.FTP_REMOTE_DIR || "/htdocs";

  if (!password) {
    console.error("Error: Missing FTP_PASSWORD environment variable.");
    console.error("Please set FTP_PASSWORD in your environment or in a .env file.");
    process.exit(1);
  }

  if (!fs.existsSync(distDir) || fs.readdirSync(distDir).length === 0) {
    console.log("dist directory not found or empty. Running build...");
    execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
  }

  const client = new Client();
  client.ftp.verbose = false;

  try {
    console.log(`Connecting to FTP server ${host}:${port} as ${user}...`);
    await client.access({
      host,
      user,
      password,
      port,
      secure: false,
    });
    console.log("Connected successfully.");

    await client.ensureDir(remoteDir);
    console.log(`Uploading production build from "${distDir}" to "${remoteDir}"...`);

    let lastLogged = Date.now();
    client.trackProgress((info) => {
      const now = Date.now();
      if (now - lastLogged > 2000 || info.bytes === info.bytesOverall) {
        lastLogged = now;
        const mb = (info.bytesOverall / (1024 * 1024)).toFixed(2);
        console.log(`Transferring: ${info.name} (${mb} MB transferred)`);
      }
    });

    await client.uploadFromDir(distDir, remoteDir);

    client.trackProgress();

    console.log("Deployment completed successfully!");
    console.log("Site live at: http://althafcm.cpanelfree.com");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
