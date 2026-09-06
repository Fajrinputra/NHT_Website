package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/utils"
)

type AdminAuthService interface {
	Login(req *dto.AdminLoginRequest) (*dto.AdminLoginResponse, error)
}

type adminAuthService struct {
	adminRepo repository.AdminRepository
}

func NewAdminAuthService(adminRepo repository.AdminRepository) AdminAuthService {
	return &adminAuthService{adminRepo: adminRepo}
}

func (s *adminAuthService) Login(req *dto.AdminLoginRequest) (*dto.AdminLoginResponse, error) {
	admin, err := s.adminRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("email atau kata sandi salah")
	}

	if !utils.CheckPasswordHash(req.KataSandi, admin.KataSandiHash) {
		return nil, errors.New("email atau kata sandi salah")
	}

	token, err := utils.GenerateAdminToken(admin.ID)
	if err != nil {
		return nil, errors.New("gagal generate token")
	}

	return &dto.AdminLoginResponse{Token: token}, nil
}
