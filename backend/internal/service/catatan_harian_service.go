package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type CatatanHarianService interface {
	Create(klienID string, req *dto.CreateCatatanHarianRequest) (*dto.CatatanHarianResponse, error)
	GetByKonteks(klienID string, konteks string, anakID *string) ([]dto.CatatanHarianResponse, error)
	Update(id string, klienID string, req *dto.UpdateCatatanHarianRequest) (*dto.CatatanHarianResponse, error)
}

type catatanHarianService struct {
	repo repository.CatatanHarianRepository
}

func NewCatatanHarianService(repo repository.CatatanHarianRepository) CatatanHarianService {
	return &catatanHarianService{repo: repo}
}

func (s *catatanHarianService) Create(klienID string, req *dto.CreateCatatanHarianRequest) (*dto.CatatanHarianResponse, error) {
	tanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid, gunakan YYYY-MM-DD")
	}

	catatan := &models.CatatanHarian{
		KlienID:    klienID,
		Konteks:    models.KonteksCatatan(req.Konteks),
		AnakID:     req.AnakID,
		Tanggal:    tanggal,
		IsiCatatan: req.IsiCatatan,
	}

	if err := s.repo.Create(catatan); err != nil {
		return nil, errors.New("gagal menyimpan catatan harian")
	}

	return s.mapToDTO(catatan), nil
}

func (s *catatanHarianService) GetByKonteks(klienID string, konteks string, anakID *string) ([]dto.CatatanHarianResponse, error) {
	catatans, err := s.repo.FindByKonteks(klienID, models.KonteksCatatan(konteks), anakID)
	if err != nil {
		return nil, errors.New("gagal mengambil catatan harian")
	}

	var responses []dto.CatatanHarianResponse
	for _, c := range catatans {
		responses = append(responses, *s.mapToDTO(&c))
	}
	return responses, nil
}

func (s *catatanHarianService) Update(id string, klienID string, req *dto.UpdateCatatanHarianRequest) (*dto.CatatanHarianResponse, error) {
	catatan, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("catatan harian tidak ditemukan")
	}

	if catatan.KlienID != klienID {
		return nil, errors.New("tidak memiliki akses ke catatan ini")
	}

	if req.Tanggal != "" {
		tanggal, err := time.Parse("2006-01-02", req.Tanggal)
		if err == nil {
			catatan.Tanggal = tanggal
		}
	}
	
	if req.IsiCatatan != "" {
		catatan.IsiCatatan = req.IsiCatatan
	}

	if err := s.repo.Update(catatan); err != nil {
		return nil, errors.New("gagal memperbarui catatan harian")
	}

	return s.mapToDTO(catatan), nil
}

func (s *catatanHarianService) mapToDTO(c *models.CatatanHarian) *dto.CatatanHarianResponse {
	return &dto.CatatanHarianResponse{
		ID:         c.ID,
		KlienID:    c.KlienID,
		Konteks:    string(c.Konteks),
		AnakID:     c.AnakID,
		Tanggal:    c.Tanggal,
		IsiCatatan: c.IsiCatatan,
		CreatedAt:  c.CreatedAt,
	}
}
