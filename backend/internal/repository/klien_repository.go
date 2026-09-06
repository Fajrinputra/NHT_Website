package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type KlienRepository interface {
	Create(klien *models.Klien) error
	FindByNomorTelepon(nomorTelepon string) (*models.Klien, error)
	FindByID(id string) (*models.Klien, error)
	UpdateKataSandi(id, newHash string) error
	FindAll(status string) ([]*models.Klien, error)
	UpdateStatusVerifikasi(id string, status models.StatusVerifikasi) error
}

type klienRepository struct {
	db *gorm.DB
}

func NewKlienRepository(db *gorm.DB) KlienRepository {
	return &klienRepository{db: db}
}

func (r *klienRepository) Create(klien *models.Klien) error {
	return r.db.Create(klien).Error
}

func (r *klienRepository) FindByNomorTelepon(nomorTelepon string) (*models.Klien, error) {
	var klien models.Klien
	err := r.db.Where("nomor_telepon = ?", nomorTelepon).First(&klien).Error
	if err != nil {
		return nil, err
	}
	return &klien, nil
}

func (r *klienRepository) FindByID(id string) (*models.Klien, error) {
	var klien models.Klien
	err := r.db.First(&klien, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &klien, nil
}

func (r *klienRepository) UpdateKataSandi(id, newHash string) error {
	return r.db.Model(&models.Klien{}).Where("id = ?", id).Update("kata_sandi_hash", newHash).Error
}

func (r *klienRepository) FindAll(status string) ([]*models.Klien, error) {
	var kliens []*models.Klien
	query := r.db.Model(&models.Klien{})
	if status != "" {
		query = query.Where("status_verifikasi = ?", status)
	}
	err := query.Order("created_at desc").Find(&kliens).Error
	return kliens, err
}

func (r *klienRepository) UpdateStatusVerifikasi(id string, status models.StatusVerifikasi) error {
	return r.db.Model(&models.Klien{}).Where("id = ?", id).Update("status_verifikasi", status).Error
}
