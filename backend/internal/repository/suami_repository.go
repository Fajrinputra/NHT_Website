package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SuamiRepository interface {
	FindByKlienID(klienID string) (*models.Suami, error)
	Upsert(suami *models.Suami) error
}

type suamiRepository struct {
	db *gorm.DB
}

func NewSuamiRepository(db *gorm.DB) SuamiRepository {
	return &suamiRepository{db: db}
}

func (r *suamiRepository) FindByKlienID(klienID string) (*models.Suami, error) {
	var suami models.Suami
	err := r.db.Where("klien_id = ?", klienID).First(&suami).Error
	if err != nil {
		return nil, err
	}
	return &suami, nil
}

func (r *suamiRepository) Upsert(suami *models.Suami) error {
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "klien_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"nama", "nomor_telepon"}),
	}).Create(suami).Error
}
