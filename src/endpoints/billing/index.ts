import type { PayloadHandler } from 'payload'
import { createMidtransSnap } from '@/utilities/midtrans'

/**
 * Create Invoice and Initiate Payment
 *
 * POST /api/billing/create-invoice
 * Body: {
 *   tenantId: string
 *   planId: string
 * }
 */
export const createInvoiceHandler: PayloadHandler = async (req, res) => {
  try {
    const { tenantId, planId } = req.body

    if (!tenantId || !planId) {
      return res.status(400).json({
        success: false,
        message: 'tenantId and planId are required',
      })
    }

    // Get tenant
    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    // Get plan
    const plan = await req.payload.findByID({
      collection: 'subscription-plans',
      id: planId,
    })

    if (!plan.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Plan is not active',
      })
    }

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    if (plan.interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Create subscription
    const subscription = await req.payload.create({
      collection: 'subscriptions',
      data: {
        tenant: tenantId,
        plan: planId,
        status: 'pending',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        autoRenew: false,
      },
    })

    // Create invoice
    const invoice = await req.payload.create({
      collection: 'invoices',
      data: {
        tenant: tenantId,
        subscription: subscription.id,
        items: [
          {
            description: `${plan.name} - ${plan.interval === 'monthly' ? 'Bulanan' : 'Tahunan'}`,
            quantity: 1,
            unitPrice: plan.price,
            amount: plan.price,
          },
        ],
        subtotal: plan.price,
        tax: 0,
        amount: plan.price,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      },
    })

    return res.status(200).json({
      success: true,
      data: {
        invoice,
        subscription,
      },
    })
  } catch (error: any) {
    console.error('Create invoice error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

/**
 * Initiate Midtrans Payment
 *
 * POST /api/billing/pay-invoice
 * Body: {
 *   invoiceId: string
 *   method: 'midtrans_cc' | 'midtrans_bank_transfer' | etc
 * }
 */
export const payInvoiceHandler: PayloadHandler = async (req, res) => {
  try {
    const { invoiceId, method } = req.body

    if (!invoiceId || !method) {
      return res.status(400).json({
        success: false,
        message: 'invoiceId and method are required',
      })
    }

    // Get invoice with tenant
    const invoice = await req.payload.findByID({
      collection: 'invoices',
      id: invoiceId,
      depth: 2,
    })

    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Invoice already paid',
      })
    }

    const tenant = typeof invoice.tenant === 'object' ? invoice.tenant : null

    if (!tenant) {
      return res.status(400).json({
        success: false,
        message: 'Tenant not found',
      })
    }

    // Create payment record
    const payment = await req.payload.create({
      collection: 'payments',
      data: {
        invoice: invoiceId,
        amount: invoice.amount,
        method,
        status: 'pending',
      },
    })

    // If Midtrans, create Snap transaction
    if (method.startsWith('midtrans')) {
      const orderId = `ORDER-${payment.id}-${Date.now()}`

      const snapResponse = await createMidtransSnap({
        orderId,
        amount: invoice.amount,
        customerDetails: {
          firstName: tenant.name,
          email: tenant.contactInfo?.email || 'noreply@egovpapua.com',
          phone: tenant.contactInfo?.phone || '081234567890',
        },
        itemDetails: invoice.items.map((item: any) => ({
          id: item.id || 'item-1',
          name: item.description,
          price: item.unitPrice,
          quantity: item.quantity,
        })),
      })

      // Update payment with Midtrans data
      await req.payload.update({
        collection: 'payments',
        id: payment.id,
        data: {
          'midtransData.orderId': orderId,
          'midtransData.snapToken': snapResponse.token,
          'midtransData.snapUrl': snapResponse.redirectUrl,
        },
      })

      return res.status(200).json({
        success: true,
        data: {
          payment,
          snapToken: snapResponse.token,
          snapUrl: snapResponse.redirectUrl,
        },
      })
    }

    // For manual transfer
    return res.status(200).json({
      success: true,
      data: {
        payment,
      },
    })
  } catch (error: any) {
    console.error('Pay invoice error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}
