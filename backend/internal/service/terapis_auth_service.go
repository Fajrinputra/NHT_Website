package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/utils"
)

type TerapisAuthService interface {
	Login(req dto.TerapisLoginRequest) (*dto.TerapisLoginResponse, error)
}

type terapisAuthService struct {
	terapisRepo repository.TerapisRepository
}

func NewTerapisAuthService(terapisRepo repository.TerapisRepository) TerapisAuthService {
	return &terapisAuthService{terapisRepo: terapisRepo}
}

func (s *terapisAuthService) Login(req dto.TerapisLoginRequest) (*dto.TerapisLoginResponse, error) {
	terapis, err := s.terapisRepo.FindByNomorTelepon(req.NomorTelepon)
	if err != nil {
		return nil, errors.New("nomor telepon atau kata sandi salah")
	}

	if !utils.CheckPasswordHash(req.KataSandi, terapis.KataSandiHash) {
		return nil, errors.New("nomor telepon atau kata sandi salah")
	}

	if !terapis.Aktif {
		return nil, errors.New("Akun Anda sedang dinonaktifkan, hubungi admin.")
	}

	token, err := utils.GenerateTerapisToken(terapis.ID)
	if err != nil {
		return nil, errors.New("gagal membuat token autentikasi")
	}

	return &dto.TerapisLoginResponse{
		Token: token,
		Terapis: dto.TerapisResponse{
			ID:           terapis.ID,
			Nama:         terapis.Nama,
			NomorTelepon: terapis.NomorTelepon,
			Aktif:        terapis.Aktif,
		},
	}, nil
}
