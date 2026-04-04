#!/usr/bin/env node

const DEBUG_HOST = process.env.AO3_CDP_HOST || "127.0.0.1";
const DEBUG_PORT = process.env.AO3_CDP_PORT || "9222";
const TARGET_MATCH = process.env.AO3_CDP_TARGET || "archiveofourown.org";

async function fetchJson(pathname) {
  const response = await fetch(`http://${DEBUG_HOST}:${DEBUG_PORT}${pathname}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

async function getTargets() {
  return await fetchJson("/json/list");
}

async function getTarget(match = TARGET_MATCH) {
  const targets = await getTargets();
  const target = targets.find(
    (item) => item.type === "page" && (item.url.includes(match) || item.title.includes(match)),
  );

  if (!target) {
    throw new Error(`No page target matched "${match}"`);
  }

  return target;
}

async function sendCdp(target, method, params = {}) {
  return await new Promise((resolve, reject) => {
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    const id = 1;
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error(`Timed out waiting for ${method}`));
    }, 10000);

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ id, method, params }));
    });

    ws.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.id !== id) {
        return;
      }

      clearTimeout(timeout);
      ws.close();

      if (payload.error) {
        reject(new Error(payload.error.message || `CDP error for ${method}`));
        return;
      }

      resolve(payload.result);
    });

    ws.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error(`WebSocket error for ${method}`));
    });
  });
}

async function evalExpr(target, expression) {
  const result = await sendCdp(target, "Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (!result.result) {
    return null;
  }

  return result.result.value;
}

async function navigate(target, url) {
  return await sendCdp(target, "Page.navigate", { url });
}

function usage() {
  console.error(
    [
      "Usage:",
      "  node dev/scripts/ao3-cdp.mjs list",
      "  node dev/scripts/ao3-cdp.mjs eval '<expression>' [target-match]",
      "  node dev/scripts/ao3-cdp.mjs navigate <url> [target-match]",
    ].join("\n"),
  );
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    usage();
    process.exit(1);
  }

  if (command === "list") {
    const targets = await getTargets();
    console.log(
      JSON.stringify(
        targets.map((target) => ({
          id: target.id,
          type: target.type,
          title: target.title,
          url: target.url,
        })),
        null,
        2,
      ),
    );
    return;
  }

  if (command === "eval") {
    const [expression, match = TARGET_MATCH] = args;
    if (!expression) {
      usage();
      process.exit(1);
    }

    const target = await getTarget(match);
    const value = await evalExpr(target, expression);
    if (typeof value === "string") {
      console.log(value);
      return;
    }
    console.log(JSON.stringify(value, null, 2));
    return;
  }

  if (command === "navigate") {
    const [url, match = TARGET_MATCH] = args;
    if (!url) {
      usage();
      process.exit(1);
    }

    const target = await getTarget(match);
    const result = await navigate(target, url);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  usage();
  process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
