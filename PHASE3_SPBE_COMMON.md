# Phase 3: SPBE Common Collections - COMPLETED ✅

## Collections Created

Semua collections ini mengikuti standar SPBE (Sistem Pemerintahan Berbasis Elektronik) dan dilengkapi dengan:

- ✅ Multi-tenant support (tenant field + auto-assignment)
- ✅ Public access untuk published content
- ✅ Tenant isolation untuk authenticated users
- ✅ Timestamps (createdAt, updatedAt)

---

### 1. ProfilInstansi (`profil-instansi`)

**Location:** `src/collections/spbe/ProfilInstansi/index.ts`

Profil lengkap instansi pemerintah.

**Fields:**

- `namaInstansi` - Nama instansi
- `visi` - Visi instansi
- `misi` - Array misi
- `sejarah` - Rich text sejarah
- `tugasPokok` - Tugas pokok dan fungsi
- `strukturOrganisasi` - Bagan + deskripsi
- `pejabat` - Array pejabat (nama, jabatan, foto, NIP, pendidikan, riwayat)
- `kontak` - Alamat, telepon, fax, email, website, jam layanan
- `socialMedia` - Array social media (Facebook, Twitter, Instagram, YouTube, TikTok)

**Use Case:** Halaman "Tentang Kami", "Profil", "Visi Misi"

---

### 2. Berita (`berita`)

**Location:** `src/collections/spbe/Berita/index.ts`

Berita dan pengumuman instansi.

**Fields:**

- `judul` - Judul berita
- `kategori` - utama / pengumuman / kegiatan / informasi / press_release
- `featuredImage` - Gambar utama (required)
- `ringkasan` - Max 200 karakter
- `konten` - Rich text
- `galeri` - Array foto dengan caption
- `tags` - Array tags
- `penulis` - Relationship ke Users (auto-set)
- `publishedAt` - Auto-set saat publish
- `isPinned` - Pin ke beranda
- `slug` - Auto-generated

**Features:**

- Draft support dengan autosave
- Version control (max 50 versions)
- Auto-set penulis dari current user

**Use Case:** Halaman berita, pengumuman, press release

---

### 3. Dokumen (`dokumen`)

**Location:** `src/collections/spbe/Dokumen/index.ts`

Dokumen resmi dan peraturan.

**Fields:**

- `judul` - Judul dokumen
- `jenisDokumen` - Perda / Pergub/Perbup / SK / Surat Edaran / Instruksi / Laporan / Perencanaan / Lainnya
- `nomorDokumen` - Nomor resmi dokumen
- `tanggalTerbit` - Tanggal terbit
- `tentang` - Perihal dokumen
- `deskripsi` - Rich text
- `file` - Upload PDF (required)
- `lampiran` - Array lampiran
- `status` - berlaku / dicabut / direvisi
- `kategori` - Array kategori
- `versi` - Nomor versi, catatan revisi, dokumen sebelumnya
- `jumlahUnduhan` - Download counter (read-only)

**Features:**

- Version control untuk revisi dokumen
- Relationship ke dokumen sebelumnya
- Status tracking (berlaku/dicabut/direvisi)

**Use Case:** Produk hukum, peraturan daerah, SK, surat edaran

---

### 4. LayananPublik (`layanan-publik`)

**Location:** `src/collections/spbe/LayananPublik/index.ts`

Katalog layanan publik.

**Fields:**

- `namaLayanan` - Nama layanan
- `kategori` - Perizinan / Adminduk / Kesehatan / Pendidikan / Sosial / Infrastruktur / Lainnya
- `deskripsi` - Rich text
- `persyaratan` - Array persyaratan
- `prosedur` - Array langkah (nomor + deskripsi)
- `waktuPenyelesaian` - SLA (durasi + satuan)
- `biaya` - Nominal + keterangan
- `isOnline` - Boolean
- `linkLayanan` - URL layanan online (conditional)
- `kontak` - Nama unit, telepon, email, loket
- `formulir` - Array formulir download
- `faq` - Array FAQ
- `slug` - Auto-generated

**Features:**

- SLA (Service Level Agreement) tracking
- Online service support dengan link
- Formulir download
- FAQ section

**Use Case:** Katalog layanan, panduan layanan publik

---

### 5. Agenda (`agenda`)

**Location:** `src/collections/spbe/Agenda/index.ts`

Kalender kegiatan dan acara.

**Fields:**

- `judul` - Judul kegiatan
- `deskripsi` - Rich text
- `tanggalMulai` - Date + time (required)
- `tanggalSelesai` - Date + time
- `lokasi` - Lokasi kegiatan
- `penyelenggara` - Penyelenggara
- `kategori` - Rapat / Seminar / Sosialisasi / Pelatihan / Upacara / Lainnya
- `status` - dijadwalkan / berlangsung / selesai / dibatalkan
- `isPublic` - Tampilkan di kalender publik

**Use Case:** Kalender kegiatan, agenda pimpinan

---

### 6. Galeri (`galeri`)

**Location:** `src/collections/spbe/Galeri/index.ts`

Galeri foto dan video.

**Fields:**

- `judul` - Judul
- `deskripsi` - Deskripsi
- `jenis` - foto / video / album
- `media` - Upload (untuk foto/video single)
- `items` - Array media (untuk album)
- `tanggal` - Tanggal
- `tags` - Array tags

**Features:**

- Support foto, video, dan album
- Conditional fields berdasarkan jenis
- Tags untuk kategorisasi

**Use Case:** Galeri foto kegiatan, dokumentasi

---

### 7. Transparansi (`transparansi`)

**Location:** `src/collections/spbe/Transparansi/index.ts`

Laporan transparansi dan akuntabilitas.

**Fields:**

- `judul` - Judul laporan
- `jenis` - LKIP / LAKIP / Keuangan / APBD / Realisasi / Aset / Gratifikasi / LHKPN / Lainnya
- `tahun` - Tahun (required)
- `periode` - Triwulan / Semester / Tahunan
- `deskripsi` - Rich text
- `file` - Upload PDF (required)
- `lampiran` - Array lampiran
- `ringkasan` - Total anggaran, realisasi, persentase

**Features:**

- Periode tracking (triwulan, semester, tahunan)
- Ringkasan data keuangan
- Multiple file support

**Use Case:** LKIP, LAKIP, laporan keuangan, APBD

---

### 8. Statistik (`statistik`)

**Location:** `src/collections/spbe/Statistik/index.ts`

Data statistik dan infografis.

**Fields:**

- `judul` - Judul statistik
- `kategori` - Kependudukan / Ekonomi / Pendidikan / Kesehatan / Infrastruktur / Sosial / Pertanian / Lainnya
- `tahun` - Tahun (required)
- `deskripsi` - Rich text
- `data` - Array (label, nilai, satuan)
- `visualisasi` - table / bar / line / pie / area
- `sumber` - Sumber data (BPS, Dinas, dll)
- `file` - Upload Excel/CSV (optional)

**Features:**

- Flexible data array structure
- Visualization type selection
- Source attribution

**Use Case:** Data statistik, infografis, dashboard data

---

## Admin Panel Organization

Semua SPBE collections dikelompokkan dalam **"SPBE - Common"** di admin panel untuk kemudahan navigasi.

---

## Access Control Pattern

Semua collections menggunakan pattern yang sama:

```typescript
access: {
  create: authenticated,
  read: publicOrTenantAccess, // Public: published only, Tenant: their own
  update: authenticated,
  delete: authenticated,
}
```

**Behavior:**

- **Public users:** Hanya bisa read published content
- **Authenticated tenant users:** Bisa CRUD content milik tenant mereka
- **Super admin:** Full access semua tenant

---

## Tenant Auto-Assignment

Semua collections memiliki tenant field dengan auto-assignment:

```typescript
{
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  required: true,
  hooks: {
    beforeValidate: [
      ({ req, value }) => {
        if (value) return value
        return req.user?.tenant || value
      },
    ],
  },
}
```

---

## Next Steps

### Frontend Integration:

1. Buat pages untuk setiap collection
2. Implement search & filter
3. Create templates per tenant type

### SEO & Performance:

1. Add meta fields (title, description, image)
2. Implement sitemap generation
3. Add caching strategy

### Analytics:

1. Track page views
2. Download counter untuk dokumen
3. Popular content tracking

---

## Phase 3 Status: ✅ COMPLETED

**Collections Created:** 8/8

- ✅ ProfilInstansi
- ✅ Berita
- ✅ Dokumen
- ✅ LayananPublik
- ✅ Agenda
- ✅ Galeri
- ✅ Transparansi
- ✅ Statistik

**Ready for Phase 4: Government Type Specific Collections**
