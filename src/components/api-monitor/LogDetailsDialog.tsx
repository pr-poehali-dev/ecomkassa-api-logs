import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { APILog } from './types';
import { getStatusColor, getMethodColor } from './utils';

interface LogDetailsDialogProps {
  log: APILog | null;
  onClose: () => void;
}

export const LogDetailsDialog = ({ log, onClose }: LogDetailsDialogProps) => {
  if (!log) return null;

  return (
    <Dialog open={!!log} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-success">
            <Icon name="Code" size={24} />
            Request Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded border border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Method</p>
              <Badge variant="outline" className={getMethodColor(log.method)}>
                {log.method}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
              <span className={`font-bold ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Endpoint</p>
              <p className="font-mono text-sm">{log.endpoint}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
              <p className="text-sm">{log.duration}ms</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Timestamp</p>
              <p className="font-mono text-sm">{log.timestamp}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Source</p>
              <Badge variant="outline" className="capitalize">{log.source}</Badge>
            </div>
          </div>

          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="request" className="data-[state=active]:bg-success data-[state=active]:text-black">
                <Icon name="ArrowUpRight" size={16} className="mr-2" />
                Request
              </TabsTrigger>
              <TabsTrigger value="response" className="data-[state=active]:bg-success data-[state=active]:text-black">
                <Icon name="ArrowDownLeft" size={16} className="mr-2" />
                Response
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-warning flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Headers
                </h4>
                <pre className="bg-background p-4 rounded border border-border overflow-x-auto text-xs">
                  <code className="text-foreground">{JSON.stringify(log.request?.headers || {}, null, 2)}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-warning flex items-center gap-2">
                  <Icon name="Braces" size={16} />
                  Body
                </h4>
                <pre className="bg-background p-4 rounded border border-border overflow-x-auto text-xs">
                  <code className="text-foreground">{log.request?.body ? JSON.stringify(log.request.body, null, 2) : 'null'}</code>
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="response" className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-info flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Headers
                </h4>
                <pre className="bg-background p-4 rounded border border-border overflow-x-auto text-xs">
                  <code className="text-foreground">{JSON.stringify(log.response?.headers || {}, null, 2)}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-info flex items-center gap-2">
                  <Icon name="Braces" size={16} />
                  Body
                </h4>
                <pre className="bg-background p-4 rounded border border-border overflow-x-auto text-xs">
                  <code className="text-foreground">{log.response?.body ? JSON.stringify(log.response.body, null, 2) : 'null'}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(log, null, 2))}
            >
              <Icon name="Copy" size={16} />
              Copy All
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={onClose}
            >
              <Icon name="X" size={16} />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
