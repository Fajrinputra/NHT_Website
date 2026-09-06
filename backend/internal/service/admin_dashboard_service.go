package service

import (
	"github.com/nata-house/backend/internal/database"
	"github.com/nata-house/backend/internal/models"
)

type AdminDashboardStats struct {
	TotalKlien        int64 `json:"totalKlien"`
	KlienMenunggu     int64 `json:"klienMenunggu"`
	BookingMenunggu   int64 `json:"bookingMenunggu"`
	TerapisAktif      int64 `json:"terapisAktif"`
}

type AdminDashboardService interface {
	GetStats() (*AdminDashboardStats, error)
}

type adminDashboardService struct{}

func NewAdminDashboardService() AdminDashboardService {
	return &adminDashboardService{}
}

func (s *adminDashboardService) GetStats() (*AdminDashboardStats, error) {
	var stats AdminDashboardStats

	// Count Total Klien
	if err := database.DB.Model(&models.Klien{}).Count(&stats.TotalKlien).Error; err != nil {
		return nil, err
	}

	// Count Klien Menunggu
	if err := database.DB.Model(&models.Klien{}).Where("status_verifikasi = ?", models.StatusVerifikasiMenunggu).Count(&stats.KlienMenunggu).Error; err != nil {
		return nil, err
	}

	// Count Booking Menunggu
	if err := database.DB.Model(&models.Booking{}).Where("status = ?", models.StatusBookingMenungguKonfirmasi).Count(&stats.BookingMenunggu).Error; err != nil {
		return nil, err
	}

	// Count Terapis Aktif
	if err := database.DB.Model(&models.Terapis{}).Where("aktif = ?", true).Count(&stats.TerapisAktif).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}
