#!/usr/bin/env node
/// <reference types="node" />

const { spawn } = require("child_process");

console.log("🚀 Starting development server...");

// Run CSS watcher
const cssWatcher = spawn("yarn", ["watch:css"], {
  stdio: "inherit",
  shell: true,
});

// Run Eleventy server
const eleventyServer = spawn("yarn", ["watch:11ty"], {
  stdio: "inherit",
  shell: true,
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n⏹️  Shutting down development server...");

  // Kill both processes
  cssWatcher.kill("SIGTERM");
  eleventyServer.kill("SIGTERM");

  // Exit after a short delay
  setTimeout(() => {
    process.exit(0);
  }, 100);
});

// Handle child process errors
cssWatcher.on("error", (err) => {
  console.error("❌ CSS watcher error:", err);
  process.exit(1);
});

eleventyServer.on("error", (err) => {
  console.error("❌ Eleventy server error:", err);
  process.exit(1);
});
