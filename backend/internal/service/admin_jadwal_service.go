package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type AdminJadwalService interface {
	GetJadwalByTanggal(tanggalStr string) ([]dto.JadwalAdminResponse, error)
	CreateJadwal(req dto.CreateJadwalRequest) (*dto.JadwalAdminResponse, error)
	ToggleJadwal(id string, req dto.ToggleJadwalRequest) error
}

type adminJadwalService struct {
	jadwalRepo repository.JadwalTersediaRepository
}

func NewAdminJadwalService(repo repository.JadwalTersediaRepository) AdminJadwalService {
	return &adminJadwalService{jadwalRepo: repo}
}

func (s *adminJadwalService) GetJadwalByTanggal(tanggalStr string) ([]dto.JadwalAdminResponse, error) {
	tanggal, err := time.Parse("2006-01-02", tanggalStr)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid, gunakan YYYY-MM-DD")
	}

	jadwals, err := s.jadwalRepo.FindAllByTanggal(tanggal)
	if err != nil {
		return nil, errors.New("gagal mengambil data jadwal")
	}

	var responses []dto.JadwalAdminResponse
	for _, j := range jadwals {
		responses = append(responses, dto.JadwalAdminResponse{
			ID:       j.ID,
			Tanggal:  j.Tanggal.Format("2006-01-02"),
			Jam:      j.Jam,
			Tersedia: j.Tersedia,
		})
	}
	
	if responses == nil {
		responses = []dto.JadwalAdminResponse{}
	}

	return responses, nil
}

func (s *adminJadwalService) CreateJadwal(req dto.CreateJadwalRequest) (*dto.JadwalAdminResponse, error) {
	tanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid")
	}

	// Cek apakah jadwal sudah ada
	existingJadwals, _ := s.jadwalRepo.FindAllByTanggal(tanggal)
	for _, j := range existingJadwals {
		if j.Jam == req.Jam {
			return nil, errors.New("jadwal pada jam tersebut sudah ada")
		}
	}

	jadwal := &models.JadwalTersedia{
		Tanggal:  tanggal,
		Jam:      req.Jam,
		Tersedia: true, // Default true when created by admin
	}

	err = s.jadwalRepo.Create(jadwal)
	if err != nil {
		return nil, errors.New("gagal menyimpan jadwal baru")
	}

	return &dto.JadwalAdminResponse{
		ID:       jadwal.ID,
		Tanggal:  jadwal.Tanggal.Format("2006-01-02"),
		Jam:      jadwal.Jam,
		Tersedia: jadwal.Tersedia,
	}, nil
}

func (s *adminJadwalService) ToggleJadwal(id string, req dto.ToggleJadwalRequest) error {
	err := s.jadwalRepo.ToggleTersedia(id, req.Tersedia)
	if err != nil {
		return errors.New("gagal mengubah ketersediaan jadwal")
	}
	return nil
}
