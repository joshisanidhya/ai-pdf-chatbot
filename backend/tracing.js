const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const logLevel = process.env.OTEL_LOG_LEVEL === 'debug' ? DiagLogLevel.DEBUG : DiagLogLevel.INFO;
diag.setLogger(new DiagConsoleLogger(), logLevel);

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
if (!endpoint) {
  throw new Error('Set OTEL_EXPORTER_OTLP_ENDPOINT when OTEL_ENABLED=true.');
}

// Only initialize the exporter when tracing is explicitly enabled.
const traceExporter = new OTLPTraceExporter({
  url: `${endpoint.replace(/\/+$/, '')}/v1/traces`
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false // Disable noisy file system traces
      }
    })
  ]
});

// Initialize the SDK
sdk.start();

module.exports = sdk;
