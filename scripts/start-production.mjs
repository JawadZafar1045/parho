import { execFileSync, spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const port = Number(process.env.PORT || 3000);
const projectPath = process.cwd();

function isPortInUse() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function stopProjectServerOnWindows() {
  const escapedProjectPath = projectPath.replaceAll("'", "''");
  const command = [
    `$projectPath = '${escapedProjectPath}'`,
    `$processes = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($projectPath) -and $_.CommandLine -match 'next.*start' }`,
    `if (-not $processes) { exit 2 }`,
    `$processes | ForEach-Object { taskkill /PID $_.ProcessId /T /F | Out-Null }`,
  ].join("; ");

  try {
    execFileSync("powershell.exe", ["-NoProfile", "-Command", command], { stdio: "ignore" });
    return true;
  } catch (error) {
    if (error.status === 2) {
      return false;
    }
    throw error;
  }
}

async function start() {
  if (await isPortInUse()) {
    const stopped = process.platform === "win32" ? stopProjectServerOnWindows() : false;

    if (!stopped || (await isPortInUse())) {
      console.error(`Port ${port} is already in use by another process.`);
      console.error(`Stop that process or run with a different port: npm.cmd start -- -p 3001`);
      process.exit(1);
    }

    console.log(`Stopped the stale project server on port ${port}.`);
  }

  const nextEntrypoint = path.join(
    projectPath,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const server = spawn(process.execPath, [nextEntrypoint, "start", "-p", String(port)], {
    stdio: "inherit",
  });

  server.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
}

start().catch((error) => {
  console.error("Could not start the production server.", error);
  process.exit(1);
});
