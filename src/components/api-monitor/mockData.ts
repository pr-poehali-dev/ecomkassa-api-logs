import { APILog, PerformanceDataPoint, StatusDataPoint } from './types';

export const mockLogs: APILog[] = [
  { 
    id: '1', 
    timestamp: '2025-10-31 14:23:45', 
    method: 'POST', 
    endpoint: '/api/v2/receipt/create_ffd', 
    status: 200, 
    duration: 423, 
    size: '3.2 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Basic ***',
        'User-Agent': 'Bitrix24-Ecomkassa/1.0'
      },
      body: { 
        external_id: 'bitrix24_deal_12345',
        cash_id: '987654',
        receipt: {
          client: { email: 'client@example.com', phone: '+79991234567' },
          company: { email: 'company@example.com', sno: 1, inn: '7707083893', payment_address: 'www.example.com' },
          items: [{
            name: 'Консультация по маркетингу',
            price: 15000,
            quantity: 1,
            sum: 15000,
            measurement_unit: 'шт',
            payment_method: 'full_prepayment',
            payment_object: 'service',
            vat: { type: 'vat20', sum: 2500 }
          }],
          payments: [{ type: 1, sum: 15000 }],
          total: 15000
        }
      }
    },
    response: {
      headers: { 
        'Content-Type': 'application/json',
        'X-Request-Id': 'req_ek_abc123'
      },
      body: { 
        status: 'success',
        receipt_id: 'rec_xyz789',
        external_id: 'bitrix24_deal_12345',
        status_url: 'https://app.ecomkassa.ru/api/v2/receipt/status/rec_xyz789'
      }
    }
  },
  { 
    id: '2', 
    timestamp: '2025-10-31 14:23:42', 
    method: 'GET', 
    endpoint: '/rest/1/webhook/crm.deal.list', 
    status: 200, 
    duration: 189, 
    size: '28.4 KB', 
    source: 'bitrix',
    request: {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'Ecomkassa-Integration/2.0'
      },
      body: null
    },
    response: {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: { 
        result: [
          { ID: '123', TITLE: 'Сделка №1', STAGE_ID: 'NEW', OPPORTUNITY: 15000 },
          { ID: '124', TITLE: 'Сделка №2', STAGE_ID: 'WON', OPPORTUNITY: 25000 }
        ],
        total: 2,
        time: {
          start: 1698758400.123,
          finish: 1698758400.312,
          duration: 0.189
        }
      }
    }
  },
  { 
    id: '3', 
    timestamp: '2025-10-31 14:23:38', 
    method: 'POST', 
    endpoint: '/api/v2/webhook', 
    status: 500, 
    duration: 1245, 
    size: '0.8 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 
        'Content-Type': 'application/json',
        'X-Ecomkassa-Signature': 'sha256_***'
      },
      body: { 
        type: 'receipt.failed',
        created_at: '2025-10-31T14:23:38Z',
        receipt: {
          id: 'rec_error123',
          external_id: 'bitrix24_deal_999',
          status: 'error',
          error_code: 'INVALID_INN',
          error_message: 'ИНН компании указан неверно'
        }
      }
    },
    response: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: { 
        error: 'PROCESSING_ERROR',
        message: 'Не удалось обработать webhook',
        code: 'ERR_WEBHOOK_HANDLER'
      }
    }
  },
  { 
    id: '4', 
    timestamp: '2025-10-31 14:23:35', 
    method: 'POST', 
    endpoint: '/rest/1/webhook/crm.item.payment.add', 
    status: 200, 
    duration: 312, 
    size: '1.9 KB', 
    source: 'bitrix',
    request: {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer btx_***'
      },
      body: {
        entityTypeId: 2,
        entityId: 123,
        fields: {
          PAID: 'Y',
          DATE_PAID: '2025-10-31T14:23:35',
          PAY_SYSTEM_ID: 10,
          SUM: 15000,
          CURRENCY: 'RUB',
          PS_STATUS: 'Y',
          PS_STATUS_CODE: 'SUCCESS',
          PS_INVOICE_ID: 'rec_xyz789'
        }
      }
    },
    response: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: { 
        result: 456,
        time: {
          start: 1698758415.100,
          finish: 1698758415.412,
          duration: 0.312
        }
      }
    }
  },
  { 
    id: '5', 
    timestamp: '2025-10-31 14:23:30', 
    method: 'GET', 
    endpoint: '/api/v2/receipt/status/rec_xyz789', 
    status: 200, 
    duration: 145, 
    size: '2.7 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 
        'Authorization': 'Basic ***',
        'Accept': 'application/json'
      },
      body: null
    },
    response: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: { 
        status: 'completed',
        receipt_id: 'rec_xyz789',
        fiscal_receipt_number: 12345,
        fiscal_document_number: 67890,
        fiscal_document_attribute: 1234567890,
        fn_number: '9999078900005555',
        shift_number: 123,
        receipt_datetime: '2025-10-31T14:23:30Z',
        receipt_url: 'https://check.ecomkassa.ru/98765432'
      }
    }
  },
  { 
    id: '6', 
    timestamp: '2025-10-31 14:23:28', 
    method: 'POST', 
    endpoint: '/rest/1/webhook/crm.deal.update', 
    status: 200, 
    duration: 278, 
    size: '1.1 KB', 
    source: 'bitrix',
    request: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: {
        id: 123,
        fields: {
          STAGE_ID: 'WON',
          CLOSED: 'Y',
          UF_CRM_FISCAL_RECEIPT: 'ФН: 9999078900005555, ФД: 67890'
        }
      }
    },
    response: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: { 
        result: true,
        time: {
          start: 1698758408.100,
          finish: 1698758408.378,
          duration: 0.278
        }
      }
    }
  },
  { 
    id: '7', 
    timestamp: '2025-10-31 14:23:25', 
    method: 'GET', 
    endpoint: '/rest/1/webhook/crm.contact.get', 
    status: 404, 
    duration: 98, 
    size: '0.4 KB', 
    source: 'bitrix',
    request: {
      headers: { 
        'Accept': 'application/json'
      },
      body: null
    },
    response: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: { 
        error: 'NOT_FOUND',
        error_description: 'Контакт не найден'
      }
    }
  },
  { 
    id: '8', 
    timestamp: '2025-10-31 14:23:20', 
    method: 'POST', 
    endpoint: '/api/v2/integrations', 
    status: 201, 
    duration: 567, 
    size: '4.3 KB', 
    source: 'ecomkassa',
    request: {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Basic ***'
      },
      body: {
        cash_id: '987654',
        payment_systems: ['tinkoff', 'sberbank', 'yookassa'],
        webhook_url: 'https://example.bitrix24.ru/rest/ecomkassa/handler.php'
      }
    },
    response: {
      headers: { 
        'Content-Type': 'application/json'
      },
      body: { 
        status: 'success',
        integration_id: 'int_456789',
        payment_systems_count: 3
      }
    }
  },
];

export const performanceData: PerformanceDataPoint[] = [
  { time: '14:20', avg: 245, p95: 580 },
  { time: '14:21', avg: 312, p95: 720 },
  { time: '14:22', avg: 289, p95: 650 },
  { time: '14:23', avg: 398, p95: 1100 },
  { time: '14:24', avg: 267, p95: 590 },
];

export const statusData: StatusDataPoint[] = [
  { name: '2xx', count: 3542 },
  { name: '3xx', count: 127 },
  { name: '4xx', count: 289 },
  { name: '5xx', count: 67 },
];