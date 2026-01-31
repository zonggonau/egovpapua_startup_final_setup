import type { Endpoint } from 'payload'
import { trackEvent } from '@/utilities/analytics'

export const trackEventEndpoint: Endpoint = {
  path: '/track',
  method: 'post',
  handler: async (req) => {
    try {
      const { tenant, event, metadata, sessionId } = req.body

      if (!event) {
        return Response.json({ error: 'Event type is required' }, { status: 400 })
      }

      await trackEvent({
        tenant,
        event,
        metadata: {
          ...metadata,
          userAgent: req.headers.get('user-agent') || undefined,
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        },
        sessionId,
      })

      return Response.json({ success: true })
    } catch (error: any) {
      console.error('Track event error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }
  },
}
