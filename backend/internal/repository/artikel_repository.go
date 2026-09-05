package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type ArtikelRepository interface {
	FindLatest(limit int) ([]models.Artikel, error)
	FindLatestByKategori(kategori string, limit int) ([]models.Artikel, error)
	FindByID(id string) (*models.Artikel, error)
	Search(query string) ([]models.Artikel, error)
	FindAll() ([]models.Artikel, error)
}

type artikelRepository struct {
	db *gorm.DB
}

func NewArtikelRepository(db *gorm.DB) ArtikelRepository {
	return &artikelRepository{db: db}
}

func (r *artikelRepository) FindLatest(limit int) ([]models.Artikel, error) {
	var artikels []models.Artikel
	err := r.db.Order("created_at DESC").Limit(limit).Find(&artikels).Error
	return artikels, err
}

func (r *artikelRepository) FindLatestByKategori(kategori string, limit int) ([]models.Artikel, error) {
	var artikels []models.Artikel
	err := r.db.Where("kategori = ?", kategori).Order("created_at DESC").Limit(limit).Find(&artikels).Error
	return artikels, err
}

func (r *artikelRepository) FindByID(id string) (*models.Artikel, error) {
	var artikel models.Artikel
	err := r.db.First(&artikel, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &artikel, nil
}

func (r *artikelRepository) Search(query string) ([]models.Artikel, error) {
	var artikels []models.Artikel
	pattern := "%" + query + "%"
	err := r.db.Where("judul ILIKE ? OR cuplikan ILIKE ?", pattern, pattern).
		Order("created_at DESC").Find(&artikels).Error
	return artikels, err
}

func (r *artikelRepository) FindAll() ([]models.Artikel, error) {
	var artikels []models.Artikel
	err := r.db.Order("created_at DESC").Find(&artikels).Error
	return artikels, err
}
