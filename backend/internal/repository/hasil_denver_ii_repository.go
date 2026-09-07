package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type HasilDenverIIRepository interface {
	Create(h *models.HasilDenverII) error
}

type hasilDenverIIRepository struct {
	db *gorm.DB
}

func NewHasilDenverIIRepository(db *gorm.DB) HasilDenverIIRepository {
	return &hasilDenverIIRepository{db: db}
}

func (r *hasilDenverIIRepository) Create(h *models.HasilDenverII) error {
	return r.db.Create(h).Error
}
