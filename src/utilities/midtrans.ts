/**
 * Midtrans Integration Utilities
 *
 * Setup:
 * 1. Install midtrans-client: pnpm add midtrans-client
 * 2. Add to .env:
 *    MIDTRANS_SERVER_KEY=your_server_key
 *    MIDTRANS_CLIENT_KEY=your_client_key
 *    MIDTRANS_IS_PRODUCTION=false
 */

// Uncomment after installing midtrans-client
// import midtransClient from 'midtrans-client'

export interface MidtransSnapParams {
  orderId: string
  amount: number
  customerDetails: {
    firstName: string
    lastName?: string
    email: string
    phone: string
  }
  itemDetails: Array<{
    id: string
    price: number
    quantity: number
    name: string
  }>
}

export interface MidtransSnapResponse {
  token: string
  redirectUrl: string
}

/**
 * Create Midtrans Snap transaction
 */
export async function createMidtransSnap(
  params: MidtransSnapParams,
): Promise<MidtransSnapResponse> {
  // Uncomment after installing midtrans-client
  /*
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  })

  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.customerDetails.firstName,
      last_name: params.customerDetails.lastName || '',
      email: params.customerDetails.email,
      phone: params.customerDetails.phone,
    },
    item_details: params.itemDetails,
  }

  const transaction = await snap.createTransaction(parameter)
  
  return {
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  }
  */

  // Temporary mock response for development
  console.log('Midtrans Snap params:', params)
  return {
    token: 'mock_snap_token_' + params.orderId,
    redirectUrl: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' + params.orderId,
  }
}

/**
 * Verify Midtrans notification signature
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
): string {
  const crypto = require('crypto')
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex')
  return hash
}

/**
 * Handle Midtrans notification/webhook
 */
export interface MidtransNotification {
  transaction_status: string
  order_id: string
  gross_amount: string
  payment_type: string
  transaction_id: string
  fraud_status?: string
  status_code: string
  signature_key: string
  va_numbers?: Array<{
    bank: string
    va_number: string
  }>
}

export function parseMidtransStatus(notification: MidtransNotification): {
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  message: string
} {
  const { transaction_status, fraud_status } = notification

  if (transaction_status === 'capture') {
    if (fraud_status === 'accept') {
      return { status: 'success', message: 'Payment successful' }
    } else if (fraud_status === 'challenge') {
      return { status: 'processing', message: 'Payment under review' }
    } else {
      return { status: 'failed', message: 'Payment failed - fraud detected' }
    }
  } else if (transaction_status === 'settlement') {
    return { status: 'success', message: 'Payment settled' }
  } else if (transaction_status === 'pending') {
    return { status: 'pending', message: 'Waiting for payment' }
  } else if (transaction_status === 'deny') {
    return { status: 'failed', message: 'Payment denied' }
  } else if (transaction_status === 'expire') {
    return { status: 'failed', message: 'Payment expired' }
  } else if (transaction_status === 'cancel') {
    return { status: 'cancelled', message: 'Payment cancelled' }
  }

  return { status: 'failed', message: 'Unknown status' }
}
