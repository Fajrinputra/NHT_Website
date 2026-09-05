package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type ProfilService interface {
	GetProfil(klienID string) (*dto.ProfilResponse, error)
}

type profilService struct {
	klienRepo repository.KlienRepository
	ibuRepo   repository.IbuRepository
	suamiRepo repository.SuamiRepository
	anakRepo  repository.AnakRepository
}

func NewProfilService(
	klienRepo repository.KlienRepository,
	ibuRepo repository.IbuRepository,
	suamiRepo repository.SuamiRepository,
	anakRepo repository.AnakRepository,
) ProfilService {
	return &profilService{
		klienRepo: klienRepo,
		ibuRepo:   ibuRepo,
		suamiRepo: suamiRepo,
		anakRepo:  anakRepo,
	}
}

func (s *profilService) GetProfil(klienID string) (*dto.ProfilResponse, error) {
	klien, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}

	resp := &dto.ProfilResponse{
		KlienID:      klienID,
		NomorTelepon: klien.NomorTelepon,
		Keluarga:     []dto.KeluargaResponse{},
	}

	ibu, _ := s.ibuRepo.FindByKlienID(klienID)
	if ibu != nil && ibu.Nama != "" {
		resp.Keluarga = append(resp.Keluarga, dto.KeluargaResponse{
			Peran: "Ibu",
			Nama:  ibu.Nama,
		})
	}

	suami, _ := s.suamiRepo.FindByKlienID(klienID)
	if suami != nil && suami.Nama != "" {
		resp.Keluarga = append(resp.Keluarga, dto.KeluargaResponse{
			Peran: "Suami",
			Nama:  suami.Nama,
		})
	}

	anaks, _ := s.anakRepo.FindByKlienID(klienID)
	for _, a := range anaks {
		resp.Keluarga = append(resp.Keluarga, dto.KeluargaResponse{
			Peran:        "Anak",
			Nama:         a.Nama,
			TanggalLahir: a.TanggalLahir,
		})
	}

	return resp, nil
}
