export const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'status-success';
  if (status >= 300 && status < 400) return 'status-info';
  if (status >= 400 && status < 500) return 'status-warning';
  return 'status-error';
};

export const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    'GET': 'bg-info/20 text-info border-info/30',
    'POST': 'bg-success/20 text-success border-success/30',
    'PUT': 'bg-warning/20 text-warning border-warning/30',
    'PATCH': 'bg-warning/20 text-warning border-warning/30',
    'DELETE': 'bg-error/20 text-error border-error/30',
  };
  return colors[method] || 'bg-muted text-muted-foreground';
};
