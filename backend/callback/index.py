'''
Business: Обработка callback от EcomKassa после оплаты и обновление статуса в Bitrix24
Args: event с httpMethod, queryStringParameters (external_id, secret), context с request_id
Returns: HTTP response с результатом обработки
'''

import json
import os
import requests
import psycopg2
from typing import Dict, Any, Optional

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def get_bill_by_external_id(external_id: str, secret: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cur = conn.cursor()
    
    query = '''
        SELECT b.id, b.member_id, b.payment_id, b.paysystem_id, b.deal_id, b.status,
               u.webhook_url
        FROM bills b
        JOIN users u ON b.member_id = u.member_id
        WHERE b.external_id = %s AND b.secret = %s
    '''
    cur.execute(query, (external_id, secret))
    row = cur.fetchone()
    cur.close()
    conn.close()
    
    if not row:
        return None
    
    return {
        'id': row[0],
        'member_id': row[1],
        'payment_id': row[2],
        'paysystem_id': row[3],
        'deal_id': row[4],
        'status': row[5],
        'webhook_url': row[6]
    }

def update_bill_status(bill_id: int, status: str):
    conn = get_db_connection()
    cur = conn.cursor()
    
    query = '''
        UPDATE bills 
        SET status = %s, updated_at = CURRENT_TIMESTAMP 
        WHERE id = %s
    '''
    cur.execute(query, (status, bill_id))
    conn.commit()
    cur.close()
    conn.close()

def mark_payment_as_paid_bitrix24(payment_id: int, webhook_url: str) -> bool:
    try:
        response = requests.get(
            f'{webhook_url}/rest/sale.paysystem.pay.payment',
            params={'ID': payment_id},
            timeout=10
        )
        return response.status_code == 200
    except:
        return False

def call_custom_webhook(webhook_url: str, deal_id: int) -> bool:
    try:
        url = webhook_url.replace('{{ID}}', str(deal_id))
        response = requests.get(url, timeout=10)
        return response.status_code == 200
    except:
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method not in ['GET', 'POST']:
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        external_id = params.get('external_id')
        secret = params.get('secret')
        
        if not external_id or not secret:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing external_id or secret'}),
                'isBase64Encoded': False
            }
        
        bill = get_bill_by_external_id(external_id, secret)
        
        if not bill:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Bill not found or invalid secret'}),
                'isBase64Encoded': False
            }
        
        if bill['status'] == 'paid':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Payment already processed'}),
                'isBase64Encoded': False
            }
        
        success = False
        
        if bill['webhook_url'] and '{{ID}}' in bill['webhook_url']:
            success = call_custom_webhook(bill['webhook_url'], bill['deal_id'])
        elif bill['payment_id']:
            bitrix_webhook = bill.get('webhook_url', '').split('/rest/')[0]
            if bitrix_webhook:
                success = mark_payment_as_paid_bitrix24(bill['payment_id'], bitrix_webhook)
        
        if success:
            update_bill_status(bill['id'], 'paid')
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Payment processed successfully',
                    'payment_marked': True,
                    'external_id': external_id
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Failed to mark payment in Bitrix24',
                    'external_id': external_id
                }),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
