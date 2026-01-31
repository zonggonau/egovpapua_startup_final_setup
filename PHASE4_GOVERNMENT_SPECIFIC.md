# Phase 4: Government Type Specific Collections - COMPLETED ✅

Collections khusus untuk setiap jenis pemerintahan sesuai dengan kebutuhan SPBE.

---

## DPR/DPRD Collections

### 1. AnggotaDPR (`anggota-dpr`)

**Location:** `src/collections/spbe/dpr/AnggotaDPR/index.ts`
**Group:** SPBE - DPR

Data anggota DPR/DPRD.

**Fields:**

- `nama` - Nama lengkap
- `foto` - Foto anggota
- `fraksi` - Fraksi (PDI-P, Golkar, dll)
- `dapil` - Daerah Pemilihan
- `komisi` - Array komisi (nama + jabatan)
- `jabatanDPR` - Ketua/Wakil Ketua/Anggota
- `periode` - Periode jabatan (2019-2024)
- `biodata` - Tempat/tanggal lahir, pendidikan, pekerjaan
- `riwayatOrganisasi` - Array riwayat organisasi
- `kontak` - Email, telepon, alamat kantor
- `status` - aktif / tidak_aktif / PAW

**Use Case:** Profil anggota dewan, struktur keanggotaan

---

### 2. ProdukHukum (`produk-hukum`)

**Location:** `src/collections/spbe/dpr/ProdukHukum/index.ts`
**Group:** SPBE - DPR

Produk hukum hasil legislasi DPR/DPRD.

**Fields:**

- `judul` - Judul produk hukum
- `jenis` - Perda / Perdasi / Keputusan / Peraturan / Raperda
- `nomor` - Nomor produk hukum
- `tahun` - Tahun
- `tentang` - Perihal
- `tanggalPenetapan` - Tanggal penetapan
- `tanggalPengundangan` - Tanggal pengundangan
- `naskahAkademik` - Rich text
- `pemrakarsa` - DPRD / Kepala Daerah / Bersama
- `prosesLegislasi` - Array tahap legislasi
- `file` - Upload PDF
- `lampiran` - Array lampiran
- `status` - rancangan / pembahasan / berlaku / dicabut / direvisi

**Features:**

- Tracking proses legislasi
- Status workflow (rancangan → pembahasan → berlaku)

**Use Case:** Peraturan daerah, keputusan DPRD

---

### 3. JadwalSidang (`jadwal-sidang`)

**Location:** `src/collections/spbe/dpr/JadwalSidang/index.ts`
**Group:** SPBE - DPR

Jadwal sidang dan rapat DPR/DPRD.

**Fields:**

- `judul` - Judul sidang
- `jenisSidang` - Paripurna / Komisi / Banggar / Baleg / Gabungan / RDP / Raker
- `tanggal` - Tanggal + waktu mulai
- `waktuSelesai` - Waktu selesai
- `tempat` - Lokasi sidang
- `agenda` - Rich text agenda
- `komisi` - Nama komisi (conditional)
- `peserta` - Array peserta/undangan
- `dokumen` - Array dokumen (undangan, agenda, risalah, keputusan)
- `status` - dijadwalkan / berlangsung / selesai / ditunda / dibatalkan
- `hasilSidang` - Rich text (conditional saat selesai)
- `isPublic` - Boolean

**Features:**

- Conditional fields berdasarkan jenis sidang
- Dokumen management
- Status tracking

**Use Case:** Kalender sidang, transparansi legislasi

---

## OPD Collections

### 4. ProgramKerja (`program-kerja`)

**Location:** `src/collections/spbe/opd/ProgramKerja/index.ts`
**Group:** SPBE - OPD

Program kerja dan kegiatan OPD.

**Fields:**

- `namaProgram` - Nama program
- `tahun` - Tahun
- `deskripsi` - Rich text
- `tujuan` - Tujuan program
- `sasaran` - Array sasaran
- `indikatorKinerja` - Array (indikator, target, realisasi, satuan)
- `anggaran` - Pagu, realisasi, persentase (auto-calculated)
- `kegiatan` - Array kegiatan dengan status
- `status` - perencanaan / berjalan / selesai / evaluasi
- `dokumen` - Array dokumen pendukung

**Features:**

- Auto-calculate persentase realisasi anggaran
- Indikator kinerja tracking
- Status kegiatan monitoring

**Use Case:** Rencana kerja, monitoring program

---

## Provinsi Collections

### 5. OPDDirectory (`opd-directory`)

**Location:** `src/collections/spbe/provinsi/OPDDirectory/index.ts`
**Group:** SPBE - Provinsi

Direktori OPD di tingkat provinsi.

**Fields:**

- `namaOPD` - Nama OPD
- `jenisOPD` - Dinas / Badan / Kantor / Inspektorat / Sekretariat / RS
- `kepala` - Nama, NIP, foto
- `alamat` - Alamat kantor
- `kontak` - Telepon, email, website
- `tugasPokok` - Rich text
- `logo` - Logo OPD

**Use Case:** Direktori OPD provinsi

---

### 6. KabupatenDirectory (`kabupaten-directory`)

**Location:** `src/collections/spbe/provinsi/KabupatenDirectory/index.ts`
**Group:** SPBE - Provinsi

Direktori kabupaten/kota di provinsi.

**Fields:**

- `namaKabupaten` - Nama kabupaten/kota
- `jenisWilayah` - Kabupaten / Kota
- `bupatiWalikota` - Nama, foto
- `wakilBupatiWalikota` - Nama, foto
- `ibukota` - Ibukota
- `luasWilayah` - Luas (km²)
- `jumlahPenduduk` - Jumlah penduduk
- `jumlahDistrik` - Jumlah distrik/kecamatan
- `jumlahKampung` - Jumlah kampung/kelurahan
- `kontak` - Alamat, telepon, email, website
- `logo` - Logo kabupaten/kota

**Use Case:** Profil kabupaten/kota, data wilayah

---

## Desa Collections

### 7. PerangkatDesa (`perangkat-desa`)

**Location:** `src/collections/spbe/desa/PerangkatDesa/index.ts`
**Group:** SPBE - Desa

Data perangkat desa/kampung.

**Fields:**

- `nama` - Nama lengkap
- `foto` - Foto
- `jabatan` - Kepala Desa / Sekdes / Kaur / Kadus
- `nip` - NIP/NIK
- `pendidikan` - Pendidikan terakhir
- `tempatLahir` - Tempat lahir
- `tanggalLahir` - Tanggal lahir
- `alamat` - Alamat
- `telepon` - No. telepon
- `masaJabatan` - Mulai, selesai
- `status` - aktif / tidak_aktif

**Use Case:** Struktur perangkat desa

---

### 8. APBDes (`apbdes`)

**Location:** `src/collections/spbe/desa/APBDes/index.ts`
**Group:** SPBE - Desa

Anggaran Pendapatan dan Belanja Desa.

**Fields:**

- `tahun` - Tahun anggaran (unique)
- `pendapatan` - Array items (sumber, anggaran, realisasi)
- `totalPendapatan` - Auto-calculated (read-only)
- `belanja` - Array items (bidang, kegiatan, anggaran, realisasi)
- `totalBelanja` - Auto-calculated (read-only)
- `pembiayaan` - Penerimaan, pengeluaran
- `dokumen` - Upload PDF APBDes
- `status` - rancangan / ditetapkan / perubahan

**Features:**

- Auto-calculate total pendapatan dan belanja
- Bidang belanja sesuai Permendagri (Pemerintahan, Pembangunan, Kemasyarakatan, Pemberdayaan, Bencana)
- Unique per tahun

**Use Case:** Transparansi anggaran desa

---

## Admin Panel Organization

Collections dikelompokkan berdasarkan jenis pemerintahan:

- **SPBE - DPR**: AnggotaDPR, ProdukHukum, JadwalSidang
- **SPBE - OPD**: ProgramKerja
- **SPBE - Provinsi**: OPDDirectory, KabupatenDirectory
- **SPBE - Desa**: PerangkatDesa, APBDes

---

## Access Control

Semua collections menggunakan pattern yang sama:

```typescript
access: {
  create: authenticated,
  read: publicOrTenantAccess,
  update: authenticated,
  delete: authenticated,
}
```

---

## Tenant Filtering

Collections ini hanya akan muncul/relevan untuk tenant dengan type tertentu:

- **DPR collections** → tenant.type === 'dpr'
- **OPD collections** → tenant.type === 'opd'
- **Provinsi collections** → tenant.type === 'provinsi'
- **Desa collections** → tenant.type === 'desa'

_Note: Filtering ini bisa diimplementasikan di frontend atau via conditional admin UI_

---

## Key Features

### Auto-Calculations:

- **ProgramKerja**: Persentase realisasi anggaran
- **APBDes**: Total pendapatan dan belanja

### Conditional Fields:

- **JadwalSidang**: Komisi field (hanya untuk jenis sidang tertentu)
- **JadwalSidang**: Hasil sidang (hanya saat status selesai)

### Status Tracking:

- **AnggotaDPR**: aktif / tidak_aktif / PAW
- **ProdukHukum**: rancangan → pembahasan → berlaku
- **JadwalSidang**: dijadwalkan → berlangsung → selesai
- **ProgramKerja**: perencanaan → berjalan → selesai → evaluasi
- **APBDes**: rancangan → ditetapkan → perubahan

---

## Next Steps

### Frontend Templates:

1. Buat template khusus per tenant type
2. Conditional rendering berdasarkan tenant.type
3. Dashboard khusus per jenis pemerintahan

### Additional Collections (Optional):

- **Distrik**: PerangkatDistrik, Kampung, LayananDistrik
- **OPD**: StrukturOrganisasi (jika perlu lebih detail)
- **Provinsi**: LayananTerintegrasi (layanan lintas OPD)

---

## Phase 4 Status: ✅ COMPLETED

**Collections Created:** 8/8

- ✅ AnggotaDPR (DPR)
- ✅ ProdukHukum (DPR)
- ✅ JadwalSidang (DPR)
- ✅ ProgramKerja (OPD)
- ✅ OPDDirectory (Provinsi)
- ✅ KabupatenDirectory (Provinsi)
- ✅ PerangkatDesa (Desa)
- ✅ APBDes (Desa)

**Total Collections:** 26 (Phase 1-4)

- Phase 1: 2 (Tenants, Users)
- Phase 2: 4 (Billing)
- Phase 3: 8 (Common)
- Phase 4: 8 (Type Specific)
- Core: 4 (Pages, Posts, Media, Categories)

**Ready for Phase 5: Template System**
