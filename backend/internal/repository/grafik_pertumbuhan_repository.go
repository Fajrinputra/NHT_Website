package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type GrafikPertumbuhanRepository interface {
	Create(gp *models.GrafikPertumbuhan) error
}

type grafikPertumbuhanRepository struct {
	db *gorm.DB
}

func NewGrafikPertumbuhanRepository(db *gorm.DB) GrafikPertumbuhanRepository {
	return &grafikPertumbuhanRepository{db: db}
}

func (r *grafikPertumbuhanRepository) Create(gp *models.GrafikPertumbuhan) error {
	return r.db.Create(gp).Error
}
