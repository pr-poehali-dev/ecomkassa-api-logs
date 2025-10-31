import { APILog, PerformanceDataPoint, StatusDataPoint } from './types';

export const mockLogs: APILog[] = [
  { 
    id: '1', 
    timestamp: '2025-10-31 14:23:45', 
    method: 'POST', 
    endpoint: '/api/v1/create-order', 
    status: 200, 
    duration: 234, 
    size: '2.1 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'ek_live_***', 'User-Agent': 'Bitrix24/1.0' },
      body: { orderId: 'ORD-12345', amount: 5000, currency: 'RUB', customer: { email: 'client@example.com', phone: '+79991234567' } }
    },
    response: {
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'req_abc123' },
      body: { success: true, paymentId: 'pay_xyz789', status: 'pending', redirectUrl: 'https://pay.ecomkassa.ru/pay_xyz789' }
    }
  },
  { 
    id: '2', 
    timestamp: '2025-10-31 14:23:42', 
    method: 'GET', 
    endpoint: '/api/v1/orders/list', 
    status: 200, 
    duration: 156, 
    size: '15.3 KB', 
    source: 'bitrix',
    request: {
      headers: { 'Authorization': 'Bearer btx_***', 'Accept': 'application/json' },
      body: null
    },
    response: {
      headers: { 'Content-Type': 'application/json' },
      body: { total: 156, items: [{ id: 1, status: 'paid' }, { id: 2, status: 'pending' }] }
    }
  },
  { 
    id: '3', 
    timestamp: '2025-10-31 14:23:38', 
    method: 'POST', 
    endpoint: '/api/v1/payment/init', 
    status: 500, 
    duration: 1023, 
    size: '0.5 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'ek_live_***' },
      body: { orderId: 'ORD-ERROR', amount: -100 }
    },
    response: {
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'INVALID_AMOUNT', message: 'Amount must be positive', code: 'ERR_VALIDATION' }
    }
  },
  { 
    id: '4', 
    timestamp: '2025-10-31 14:23:35', 
    method: 'GET', 
    endpoint: '/api/v1/products', 
    status: 200, 
    duration: 89, 
    size: '42.7 KB', 
    source: 'bitrix',
    request: {
      headers: { 'Authorization': 'Bearer btx_***' },
      body: null
    },
    response: {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=3600' },
      body: { products: [{ id: 1, name: 'Product A', price: 1000 }, { id: 2, name: 'Product B', price: 2500 }] }
    }
  },
  { 
    id: '5', 
    timestamp: '2025-10-31 14:23:30', 
    method: 'PATCH', 
    endpoint: '/api/v1/order/1234/status', 
    status: 201, 
    duration: 312, 
    size: '1.2 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'ek_live_***' },
      body: { status: 'completed' }
    },
    response: {
      headers: { 'Content-Type': 'application/json' },
      body: { orderId: '1234', status: 'completed', updatedAt: '2025-10-31T14:23:30Z' }
    }
  },
  { 
    id: '6', 
    timestamp: '2025-10-31 14:23:28', 
    method: 'POST', 
    endpoint: '/api/v1/webhook/payment', 
    status: 200, 
    duration: 445, 
    size: '3.4 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': 'sha256_***' },
      body: { event: 'payment.succeeded', paymentId: 'pay_xyz789', amount: 5000 }
    },
    response: {
      headers: { 'Content-Type': 'application/json' },
      body: { received: true }
    }
  },
  { 
    id: '7', 
    timestamp: '2025-10-31 14:23:25', 
    method: 'GET', 
    endpoint: '/api/v1/customers/search', 
    status: 404, 
    duration: 67, 
    size: '0.3 KB', 
    source: 'bitrix',
    request: {
      headers: { 'Authorization': 'Bearer btx_***' },
      body: null
    },
    response: {
      headers: { 'Content-Type': 'application/json' },
      body: { error: 'NOT_FOUND', message: 'Customer not found' }
    }
  },
  { 
    id: '8', 
    timestamp: '2025-10-31 14:23:20', 
    method: 'DELETE', 
    endpoint: '/api/v1/cart/items/56', 
    status: 204, 
    duration: 123, 
    size: '0 KB', 
    source: 'bitrix',
    request: {
      headers: { 'Authorization': 'Bearer btx_***' },
      body: null
    },
    response: {
      headers: {},
      body: null
    }
  },
];

export const performanceData: PerformanceDataPoint[] = [
  { time: '14:20', avg: 180, p95: 450 },
  { time: '14:21', avg: 220, p95: 520 },
  { time: '14:22', avg: 195, p95: 480 },
  { time: '14:23', avg: 310, p95: 890 },
  { time: '14:24', avg: 240, p95: 550 },
];

export const statusData: StatusDataPoint[] = [
  { name: '2xx', count: 1245 },
  { name: '3xx', count: 89 },
  { name: '4xx', count: 156 },
  { name: '5xx', count: 34 },
];
