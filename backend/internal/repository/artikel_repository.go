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
	FindWithFilters(query string, kategori string) ([]models.Artikel, error)
	Create(artikel *models.Artikel) error
	Update(artikel *models.Artikel) error
	Delete(id string) error
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

func (r *artikelRepository) FindWithFilters(query string, kategori string) ([]models.Artikel, error) {
	var artikels []models.Artikel
	db := r.db

	if kategori != "" && kategori != "SEMUA" {
		db = db.Where("kategori = ?", kategori)
	}

	if query != "" {
		pattern := "%" + query + "%"
		db = db.Where("judul ILIKE ? OR cuplikan ILIKE ?", pattern, pattern)
	}

	err := db.Order("created_at DESC").Find(&artikels).Error
	return artikels, err
}

func (r *artikelRepository) Create(artikel *models.Artikel) error {
	return r.db.Create(artikel).Error
}

func (r *artikelRepository) Update(artikel *models.Artikel) error {
	return r.db.Save(artikel).Error
}

func (r *artikelRepository) Delete(id string) error {
	return r.db.Delete(&models.Artikel{}, "id = ?", id).Error
}

