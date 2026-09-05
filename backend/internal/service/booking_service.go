package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type BookingService interface {
	CreateBooking(klienID string, req *dto.CreateBookingRequest) (*models.Booking, error)
	GetBookingHistory(klienID string) ([]models.Booking, error)
	GetJadwalTersedia(tahun int, bulan int) ([]models.JadwalTersedia, error)
}

type bookingService struct {
	bookingRepo        repository.BookingRepository
	jadwalTersediaRepo repository.JadwalTersediaRepository
	notifRepo          repository.NotifikasiRepository
}

func NewBookingService(bookingRepo repository.BookingRepository, jadwalTersediaRepo repository.JadwalTersediaRepository, notifRepo repository.NotifikasiRepository) BookingService {
	return &bookingService{
		bookingRepo:        bookingRepo,
		jadwalTersediaRepo: jadwalTersediaRepo,
		notifRepo:          notifRepo,
	}
}

func (s *bookingService) CreateBooking(klienID string, req *dto.CreateBookingRequest) (*models.Booking, error) {
	tanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid, gunakan YYYY-MM-DD")
	}

	// Cek apakah jadwal tersedia (opsional, tergantung logic bisnis)
	// Misalnya:
	jadwals, err := s.jadwalTersediaRepo.FindTersediaByTanggal(tanggal)
	if err != nil {
		return nil, errors.New("gagal mengecek jadwal")
	}
	
	tersedia := false
	for _, j := range jadwals {
		if j.Jam == req.Jam {
			tersedia = true
			break
		}
	}

	if !tersedia {
		// return nil, errors.New("jadwal tidak tersedia")
		// Jika bisnis membolehkan booking meski jadwal tidak ada di tabel jadwal_tersedia (admin yang menentukan nanti):
	}

	booking := &models.Booking{
		KlienID:          klienID,
		JenisLayanan:     models.JenisLayanan(req.JenisLayanan),
		Tanggal:          tanggal,
		Jam:              req.Jam,
		KeluhanScreening: req.KeluhanScreening,
		Status:           models.StatusBookingMenungguKonfirmasi,
	}

	if err := s.bookingRepo.Create(booking); err != nil {
		return nil, errors.New("gagal membuat booking")
	}

	// Update jadwal jika memang dari tabel
	if tersedia {
		_ = s.jadwalTersediaRepo.MarkAsBooked(tanggal, req.Jam)
	}

	// Trigger Notification
	if s.notifRepo != nil {
		_ = s.notifRepo.Create(&models.Notifikasi{
			KlienID: klienID,
			Judul:   "Booking Berhasil Dibuat",
			Pesan:   "Booking layanan " + string(req.JenisLayanan) + " untuk tanggal " + req.Tanggal + " sedang menunggu konfirmasi admin. Admin akan menghubungi Anda untuk konfirmasi.",
			Tipe:    "INFO",
			IsRead:  false,
		})
	}

	return booking, nil
}

func (s *bookingService) GetBookingHistory(klienID string) ([]models.Booking, error) {
	bookings, err := s.bookingRepo.FindByKlienID(klienID)
	if err != nil {
		return nil, errors.New("gagal mengambil riwayat booking")
	}
	return bookings, nil
}

func (s *bookingService) GetJadwalTersedia(tahun int, bulan int) ([]models.JadwalTersedia, error) {
	jadwals, err := s.jadwalTersediaRepo.FindTersediaByBulan(tahun, bulan)
	if err != nil {
		return nil, errors.New("gagal mengambil jadwal")
	}
	return jadwals, nil
}
