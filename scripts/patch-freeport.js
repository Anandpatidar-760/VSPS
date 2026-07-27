const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "node_modules", "freeport-async", "index.js");

if (!fs.existsSync(filePath)) {
  process.exit(0);
}

let source = fs.readFileSync(filePath, "utf8");

if (!source.includes("VSPS_NODE24_PORT_PATCH")) {
  source = source.replace(
    "function testPortAsync(port, hostname) {\n  return new Promise(function(fulfill, reject) {",
    "function testPortAsync(port, hostname) {\n  // VSPS_NODE24_PORT_PATCH: Node 24 throws synchronously for invalid ports.\n  if (port < 0 || port > 65535) {\n    return Promise.resolve(false);\n  }\n  return new Promise(function(fulfill, reject) {"
  );

  source = source.replace(
    "    var lowPort = rangeStart || DEFAULT_PORT_RANGE_START;\n    var awaitables = [];",
    "    var lowPort = rangeStart || DEFAULT_PORT_RANGE_START;\n    if (lowPort < 0 || lowPort > 65535 || lowPort + rangeSize - 1 > 65535) {\n      lowPort = DEFAULT_PORT_RANGE_START;\n    }\n    var awaitables = [];"
  );

  fs.writeFileSync(filePath, source);
  console.log("Patched freeport-async for Node 24 port validation.");
}
