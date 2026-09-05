package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type AnakService interface {
	CreateAnak(klienID string, req *dto.CreateAnakRequest) (*dto.AnakResponse, error)
	GetAnakByKlienID(klienID string) ([]dto.AnakResponse, error)
	UpdateAnak(anakID string, klienID string, req *dto.UpdateAnakRequest) (*dto.AnakResponse, error)
	GetGrafikPertumbuhan(anakID string, klienID string) ([]models.GrafikPertumbuhan, error)
	GetCatatanImunisasi(anakID string, klienID string) ([]models.CatatanImunisasi, error)
	GetHasilDenverII(anakID string, klienID string) ([]models.HasilDenverII, error)
}

type anakService struct {
	anakRepo repository.AnakRepository
}

func NewAnakService(repo repository.AnakRepository) AnakService {
	return &anakService{anakRepo: repo}
}

func (s *anakService) CreateAnak(klienID string, req *dto.CreateAnakRequest) (*dto.AnakResponse, error) {
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

	return s.mapToDTO(anak), nil
}

func (s *anakService) GetAnakByKlienID(klienID string) ([]dto.AnakResponse, error) {
	anaks, err := s.anakRepo.FindByKlienID(klienID)
	if err != nil {
		return nil, errors.New("gagal mengambil data anak")
	}
	
	var responses []dto.AnakResponse
	for _, a := range anaks {
		responses = append(responses, *s.mapToDTO(&a))
	}
	return responses, nil
}

func (s *anakService) UpdateAnak(anakID string, klienID string, req *dto.UpdateAnakRequest) (*dto.AnakResponse, error) {
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

	return s.mapToDTO(anak), nil
}

func (s *anakService) checkAccess(anakID, klienID string) error {
	anak, err := s.anakRepo.FindByID(anakID)
	if err != nil {
		return errors.New("data anak tidak ditemukan")
	}
	if anak.KlienID != klienID {
		return errors.New("tidak memiliki akses ke data anak ini")
	}
	return nil
}

func (s *anakService) GetGrafikPertumbuhan(anakID string, klienID string) ([]models.GrafikPertumbuhan, error) {
	if err := s.checkAccess(anakID, klienID); err != nil {
		return nil, err
	}
	return s.anakRepo.GetGrafikPertumbuhan(anakID)
}

func (s *anakService) GetCatatanImunisasi(anakID string, klienID string) ([]models.CatatanImunisasi, error) {
	if err := s.checkAccess(anakID, klienID); err != nil {
		return nil, err
	}
	return s.anakRepo.GetCatatanImunisasi(anakID)
}

func (s *anakService) GetHasilDenverII(anakID string, klienID string) ([]models.HasilDenverII, error) {
	if err := s.checkAccess(anakID, klienID); err != nil {
		return nil, err
	}
	return s.anakRepo.GetHasilDenverII(anakID)
}

func (s *anakService) mapToDTO(a *models.Anak) *dto.AnakResponse {
	usiaBulan := utils.HitungUsiaAnak(a.TanggalLahir)
	tipeAnak := "BAYI"
	if usiaBulan >= 24 {
		tipeAnak = "ANAK"
	}

	return &dto.AnakResponse{
		ID:                 a.ID,
		KlienID:            a.KlienID,
		Nama:               a.Nama,
		TanggalLahir:       a.TanggalLahir,
		JenisKelamin:       string(a.JenisKelamin),
		BeratLahir:         a.BeratLahir,
		PanjangLahir:       a.PanjangLahir,
		LingkarKepalaLahir: a.LingkarKepalaLahir,
		UsiaBulan:          usiaBulan,
		TipeAnak:           tipeAnak,
		CreatedAt:          a.CreatedAt,
	}
}
