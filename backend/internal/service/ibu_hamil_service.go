package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/utils"
	"gorm.io/gorm"
)

type IbuHamilService interface {
	GetIbuHamil(klienID string) (*dto.IbuHamilResponse, error)
	UpdateIbuHamil(klienID string, req *dto.UpdateIbuHamilRequest) (*dto.IbuHamilResponse, error)
}

type ibuHamilService struct {
	ibuRepo repository.IbuRepository
}

func NewIbuHamilService(ibuRepo repository.IbuRepository) IbuHamilService {
	return &ibuHamilService{ibuRepo: ibuRepo}
}

func (s *ibuHamilService) GetIbuHamil(klienID string) (*dto.IbuHamilResponse, error) {
	ibu, err := s.ibuRepo.FindByKlienID(klienID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Kembalikan data kosong — klien belum isi data
			return &dto.IbuHamilResponse{KlienID: klienID}, nil
		}
		return nil, errors.New("gagal mengambil data ibu hamil")
	}
	return s.buildResponse(ibu), nil
}

func (s *ibuHamilService) UpdateIbuHamil(klienID string, req *dto.UpdateIbuHamilRequest) (*dto.IbuHamilResponse, error) {
	hpht, err := time.Parse("2006-01-02", req.HPHT)
	if err != nil {
		return nil, errors.New("format tanggal HPHT tidak valid, gunakan YYYY-MM-DD")
	}

	ibu := &models.Ibu{
		KlienID:           klienID,
		HPHT:              &hpht,
		BeratSebelumHamil: &req.BeratSebelumHamil,
		TinggiBadan:       &req.TinggiBadan,
		UpdatedAt:         time.Now(),
	}

	// Isi nama jika belum ada (bisa diupdate via profil)
	existingIbu, _ := s.ibuRepo.FindByKlienID(klienID)
	if existingIbu != nil {
		ibu.ID = existingIbu.ID
		ibu.Nama = existingIbu.Nama
		ibu.TanggalLahir = existingIbu.TanggalLahir
	}

	if err := s.ibuRepo.Upsert(ibu); err != nil {
		return nil, errors.New("gagal menyimpan data ibu hamil")
	}

	// Ambil data terbaru
	saved, _ := s.ibuRepo.FindByKlienID(klienID)
	if saved == nil {
		saved = ibu
	}
	return s.buildResponse(saved), nil
}

// buildResponse menjalankan semua kalkulasi di service layer
func (s *ibuHamilService) buildResponse(ibu *models.Ibu) *dto.IbuHamilResponse {
	resp := &dto.IbuHamilResponse{
		ID:                ibu.ID,
		KlienID:           ibu.KlienID,
		Nama:              ibu.Nama,
		TanggalLahir:      ibu.TanggalLahir,
		HPHT:              ibu.HPHT,
		BeratSebelumHamil: ibu.BeratSebelumHamil,
		TinggiBadan:       ibu.TinggiBadan,
		UpdatedAt:         ibu.UpdatedAt,
	}

	// Kalkulasi hanya jika HPHT sudah diisi
	if ibu.HPHT != nil {
		minggu := utils.HitungUsiaKehamilan(*ibu.HPHT)
		trimester := utils.HitungTrimester(minggu)
		hpl := utils.HitungHPL(*ibu.HPHT).Format("2006-01-02")

		resp.UsiaKandunganMinggu = &minggu
		resp.Trimester = &trimester
		resp.HPL = &hpl

		// IMT hanya jika berat dan tinggi diisi
		if ibu.BeratSebelumHamil != nil && ibu.TinggiBadan != nil {
			imt := utils.HitungIMT(*ibu.BeratSebelumHamil, *ibu.TinggiBadan)
			hasil := utils.KategoriIMT(imt)
			resp.IMT = &imt
			resp.KategoriIMT = &hasil.Kategori
			resp.RekomendasiKenaikanBB = &hasil.RekomendasiKenaikan
		}
	}

	return resp
}
