package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type AnakService interface {
	CreateAnak(klienID string, req *dto.CreateAnakRequest) (*models.Anak, error)
	GetAnakByKlienID(klienID string) ([]models.Anak, error)
	UpdateAnak(anakID string, klienID string, req *dto.UpdateAnakRequest) (*models.Anak, error)
}

type anakService struct {
	anakRepo repository.AnakRepository
}

func NewAnakService(repo repository.AnakRepository) AnakService {
	return &anakService{anakRepo: repo}
}

func (s *anakService) CreateAnak(klienID string, req *dto.CreateAnakRequest) (*models.Anak, error) {
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return nil, errors.New("format tanggal lahir tidak valid, gunakan YYYY-MM-DD")
	}

	anak := &models.Anak{
		KlienID:            klienID,
		Nama:               req.Nama,
		TanggalLahir:       tanggalLahir,
		JenisKelamin:       models.JenisKelamin(req.JenisKelamin),
		BeratLahir:         req.BeratLahir,
		PanjangLahir:       req.PanjangLahir,
		LingkarKepalaLahir: req.LingkarKepalaLahir,
	}

	if err := s.anakRepo.Create(anak); err != nil {
		return nil, errors.New("gagal menyimpan data anak")
	}

	return anak, nil
}

func (s *anakService) GetAnakByKlienID(klienID string) ([]models.Anak, error) {
	anaks, err := s.anakRepo.FindByKlienID(klienID)
	if err != nil {
		return nil, errors.New("gagal mengambil data anak")
	}
	return anaks, nil
}

func (s *anakService) UpdateAnak(anakID string, klienID string, req *dto.UpdateAnakRequest) (*models.Anak, error) {
	anak, err := s.anakRepo.FindByID(anakID)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	if anak.KlienID != klienID {
		return nil, errors.New("tidak memiliki akses ke data anak ini")
	}

	if req.Nama != nil {
		anak.Nama = *req.Nama
	}
	if req.TanggalLahir != nil {
		tanggalLahir, err := time.Parse("2006-01-02", *req.TanggalLahir)
		if err == nil {
			anak.TanggalLahir = tanggalLahir
		}
	}
	if req.JenisKelamin != nil {
		anak.JenisKelamin = models.JenisKelamin(*req.JenisKelamin)
	}
	if req.BeratLahir != nil {
		anak.BeratLahir = req.BeratLahir
	}
	if req.PanjangLahir != nil {
		anak.PanjangLahir = req.PanjangLahir
	}
	if req.LingkarKepalaLahir != nil {
		anak.LingkarKepalaLahir = req.LingkarKepalaLahir
	}

	if err := s.anakRepo.Update(anak); err != nil {
		return nil, errors.New("gagal memperbarui data anak")
	}

	return anak, nil
}
