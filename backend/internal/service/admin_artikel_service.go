package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
)

type AdminArtikelService interface {
	CreateArtikel(req dto.CreateArtikelRequest) (*dto.ArtikelDetailResponse, error)
	UpdateArtikel(id string, req dto.UpdateArtikelRequest) (*dto.ArtikelDetailResponse, error)
	DeleteArtikel(id string) error
	GetAllArtikels() ([]dto.ArtikelResponse, error) // Can reuse from ArtikelService but good to have here for admin isolation
}

type adminArtikelService struct {
	artikelRepo repository.ArtikelRepository
}

func NewAdminArtikelService(repo repository.ArtikelRepository) AdminArtikelService {
	return &adminArtikelService{artikelRepo: repo}
}

func (s *adminArtikelService) CreateArtikel(req dto.CreateArtikelRequest) (*dto.ArtikelDetailResponse, error) {
	artikel := &models.Artikel{
		Judul:     req.Judul,
		Kategori:  models.KategoriArtikel(req.Kategori),
		Cuplikan:  req.Cuplikan,
		IsiKonten: req.IsiKonten,
		GambarURL: req.GambarURL,
	}

	err := s.artikelRepo.Create(artikel)
	if err != nil {
		return nil, errors.New("gagal membuat artikel")
	}

	return s.toDetailResponse(artikel), nil
}

func (s *adminArtikelService) UpdateArtikel(id string, req dto.UpdateArtikelRequest) (*dto.ArtikelDetailResponse, error) {
	artikel, err := s.artikelRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("artikel tidak ditemukan")
	}

	artikel.Judul = req.Judul
	artikel.Kategori = models.KategoriArtikel(req.Kategori)
	artikel.Cuplikan = req.Cuplikan
	artikel.IsiKonten = req.IsiKonten
	artikel.GambarURL = req.GambarURL

	err = s.artikelRepo.Update(artikel)
	if err != nil {
		return nil, errors.New("gagal memperbarui artikel")
	}

	return s.toDetailResponse(artikel), nil
}

func (s *adminArtikelService) DeleteArtikel(id string) error {
	_, err := s.artikelRepo.FindByID(id)
	if err != nil {
		return errors.New("artikel tidak ditemukan")
	}

	err = s.artikelRepo.Delete(id)
	if err != nil {
		return errors.New("gagal menghapus artikel")
	}

	return nil
}

func (s *adminArtikelService) GetAllArtikels() ([]dto.ArtikelResponse, error) {
	artikels, err := s.artikelRepo.FindAll()
	if err != nil {
		return nil, errors.New("gagal mengambil data artikel")
	}
	
	var responses []dto.ArtikelResponse
	for _, a := range artikels {
		responses = append(responses, dto.ArtikelResponse{
			ID:        a.ID,
			Judul:     a.Judul,
			Kategori:  string(a.Kategori),
			GambarURL: a.GambarURL,
			Cuplikan:  a.Cuplikan,
			CreatedAt: a.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	
	if responses == nil {
		responses = []dto.ArtikelResponse{}
	}
	
	return responses, nil
}

func (s *adminArtikelService) toDetailResponse(a *models.Artikel) *dto.ArtikelDetailResponse {
	return &dto.ArtikelDetailResponse{
		ArtikelResponse: dto.ArtikelResponse{
			ID:        a.ID,
			Judul:     a.Judul,
			Kategori:  string(a.Kategori),
			GambarURL: a.GambarURL,
			Cuplikan:  a.Cuplikan,
			CreatedAt: a.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		},
		IsiKonten: a.IsiKonten,
	}
}
