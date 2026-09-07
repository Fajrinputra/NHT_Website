package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type CatatanImunisasiRepository interface {
	FindByID(id string) (*models.CatatanImunisasi, error)
	Update(ci *models.CatatanImunisasi) error
}

type catatanImunisasiRepository struct {
	db *gorm.DB
}

func NewCatatanImunisasiRepository(db *gorm.DB) CatatanImunisasiRepository {
	return &catatanImunisasiRepository{db: db}
}

func (r *catatanImunisasiRepository) FindByID(id string) (*models.CatatanImunisasi, error) {
	var ci models.CatatanImunisasi
	err := r.db.First(&ci, "id = ?", id).Error
	return &ci, err
}

func (r *catatanImunisasiRepository) Update(ci *models.CatatanImunisasi) error {
	return r.db.Save(ci).Error
}
