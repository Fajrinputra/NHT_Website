package service

import (
	"errors"
	"fmt"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/utils"
	"gorm.io/gorm"
)

type AuthService interface {
	Register(req *dto.RegisterRequest) (*dto.KlienResponse, error)
	Login(req *dto.LoginRequest) (*dto.LoginResponse, error)
	GetStatus(klienID string) (*dto.StatusResponse, error)
	GetMe(klienID string) (*dto.KlienResponse, error)
	ChangePassword(klienID string, req *dto.ChangePasswordRequest) error
}

type authService struct {
	klienRepo repository.KlienRepository
}

func NewAuthService(klienRepo repository.KlienRepository) AuthService {
	return &authService{klienRepo: klienRepo}
}

func (s *authService) Register(req *dto.RegisterRequest) (*dto.KlienResponse, error) {
	// Validasi konfirmasi kata sandi
	if req.KataSandi != req.KonfirmasiKataSandi {
		return nil, errors.New("kata sandi dan konfirmasi kata sandi tidak cocok")
	}

	// Cek nomor telepon sudah terdaftar
	existing, err := s.klienRepo.FindByNomorTelepon(req.NomorTelepon)
	if err == nil && existing != nil {
		return nil, errors.New("nomor telepon sudah terdaftar")
	}

	// Hash kata sandi
	hash, err := utils.HashPassword(req.KataSandi)
	if err != nil {
		return nil, errors.New("gagal memproses kata sandi")
	}

	klien := &models.Klien{
		NamaLengkap:      req.NamaLengkap,
		NomorTelepon:     req.NomorTelepon,
		KataSandiHash:    hash,
		StatusVerifikasi: models.StatusMenunggu,
	}

	if err := s.klienRepo.Create(klien); err != nil {
		return nil, errors.New("gagal membuat akun")
	}

	return toKlienResponse(klien), nil
}

func (s *authService) Login(req *dto.LoginRequest) (*dto.LoginResponse, error) {
	klien, err := s.klienRepo.FindByNomorTelepon(req.NomorTelepon)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("nomor telepon atau kata sandi tidak valid")
		}
		return nil, errors.New("terjadi kesalahan, coba lagi nanti")
	}

	if !utils.CheckPasswordHash(req.KataSandi, klien.KataSandiHash) {
		return nil, errors.New("nomor telepon atau kata sandi tidak valid")
	}

	// ATURAN BISNIS: akun harus berstatus AKTIF untuk bisa login
	switch klien.StatusVerifikasi {
	case models.StatusMenunggu:
		return nil, errors.New("akun Anda sedang dalam proses verifikasi. Mohon tunggu konfirmasi dari tim kami")
	case models.StatusDitolak:
		return nil, errors.New("akun Anda telah ditolak. Hubungi tim Nata House Treatment untuk informasi lebih lanjut")
	}

	token, err := utils.GenerateToken(klien.ID)
	if err != nil {
		return nil, errors.New("gagal membuat token")
	}

	return &dto.LoginResponse{
		Token: token,
		Klien: *toKlienResponse(klien),
	}, nil
}

func (s *authService) GetStatus(klienID string) (*dto.StatusResponse, error) {
	klien, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}
	return &dto.StatusResponse{StatusVerifikasi: string(klien.StatusVerifikasi)}, nil
}

func (s *authService) GetMe(klienID string) (*dto.KlienResponse, error) {
	klien, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}
	return toKlienResponse(klien), nil
}

func (s *authService) ChangePassword(klienID string, req *dto.ChangePasswordRequest) error {
	klien, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return errors.New("klien tidak ditemukan")
	}

	if !utils.CheckPasswordHash(req.KataSandiLama, klien.KataSandiHash) {
		return errors.New("kata sandi lama tidak benar")
	}

	newHash, err := utils.HashPassword(req.KataSandiBaru)
	if err != nil {
		return errors.New("gagal memproses kata sandi baru")
	}

	return s.klienRepo.UpdateKataSandi(klienID, newHash)
}

func toKlienResponse(k *models.Klien) *dto.KlienResponse {
	return &dto.KlienResponse{
		ID:               k.ID,
		NamaLengkap:      k.NamaLengkap,
		NomorTelepon:     k.NomorTelepon,
		StatusVerifikasi: string(k.StatusVerifikasi),
		CreatedAt:        fmt.Sprintf("%s", k.CreatedAt.Format(time.RFC3339)),
	}
}
