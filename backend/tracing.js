require('dotenv').config();
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const logLevel = process.env.OTEL_LOG_LEVEL === 'debug' ? DiagLogLevel.DEBUG : DiagLogLevel.INFO;
diag.setLogger(new DiagConsoleLogger(), logLevel);

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Define trace exporter to send to SigNoz OTel Collector (OTLP HTTP port 4318)
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT 
    ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces` 
    : 'http://localhost:4318/v1/traces'
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

// Gracefully shut down the SDK on process termination
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((err) => console.log('Error shutting down SDK', err))
    .finally(() => process.exit(0));
});

module.exports = sdk;
