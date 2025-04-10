export interface LogEntry {
  timestamp: string;
  ip: string;
  userAgent: string;
  url: string;
  statusCode: number;
  botType: string | null;
  contentType: string;
}
