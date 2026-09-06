package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type TerapisService interface {
	GetAll() ([]*dto.TerapisResponse, error)
	Create(req *dto.CreateTerapisRequest) (*dto.TerapisResponse, error)
	Update(id string, req *dto.UpdateTerapisRequest) (*dto.TerapisResponse, error)
}

type terapisService struct {
	terapisRepo repository.TerapisRepository
}

func NewTerapisService(terapisRepo repository.TerapisRepository) TerapisService {
	return &terapisService{terapisRepo: terapisRepo}
}

func (s *terapisService) GetAll() ([]*dto.TerapisResponse, error) {
	terapisList, err := s.terapisRepo.FindAll()
	if err != nil {
		return nil, err
	}

	var res []*dto.TerapisResponse
	for _, t := range terapisList {
		res = append(res, &dto.TerapisResponse{
			ID:           t.ID,
			Nama:         t.Nama,
			NomorTelepon: t.NomorTelepon,
			Aktif:        t.Aktif,
		})
	}
	return res, nil
}

func (s *terapisService) Create(req *dto.CreateTerapisRequest) (*dto.TerapisResponse, error) {
	terapis := &models.Terapis{
		Nama:         req.Nama,
		NomorTelepon: req.NomorTelepon,
		Aktif:        true,
	}

	if err := s.terapisRepo.Create(terapis); err != nil {
		return nil, err
	}

	return &dto.TerapisResponse{
		ID:           terapis.ID,
		Nama:         terapis.Nama,
		NomorTelepon: terapis.NomorTelepon,
		Aktif:        terapis.Aktif,
	}, nil
}

func (s *terapisService) Update(id string, req *dto.UpdateTerapisRequest) (*dto.TerapisResponse, error) {
	terapis, err := s.terapisRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("terapis tidak ditemukan")
	}

	terapis.Nama = req.Nama
	terapis.NomorTelepon = req.NomorTelepon
	terapis.Aktif = *req.Aktif

	if err := s.terapisRepo.Update(terapis); err != nil {
		return nil, err
	}

	return &dto.TerapisResponse{
		ID:           terapis.ID,
		Nama:         terapis.Nama,
		NomorTelepon: terapis.NomorTelepon,
		Aktif:        terapis.Aktif,
	}, nil
}
