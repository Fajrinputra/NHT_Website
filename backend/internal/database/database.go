package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/nata-house/backend/internal/models"
)

var DB *gorm.DB

// Connect establishes connection to PostgreSQL and runs AutoMigrate for all models
func Connect(databaseURL string) {
	var err error
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Gagal koneksi ke database: %v", err)
	}

	log.Println("Koneksi database berhasil")

	// Enable pgcrypto for gen_random_uuid()
	DB.Exec("CREATE EXTENSION IF NOT EXISTS pgcrypto")

	// AutoMigrate semua 13 tabel
	err = DB.AutoMigrate(
		&models.Klien{},
		&models.Terapis{},
		&models.Ibu{},
		&models.Suami{},
		&models.Anak{},
		&models.GrafikPertumbuhan{},
		&models.CatatanImunisasi{},
		&models.HasilDenverII{},
		&models.CatatanHarian{},
		&models.Artikel{},
		&models.Booking{},
		&models.Notifikasi{},
		&models.JadwalTersedia{},
	)
	if err != nil {
		log.Fatalf("Gagal migrasi database: %v", err)
	}

	log.Println("Migrasi database berhasil — 13 tabel siap")
}
