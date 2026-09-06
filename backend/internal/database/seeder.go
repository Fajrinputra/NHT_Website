package database

import (
	"log"
	"time"

	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/utils"
)

// SeedKIAData menyuntikkan data dummy untuk modul Anak (KIA Digital)
func SeedKIAData() {
	var anak models.Anak
	// Ambil satu anak contoh secara acak
	if err := DB.First(&anak).Error; err != nil {
		log.Println("Belum ada data anak, seeder KIA dilewati.")
		return
	}

	// Cek apakah sudah ada data grafik untuk anak ini
	var count int64
	DB.Model(&models.GrafikPertumbuhan{}).Where("anak_id = ?", anak.ID).Count(&count)
	if count > 0 {
		return // Sudah ada data
	}

	log.Println("Seeding data KIA Digital untuk anak:", anak.Nama)

	// 1. Seed Grafik Pertumbuhan (3 bulan terakhir)
	now := time.Now()
	for i := 2; i >= 0; i-- {
		t := now.AddDate(0, -i, 0)
		bb := 3.5 + float64(4-i)*0.8
		pb := 50.0 + float64(4-i)*2.0
		lk := 35.0 + float64(4-i)*0.5
		DB.Create(&models.GrafikPertumbuhan{
			AnakID:       anak.ID,
			TanggalUkur:  t,
			BeratBadan:   &bb,
			PanjangBadan: &pb,
			LingkarKepala: &lk,
			Status:       "Normal",
			DiisiOleh:    "Bidan Nata",
		})
	}

	// 2. Seed Catatan Imunisasi
	imunisasi := []models.CatatanImunisasi{
		{AnakID: anak.ID, NamaVaksin: "Hepatitis B0", UsiaRekomendasi: "0 Bulan", Status: models.StatusImunisasiSudah, KeteranganManfaat: "Mencegah penyakit Hepatitis B (kerusakan hati).", TanggalPemberian: &now},
		{AnakID: anak.ID, NamaVaksin: "BCG", UsiaRekomendasi: "1 Bulan", Status: models.StatusImunisasiBelum, KeteranganManfaat: "Mencegah Tuberkulosis (TBC) berat."},
		{AnakID: anak.ID, NamaVaksin: "Polio 1", UsiaRekomendasi: "1 Bulan", Status: models.StatusImunisasiTerlambat, KeteranganManfaat: "Mencegah penyakit Polio (kelumpuhan)."},
	}
	for _, v := range imunisasi {
		DB.Create(&v)
	}

	// 3. Seed Hasil Denver II
	DB.Create(&models.HasilDenverII{
		AnakID:          anak.ID,
		TanggalSkrining: now.AddDate(0, 0, -10),
		DiisiOleh:       "Terapis Nata",
		MotorikKasar:    models.HasilDenverSesuaiUsia,
		MotorikHalus:    models.HasilDenverSesuaiUsia,
		Bahasa:          models.HasilDenverPerluPerhatian,
		PersonalSosial:  models.HasilDenverSesuaiUsia,
	})
}

// SeedAdmin membuat akun super admin jika belum ada
func SeedAdmin() {
	var count int64
	DB.Model(&models.Admin{}).Count(&count)
	if count > 0 {
		return // Admin sudah ada
	}

	defaultPassword := "admin123nata" // Tampilkan di log sesuai instruksi
	hashed, _ := utils.HashPassword(defaultPassword)

	admin := models.Admin{
		Nama:          "Super Admin",
		Email:         "admin@natahouse.com",
		KataSandiHash: hashed,
	}

	if err := DB.Create(&admin).Error; err != nil {
		log.Printf("Gagal membuat akun admin default: %v\n", err)
	} else {
		log.Printf("===================================================\n")
		log.Printf("AKUN ADMIN DEFAULT BERHASIL DIBUAT!\n")
		log.Printf("Email    : %s\n", admin.Email)
		log.Printf("Password : %s\n", defaultPassword)
		log.Printf("Harap segera ganti password ini sebelum produksi.\n")
		log.Printf("===================================================\n")
	}
}
