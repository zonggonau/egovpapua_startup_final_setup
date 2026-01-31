import type { PayloadHandler } from 'payload'
import { parseMidtransStatus, verifyMidtransSignature } from '@/utilities/midtrans'
import type { MidtransNotification } from '@/utilities/midtrans'

/**
 * Midtrans Notification Webhook Handler
 *
 * This endpoint receives notifications from Midtrans when payment status changes
 * URL: POST /api/webhooks/midtrans
 */
export const midtransWebhook: PayloadHandler = async (req, res) => {
  try {
    const notification: MidtransNotification = req.body

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const calculatedSignature = verifyMidtransSignature(
      notification.order_id,
      notification.status_code,
      notification.gross_amount,
      serverKey,
    )

    if (calculatedSignature !== notification.signature_key) {
      return res.status(403).json({
        success: false,
        message: 'Invalid signature',
      })
    }

    // Parse status
    const { status, message } = parseMidtransStatus(notification)

    // Find payment by orderId
    const payments = await req.payload.find({
      collection: 'payments',
      where: {
        'midtransData.orderId': {
          equals: notification.order_id,
        },
      },
      limit: 1,
    })

    if (payments.docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      })
    }

    const payment = payments.docs[0]

    // Update payment
    await req.payload.update({
      collection: 'payments',
      id: payment.id,
      data: {
        status,
        'midtransData.transactionId': notification.transaction_id,
        'midtransData.transactionStatus': notification.transaction_status,
        'midtransData.paymentType': notification.payment_type,
        'midtransData.vaNumber': notification.va_numbers?.[0]?.va_number,
        'midtransData.bank': notification.va_numbers?.[0]?.bank,
        metadata: notification,
        processedAt: new Date().toISOString(),
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Notification processed',
      status,
    })
  } catch (error: any) {
    console.error('Midtrans webhook error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}
