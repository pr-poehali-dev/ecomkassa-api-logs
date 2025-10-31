export interface APILog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  duration: number;
  size: string;
  source: 'bitrix' | 'ecomkassa';
  request?: {
    headers: Record<string, string>;
    body: any;
  };
  response?: {
    headers: Record<string, string>;
    body: any;
  };
}

export interface PerformanceDataPoint {
  time: string;
  avg: number;
  p95: number;
}

export interface StatusDataPoint {
  name: string;
  count: number;
}
