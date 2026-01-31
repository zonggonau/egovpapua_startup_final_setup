import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { SubscriptionPlans } from './collections/billing/SubscriptionPlans'
import { Subscriptions } from './collections/billing/Subscriptions'
import { Invoices } from './collections/billing/Invoices'
import { Payments } from './collections/billing/Payments'
import { ProfilInstansi } from './collections/spbe/ProfilInstansi'
import { Berita } from './collections/spbe/Berita'
import { Dokumen } from './collections/spbe/Dokumen'
import { LayananPublik } from './collections/spbe/LayananPublik'
import { Agenda } from './collections/spbe/Agenda'
import { Galeri } from './collections/spbe/Galeri'
import { Transparansi } from './collections/spbe/Transparansi'
import { Statistik } from './collections/spbe/Statistik'
// Phase 4: Government Type Specific
import { AnggotaDPR } from './collections/spbe/dpr/AnggotaDPR'
import { ProdukHukum } from './collections/spbe/dpr/ProdukHukum'
import { JadwalSidang } from './collections/spbe/dpr/JadwalSidang'
import { ProgramKerja } from './collections/spbe/opd/ProgramKerja'
import { OPDDirectory } from './collections/spbe/provinsi/OPDDirectory'
import { KabupatenDirectory } from './collections/spbe/provinsi/KabupatenDirectory'
import { PerangkatDesa } from './collections/spbe/desa/PerangkatDesa'
import { APBDes } from './collections/spbe/desa/APBDes'
// Phase 5: Template System
import { Templates } from './collections/templates/Templates'
import { ThemeSettings } from './collections/templates/ThemeSettings'
// Phase 7: Analytics
import { Analytics } from './collections/analytics/Analytics'
import { SuperAdminDashboard } from './globals/SuperAdminDashboard'
import { TenantDashboard } from './globals/TenantDashboard'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Tenants,
    Users,
    SubscriptionPlans,
    Subscriptions,
    Invoices,
    Payments,
    ProfilInstansi,
    Berita,
    Dokumen,
    LayananPublik,
    Agenda,
    Galeri,
    Transparansi,
    Statistik,
    // Phase 4: Government Type Specific
    AnggotaDPR,
    ProdukHukum,
    JadwalSidang,
    ProgramKerja,
    OPDDirectory,
    KabupatenDirectory,
    PerangkatDesa,
    APBDes,
    // Phase 5: Template System
    Templates,
    ThemeSettings,
    // Phase 7: Analytics
    Analytics,
    Pages,
    Posts,
    Media,
    Categories,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SuperAdminDashboard, TenantDashboard],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
