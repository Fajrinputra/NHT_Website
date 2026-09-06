package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type AdminBookingService interface {
	GetAllBookings(status string) ([]dto.AdminBookingResponse, error)
	GetBookingByID(id string) (*dto.AdminBookingResponse, error)
	UpdateBooking(id string, req dto.AdminUpdateBookingRequest) (*dto.AdminBookingResponse, error)
}

type adminBookingService struct {
	bookingRepo repository.BookingRepository
	terapisRepo repository.TerapisRepository
}

func NewAdminBookingService(bookingRepo repository.BookingRepository, terapisRepo repository.TerapisRepository) AdminBookingService {
	return &adminBookingService{
		bookingRepo: bookingRepo,
		terapisRepo: terapisRepo,
	}
}

func (s *adminBookingService) GetAllBookings(status string) ([]dto.AdminBookingResponse, error) {
	bookings, err := s.bookingRepo.FindAll(status)
	if err != nil {
		return nil, errors.New("gagal mengambil data booking")
	}

	var responses []dto.AdminBookingResponse
	for _, b := range bookings {
		responses = append(responses, s.toAdminResponse(&b))
	}
	
	if responses == nil {
		responses = []dto.AdminBookingResponse{}
	}

	return responses, nil
}

func (s *adminBookingService) GetBookingByID(id string) (*dto.AdminBookingResponse, error) {
	b, err := s.bookingRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("booking tidak ditemukan")
	}

	res := s.toAdminResponse(b)
	return &res, nil
}

func (s *adminBookingService) UpdateBooking(id string, req dto.AdminUpdateBookingRequest) (*dto.AdminBookingResponse, error) {
	b, err := s.bookingRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("booking tidak ditemukan")
	}

	if req.TerapisID != nil && *req.TerapisID != "" {
		terapis, err := s.terapisRepo.FindByID(*req.TerapisID)
		if err != nil {
			return nil, errors.New("terapis tidak ditemukan")
		}
		if !terapis.Aktif {
			return nil, errors.New("terapis yang dipilih sedang tidak aktif")
		}
		b.TerapisID = req.TerapisID
	} else if req.TerapisID != nil && *req.TerapisID == "" {
		b.TerapisID = nil
	}

	b.Status = models.StatusBooking(req.Status)
	b.CatatanTerapis = req.CatatanTerapis

	err = s.bookingRepo.Update(b)
	if err != nil {
		return nil, errors.New("gagal memperbarui booking")
	}
	
	// Fetch again to get updated Preload data
	updatedBooking, _ := s.bookingRepo.FindByID(id)

	res := s.toAdminResponse(updatedBooking)
	return &res, nil
}

func (s *adminBookingService) toAdminResponse(b *models.Booking) dto.AdminBookingResponse {
	namaTerapis := "-"
	if b.Terapis != nil {
		namaTerapis = b.Terapis.Nama
	}

	return dto.AdminBookingResponse{
		ID:               b.ID,
		KlienID:          b.KlienID,
		NamaKlien:        b.Klien.NamaLengkap,
		TerapisID:        b.TerapisID,
		NamaTerapis:      namaTerapis,
		JenisLayanan:     string(b.JenisLayanan),
		Tanggal:          b.Tanggal.Format("2006-01-02"),
		Jam:              b.Jam,
		KeluhanScreening: b.KeluhanScreening,
		Status:           string(b.Status),
		CatatanTerapis:   b.CatatanTerapis,
		CreatedAt:        b.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
