package main

import (
	"log"

	"github.com/nata-house/backend/internal/config"
	"github.com/nata-house/backend/internal/database"
	"github.com/nata-house/backend/internal/router"
	"github.com/nata-house/backend/internal/utils"
)

func main() {
	// Load konfigurasi dari .env
	cfg := config.Load()

	// Validasi konfigurasi wajib
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL harus diisi di .env")
	}
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET harus diisi di .env")
	}

	// Inisialisasi JWT secret
	utils.InitJWT(cfg.JWTSecret)

	// Koneksi database + AutoMigrate semua tabel
	database.Connect(cfg.DatabaseURL)

	// Seed data (khusus development/testing)
	database.SeedKIAData()
	database.SeedAdmin()

	// Setup router dan jalankan server
	r := router.SetupRouter()

	log.Printf("🚀 Nata House Treatment Backend berjalan di port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
