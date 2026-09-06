package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type AdminKlienService interface {
	GetKliens(status string) ([]*dto.KlienListResponse, error)
	GetKlienDetail(klienID string) (*dto.ProfilResponse, error)
	UpdateVerifikasi(klienID string, status string) error
}

type adminKlienService struct {
	klienRepo repository.KlienRepository
	profilSvc ProfilService
}

func NewAdminKlienService(klienRepo repository.KlienRepository, profilSvc ProfilService) AdminKlienService {
	return &adminKlienService{
		klienRepo: klienRepo,
		profilSvc: profilSvc,
	}
}

func (s *adminKlienService) GetKliens(status string) ([]*dto.KlienListResponse, error) {
	kliens, err := s.klienRepo.FindAll(status)
	if err != nil {
		return nil, err
	}

	var res []*dto.KlienListResponse
	for _, k := range kliens {
		res = append(res, &dto.KlienListResponse{
			ID:               k.ID,
			NamaLengkap:      k.NamaLengkap,
			NomorTelepon:     k.NomorTelepon,
			StatusVerifikasi: string(k.StatusVerifikasi),
			CreatedAt:        k.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	return res, nil
}

func (s *adminKlienService) GetKlienDetail(klienID string) (*dto.ProfilResponse, error) {
	// Re-use profil service logic, this is why we injected it
	return s.profilSvc.GetProfil(klienID)
}

func (s *adminKlienService) UpdateVerifikasi(klienID string, status string) error {
	_, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return errors.New("klien tidak ditemukan")
	}

	return s.klienRepo.UpdateStatusVerifikasi(klienID, models.StatusVerifikasi(status))
}
