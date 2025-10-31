import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface APILog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  duration: number;
  size: string;
  source: 'bitrix' | 'ecomkassa';
}

const mockLogs: APILog[] = [
  { id: '1', timestamp: '2025-10-31 14:23:45', method: 'POST', endpoint: '/api/v1/create-order', status: 200, duration: 234, size: '2.1 KB', source: 'ecomkassa' },
  { id: '2', timestamp: '2025-10-31 14:23:42', method: 'GET', endpoint: '/api/v1/orders/list', status: 200, duration: 156, size: '15.3 KB', source: 'bitrix' },
  { id: '3', timestamp: '2025-10-31 14:23:38', method: 'POST', endpoint: '/api/v1/payment/init', status: 500, duration: 1023, size: '0.5 KB', source: 'ecomkassa' },
  { id: '4', timestamp: '2025-10-31 14:23:35', method: 'GET', endpoint: '/api/v1/products', status: 200, duration: 89, size: '42.7 KB', source: 'bitrix' },
  { id: '5', timestamp: '2025-10-31 14:23:30', method: 'PATCH', endpoint: '/api/v1/order/1234/status', status: 201, duration: 312, size: '1.2 KB', source: 'ecomkassa' },
  { id: '6', timestamp: '2025-10-31 14:23:28', method: 'POST', endpoint: '/api/v1/webhook/payment', status: 200, duration: 445, size: '3.4 KB', source: 'ecomkassa' },
  { id: '7', timestamp: '2025-10-31 14:23:25', method: 'GET', endpoint: '/api/v1/customers/search', status: 404, duration: 67, size: '0.3 KB', source: 'bitrix' },
  { id: '8', timestamp: '2025-10-31 14:23:20', method: 'DELETE', endpoint: '/api/v1/cart/items/56', status: 204, duration: 123, size: '0 KB', source: 'bitrix' },
];

const performanceData = [
  { time: '14:20', avg: 180, p95: 450 },
  { time: '14:21', avg: 220, p95: 520 },
  { time: '14:22', avg: 195, p95: 480 },
  { time: '14:23', avg: 310, p95: 890 },
  { time: '14:24', avg: 240, p95: 550 },
];

const statusData = [
  { name: '2xx', count: 1245 },
  { name: '3xx', count: 89 },
  { name: '4xx', count: 156 },
  { name: '5xx', count: 34 },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.method.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'success' && log.status >= 200 && log.status < 300) ||
                         (filterStatus === 'error' && log.status >= 400);
    const matchesSource = filterSource === 'all' || log.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-info';
    if (status >= 400 && status < 500) return 'status-warning';
    return 'status-error';
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'GET': 'bg-info/20 text-info border-info/30',
      'POST': 'bg-success/20 text-success border-success/30',
      'PUT': 'bg-warning/20 text-warning border-warning/30',
      'PATCH': 'bg-warning/20 text-warning border-warning/30',
      'DELETE': 'bg-error/20 text-error border-error/30',
    };
    return colors[method] || 'bg-muted text-muted-foreground';
  };

  const totalRequests = mockLogs.length;
  const successRate = ((mockLogs.filter(l => l.status >= 200 && l.status < 300).length / totalRequests) * 100).toFixed(1);
  const avgDuration = Math.round(mockLogs.reduce((sum, l) => sum + l.duration, 0) / totalRequests);
  const errorCount = mockLogs.filter(l => l.status >= 400).length;

  return (
    <div className="min-h-screen bg-background p-6 console-text">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-success flex items-center gap-3">
              <Icon name="Terminal" size={32} />
              EcomBitrix API Monitor
            </h1>
            <p className="text-muted-foreground mt-1">Real-time API logging & analytics</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
            <span>Live monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-border bg-card hover:border-success/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Requests</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalRequests}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                <Icon name="Activity" size={24} className="text-info" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border bg-card hover:border-success/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Success Rate</p>
                <p className="text-2xl font-bold text-success mt-1">{successRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border bg-card hover:border-success/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Response</p>
                <p className="text-2xl font-bold text-warning mt-1">{avgDuration}ms</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-warning" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border bg-card hover:border-error/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Errors</p>
                <p className="text-2xl font-bold text-error mt-1">{errorCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-error/20 flex items-center justify-center">
                <Icon name="AlertCircle" size={24} className="text-error" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Response Time (ms)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '4px'
                  }}
                />
                <Line type="monotone" dataKey="avg" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Status Codes Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '4px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--info))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search logs... (endpoint, method)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px] bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success (2xx)</SelectItem>
                  <SelectItem value="error">Errors (4xx, 5xx)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full md:w-[180px] bg-background border-border">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="bitrix">Bitrix24</SelectItem>
                  <SelectItem value="ecomkassa">Ecomkassa</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Icon name="Download" size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="text-left p-4 font-medium">Timestamp</th>
                  <th className="text-left p-4 font-medium">Method</th>
                  <th className="text-left p-4 font-medium">Endpoint</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Size</th>
                  <th className="text-left p-4 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr 
                    key={log.id} 
                    className="border-b border-border hover:bg-muted/20 transition-colors animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4 text-sm text-muted-foreground font-mono">{log.timestamp}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={getMethodColor(log.method)}>
                        {log.method}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm font-mono">{log.endpoint}</td>
                    <td className="p-4">
                      <span className={`font-bold ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{log.duration}ms</td>
                    <td className="p-4 text-sm text-muted-foreground">{log.size}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {log.source}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No logs found matching your filters</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
