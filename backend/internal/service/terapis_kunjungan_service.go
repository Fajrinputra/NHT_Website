package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type TerapisKunjunganService interface {
	GetJadwalKunjungan(terapisID string, status string) ([]dto.TerapisKunjunganResponse, error)
	GetDetailKunjungan(terapisID string, bookingID string) (*dto.TerapisKunjunganResponse, error)
	GetRiwayatKesehatanKlien(terapisID string, klienID string) (*dto.TerapisRiwayatKesehatanKlienResponse, error)
}

type terapisKunjunganService struct {
	bookingRepo   repository.BookingRepository
	klienRepo     repository.KlienRepository
	ibuHamilRepo  repository.IbuHamilRepository
	anakRepo      repository.AnakRepository
	bayiRepo      repository.BayiRepository
}

func NewTerapisKunjunganService(
	bookingRepo repository.BookingRepository,
	klienRepo repository.KlienRepository,
	ibuHamilRepo repository.IbuHamilRepository,
	anakRepo repository.AnakRepository,
	bayiRepo repository.BayiRepository,
) TerapisKunjunganService {
	return &terapisKunjunganService{
		bookingRepo:  bookingRepo,
		klienRepo:    klienRepo,
		ibuHamilRepo: ibuHamilRepo,
		anakRepo:     anakRepo,
		bayiRepo:     bayiRepo,
	}
}

func (s *terapisKunjunganService) GetJadwalKunjungan(terapisID string, status string) ([]dto.TerapisKunjunganResponse, error) {
	bookings, err := s.bookingRepo.FindByTerapisID(terapisID, status)
	if err != nil {
		return nil, errors.New("gagal mengambil jadwal kunjungan")
	}

	var responses []dto.TerapisKunjunganResponse
	for _, b := range bookings {
		responses = append(responses, s.toKunjunganResponse(&b))
	}
	
	if responses == nil {
		responses = []dto.TerapisKunjunganResponse{}
	}

	return responses, nil
}

func (s *terapisKunjunganService) GetDetailKunjungan(terapisID string, bookingID string) (*dto.TerapisKunjunganResponse, error) {
	b, err := s.bookingRepo.FindByID(bookingID)
	if err != nil {
		return nil, errors.New("booking tidak ditemukan")
	}

	if b.TerapisID == nil || *b.TerapisID != terapisID {
		return nil, errors.New("akses ditolak: ini bukan jadwal kunjungan Anda")
	}

	res := s.toKunjunganResponse(b)
	return &res, nil
}

func (s *terapisKunjunganService) GetRiwayatKesehatanKlien(terapisID string, klienID string) (*dto.TerapisRiwayatKesehatanKlienResponse, error) {
	// 1. Verify that this Terapis has a booking with this Klien to ensure authorization
	// For simplicity, we assume they can view if they have the klienID, but ideally we check if they had a booking
	bookings, err := s.bookingRepo.FindByKlienID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}
	
	hasAccess := false
	for _, b := range bookings {
		if b.TerapisID != nil && *b.TerapisID == terapisID {
			hasAccess = true
			break
		}
	}
	
	if !hasAccess {
		return nil, errors.New("akses ditolak: Anda tidak memiliki riwayat penanganan klien ini")
	}

	klien, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}

	res := &dto.TerapisRiwayatKesehatanKlienResponse{
		KlienID:     klien.ID,
		NamaLengkap: klien.NamaLengkap,
	}

	// Ambil data Ibu Hamil
	if ibuHamil, _ := s.ibuHamilRepo.FindByKlienID(klienID); ibuHamil != nil {
		res.IbuHamil = ibuHamil
	}

	// Ambil data Bayi
	if bayiList, _ := s.bayiRepo.FindByKlienID(klienID); len(bayiList) > 0 {
		res.Bayi = bayiList
	}

	// Ambil data Anak
	if anakList, _ := s.anakRepo.FindByKlienID(klienID); len(anakList) > 0 {
		res.Anak = anakList
	}

	return res, nil
}

func (s *terapisKunjunganService) toKunjunganResponse(b *models.Booking) dto.TerapisKunjunganResponse {
	return dto.TerapisKunjunganResponse{
		ID:               b.ID,
		KlienID:          b.KlienID,
		NamaKlien:        b.Klien.NamaLengkap,
		JenisLayanan:     string(b.JenisLayanan),
		Tanggal:          b.Tanggal.Format("2006-01-02"),
		Jam:              b.Jam,
		KeluhanScreening: b.KeluhanScreening,
		Status:           string(b.Status),
		CatatanTerapis:   b.CatatanTerapis,
	}
}
