package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type TerapisRepository interface {
	FindAll() ([]*models.Terapis, error)
	FindByID(id string) (*models.Terapis, error)
	Create(terapis *models.Terapis) error
	Update(terapis *models.Terapis) error
}

type terapisRepository struct {
	db *gorm.DB
}

func NewTerapisRepository(db *gorm.DB) TerapisRepository {
	return &terapisRepository{db: db}
}

func (r *terapisRepository) FindAll() ([]*models.Terapis, error) {
	var terapis []*models.Terapis
	err := r.db.Order("nama asc").Find(&terapis).Error
	return terapis, err
}

func (r *terapisRepository) FindByID(id string) (*models.Terapis, error) {
	var terapis models.Terapis
	err := r.db.First(&terapis, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &terapis, nil
}

func (r *terapisRepository) Create(terapis *models.Terapis) error {
	return r.db.Create(terapis).Error
}

func (r *terapisRepository) Update(terapis *models.Terapis) error {
	return r.db.Save(terapis).Error
}
