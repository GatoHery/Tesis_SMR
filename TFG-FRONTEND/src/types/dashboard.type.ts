export interface Metrics {
  noise: MetricContent
  labsMonitored: MetricContent
  maxDbs: MetricContent
  sensorActivity: MetricContent
}

export interface MetricContent {
  value: number;
  change: number;
}

export interface GrahpsData {
  values: number[];
  labels: string[];
}