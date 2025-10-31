import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { APILog } from './types';

interface MetricsCardsProps {
  logs: APILog[];
}

export const MetricsCards = ({ logs }: MetricsCardsProps) => {
  const totalRequests = logs.length;
  const successRate = ((logs.filter(l => l.status >= 200 && l.status < 300).length / totalRequests) * 100).toFixed(1);
  const avgDuration = Math.round(logs.reduce((sum, l) => sum + l.duration, 0) / totalRequests);
  const errorCount = logs.filter(l => l.status >= 400).length;

  return (
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
  );
};
