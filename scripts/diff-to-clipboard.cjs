/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

function getClipboardCommand() {
  const platform = os.platform();

  // Windows
  if (platform === "win32") {
    return { cmd: "clip", type: "stdin" };
  }

  // macOS
  if (platform === "darwin") {
    return { cmd: "pbcopy", type: "stdin" };
  }

  // Linux - try multiple tools
  if (platform === "linux") {
    try {
      execSync("which xclip", { stdio: "ignore" });
      return { cmd: "xclip -selection clipboard", type: "stdin" };
    } catch (e) {
      try {
        execSync("which xsel", { stdio: "ignore" });
        return { cmd: "xsel --clipboard", type: "stdin" };
      } catch (e) {
        try {
          execSync("which wl-copy", { stdio: "ignore" });
          return { cmd: "wl-copy", type: "stdin" };
        } catch (e) {
          throw new Error(
            "No clipboard tool found. Please install xclip, xsel, or wl-clipboard",
          );
        }
      }
    }
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

function copyToClipboard(text) {
  const { cmd } = getClipboardCommand();

  try {
    if (os.platform() === "win32") {
      const tempFile = path.join(os.tmpdir(), `git-diff-${Date.now()}.txt`);
      fs.writeFileSync(tempFile, text, "utf8");
      execSync(`type "${tempFile}" | ${cmd}`, { stdio: "ignore" });
      fs.unlinkSync(tempFile);
    } else {
      const { spawn } = require("child_process");
      const process = spawn(cmd, {
        shell: true,
        stdio: ["pipe", "ignore", "ignore"],
      });
      process.stdin.write(text);
      process.stdin.end();
    }
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error.message);
    return false;
  }
}

function main() {
  try {
    const diff = execSync("git diff --staged", { encoding: "utf8" });

    if (!diff || !diff.trim()) {
      console.log("❌ No staged changes to copy");
      console.log('💡 Tip: Run "git add" to stage changes first');
      process.exit(1);
    }

    if (copyToClipboard(diff)) {
      const lines = diff.split("\n").length;
      const sizeKB = Math.round(diff.length / 1024);
      console.log(`✅ Git diff (staged) copied to clipboard`);
      console.log(`   📊 ${lines} lines | ${sizeKB} KB`);
    } else {
      process.exit(1);
    }
  } catch (error) {
    if (error.message.includes("git diff")) {
      console.error("❌ Not a git repository");
    } else {
      console.error("❌ Error:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getClipboardCommand, copyToClipboard };
