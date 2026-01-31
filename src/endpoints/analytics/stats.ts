import type { Endpoint } from 'payload'
import { getAnalyticsSummary, getPopularContent } from '@/utilities/analytics'

export const analyticsStatsEndpoint: Endpoint = {
  path: '/stats/:tenantId',
  method: 'get',
  handler: async (req) => {
    try {
      const tenantId = req.routeParams?.tenantId

      if (!tenantId) {
        return Response.json({ error: 'Tenant ID is required' }, { status: 400 })
      }

      // Check access - user must be from this tenant or super admin
      if (req.user?.role !== 'super_admin') {
        const userTenantId =
          typeof req.user?.tenant === 'string' ? req.user.tenant : req.user?.tenant?.id

        if (userTenantId !== tenantId) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
      }

      const [summary, popularContent] = await Promise.all([
        getAnalyticsSummary(tenantId),
        getPopularContent(tenantId, 10),
      ])

      return Response.json({
        summary,
        popularContent,
      })
    } catch (error: any) {
      console.error('Analytics stats error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }
  },
}
