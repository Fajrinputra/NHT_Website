package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/repository"
)

type ArtikelService interface {
	GetLatestArtikels(limit int) ([]dto.ArtikelResponse, error)
	GetLatestByKategori(kategori string, limit int) ([]dto.ArtikelResponse, error)
	GetArtikelByID(id string) (*dto.ArtikelDetailResponse, error)
	SearchArtikels(query string) ([]dto.ArtikelResponse, error)
	GetAllArtikels() ([]dto.ArtikelResponse, error)
}

type artikelService struct {
	artikelRepo repository.ArtikelRepository
}

func NewArtikelService(repo repository.ArtikelRepository) ArtikelService {
	return &artikelService{artikelRepo: repo}
}

func (s *artikelService) GetLatestArtikels(limit int) ([]dto.ArtikelResponse, error) {
	artikels, err := s.artikelRepo.FindLatest(limit)
	if err != nil {
		return nil, errors.New("gagal mengambil artikel")
	}
	return toArtikelResponseList(artikels), nil
}

func (s *artikelService) GetLatestByKategori(kategori string, limit int) ([]dto.ArtikelResponse, error) {
	artikels, err := s.artikelRepo.FindLatestByKategori(kategori, limit)
	if err != nil {
		return nil, errors.New("gagal mengambil artikel")
	}
	return toArtikelResponseList(artikels), nil
}

func (s *artikelService) GetArtikelByID(id string) (*dto.ArtikelDetailResponse, error) {
	a, err := s.artikelRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("artikel tidak ditemukan")
	}
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
	}, nil
}

func (s *artikelService) SearchArtikels(query string) ([]dto.ArtikelResponse, error) {
	artikels, err := s.artikelRepo.Search(query)
	if err != nil {
		return nil, errors.New("gagal mencari artikel")
	}
	return toArtikelResponseList(artikels), nil
}

func (s *artikelService) GetAllArtikels() ([]dto.ArtikelResponse, error) {
	artikels, err := s.artikelRepo.FindAll()
	if err != nil {
		return nil, errors.New("gagal mengambil semua artikel")
	}
	return toArtikelResponseList(artikels), nil
}
