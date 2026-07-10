/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

// پرامپت ثابت برای ارسال به LLM
const COMMIT_PROMPT = `Generate a Conventional Commit message from this git diff.

## Rules
- Analyze the ENTIRE diff before writing the message — cover all meaningful changes, not just the first file
- Use Conventional Commits format: \\\`<type>(<scope>): <subject>\\\`
- Choose the best type: feat, fix, refactor, chore, docs, test, build, ci
- Scope is optional, add it only if obvious from the changed paths
- Subject must be short, imperative, present tense, under 72 characters
- Body bullet points must be accurate to the diff, do not invent changes
- Do not explain anything outside the required output
- Output only the two variants below, nothing else
- result EXACT to be show in 2 Markdown module for easy Copy/Paste.

## Output Format
Wrap the entire output in ONE markdown code block (\\\`\\\`\\\`text ... \\\`\\\`\\\`) with this exact structure:

### Simplified
<type>(<scope>): <subject>

### Detailed
<type>(<scope>): <subject>

- <key change 1>
- <key change 2>
- <key change 3 if needed>

## Git diff
`;

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

    // الحاق پرامپت به ابتدای Git Diff
    const formattedPayload = `${COMMIT_PROMPT}\n${diff}`;

    if (copyToClipboard(formattedPayload)) {
      const lines = formattedPayload.split("\n").length;
      const sizeKB = Math.round(
        Buffer.byteLength(formattedPayload, "utf8") / 1024,
      );
      console.log(`✅ Git diff with Prompt successfully copied to clipboard`);
      console.log(`   📊 ${lines} lines (including prompt) | ${sizeKB} KB`);
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
