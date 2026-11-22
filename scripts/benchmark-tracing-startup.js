#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const backendDir = path.resolve(__dirname, '../backend');
const samples = Number.parseInt(process.argv[2], 10) || 7;
const probe = `
  const start = process.hrtime.bigint();
  const cpuStart = process.cpuUsage();
  require('dotenv').config();
  if (process.env.OTEL_ENABLED === 'true') require('./tracing');
  setImmediate(() => {
    const cpu = process.cpuUsage(cpuStart);
    console.log(JSON.stringify({
      ms: Number(process.hrtime.bigint() - start) / 1e6,
      rssBytes: process.memoryUsage().rss,
      cpuMs: (cpu.user + cpu.system) / 1000,
    }));
    process.exit(0);
  });
`;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(enabled) {
  const rows = [];
  for (let i = 0; i < samples; i += 1) {
    const result = spawnSync(process.execPath, ['-e', probe], {
      cwd: backendDir,
      encoding: 'utf8',
      timeout: 20000,
      env: {
        ...process.env,
        OTEL_ENABLED: String(enabled),
        OTEL_EXPORTER_OTLP_ENDPOINT: 'http://127.0.0.1:4318',
      },
    });
    if (result.status !== 0) throw new Error(result.stderr || `Probe exited ${result.status}`);
    rows.push(JSON.parse(result.stdout.trim().split('\n').at(-1)));
  }
  return Object.fromEntries(['ms', 'rssBytes', 'cpuMs'].map((key) => [key, median(rows.map((row) => row[key]))]));
}

if (!Number.isInteger(samples) || samples < 1 || samples > 100) {
  throw new Error('Sample count must be an integer from 1 to 100');
}

console.log(JSON.stringify({
  node: process.version,
  samplesPerMode: samples,
  tracingEnabled: measure(true),
  tracingDisabled: measure(false),
  scope: 'Cold process tracing initialization only; excludes Express startup, MongoDB, inference, and request latency.',
}, null, 2));
