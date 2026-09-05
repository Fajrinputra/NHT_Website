package router

import (
	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/database"
	"github.com/nata-house/backend/internal/handler"
	"github.com/nata-house/backend/internal/middleware"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/service"
)

// SetupRouter inisialisasi semua route /api/v1/...
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(middleware.CORSMiddleware())

	// Inisialisasi dependencies (Dependency Injection manual)
	klienRepo := repository.NewKlienRepository(database.DB)
	ibuRepo := repository.NewIbuRepository(database.DB)
	artikelRepo := repository.NewArtikelRepository(database.DB)
	anakRepo := repository.NewAnakRepository(database.DB)
	bookingRepo := repository.NewBookingRepository(database.DB)
	jadwalTersediaRepo := repository.NewJadwalTersediaRepository(database.DB)
	catatanHarianRepo := repository.NewCatatanHarianRepository(database.DB)
	notifRepo := repository.NewNotifikasiRepository(database.DB)
	suamiRepo := repository.NewSuamiRepository(database.DB)

	authSvc := service.NewAuthService(klienRepo)
	ibuHamilSvc := service.NewIbuHamilService(ibuRepo)
	artikelSvc := service.NewArtikelService(artikelRepo)
	anakSvc := service.NewAnakService(anakRepo)
	bookingSvc := service.NewBookingService(bookingRepo, jadwalTersediaRepo, notifRepo)
	catatanHarianSvc := service.NewCatatanHarianService(catatanHarianRepo)
	notifSvc := service.NewNotifikasiService(notifRepo)
	profilSvc := service.NewProfilService(klienRepo, ibuRepo, suamiRepo, anakRepo)

	authHandler := handler.NewAuthHandler(authSvc)
	ibuHamilHandler := handler.NewIbuHamilHandler(ibuHamilSvc)
	artikelHandler := handler.NewArtikelHandler(artikelSvc)
	anakHandler := handler.NewAnakHandler(anakSvc)
	bookingHandler := handler.NewBookingHandler(bookingSvc)
	catatanHarianHandler := handler.NewCatatanHarianHandler(catatanHarianSvc)
	notifHandler := handler.NewNotifikasiHandler(notifSvc)
	profilHandler := handler.NewProfilHandler(profilSvc)

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.GET("/status", authHandler.GetStatus) // PUBLIK — polling verifikasi
			// Protected auth routes
			authProtected := auth.Group("")
			authProtected.Use(middleware.AuthMiddleware())
			{
				authProtected.GET("/me", authHandler.GetMe)
				authProtected.PUT("/password", authHandler.ChangePassword)
			}
		}

		// Protected routes (semua butuh JWT)
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Ibu Hamil
			protected.GET("/ibu-hamil", ibuHamilHandler.GetIbuHamil)
			protected.PUT("/ibu-hamil", ibuHamilHandler.UpdateIbuHamil)

			// Artikel (bisa diakses oleh klien terautentikasi)
			protected.GET("/artikel", artikelHandler.GetArtikels)
			protected.GET("/artikel/:id", artikelHandler.GetArtikelByID)

			// Anak (Bayi & Anak)
			protected.POST("/anak", anakHandler.CreateAnak)
			protected.GET("/anak", anakHandler.GetAnak)
			protected.PUT("/anak/:id", anakHandler.UpdateAnak)
			protected.GET("/anak/:id/grafik-pertumbuhan", anakHandler.GetGrafikPertumbuhan)
			protected.GET("/anak/:id/imunisasi", anakHandler.GetCatatanImunisasi)
			protected.GET("/anak/:id/denver-ii", anakHandler.GetHasilDenverII)

			// Booking Homecare
			protected.POST("/booking", bookingHandler.CreateBooking)
			protected.GET("/booking", bookingHandler.GetBookingHistory)
			protected.GET("/booking/jadwal", bookingHandler.GetJadwalTersedia)

			// Catatan Harian
			protected.POST("/catatan-harian", catatanHarianHandler.CreateCatatan)
			protected.GET("/catatan-harian", catatanHarianHandler.GetCatatan)
			protected.PUT("/catatan-harian/:id", catatanHarianHandler.UpdateCatatan)

			// Notifikasi
			protected.GET("/notifikasi", notifHandler.GetNotifikasi)
			protected.PUT("/notifikasi/:id/read", notifHandler.MarkAsRead)
			protected.GET("/notifikasi/unread-count", notifHandler.GetUnreadCount)

			// Profil
			protected.GET("/profil", profilHandler.GetProfil)
		}
	}

	return r
}
