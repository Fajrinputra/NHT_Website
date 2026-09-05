package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IbuRepository interface {
	FindByKlienID(klienID string) (*models.Ibu, error)
	Upsert(ibu *models.Ibu) error
}

type ibuRepository struct {
	db *gorm.DB
}

func NewIbuRepository(db *gorm.DB) IbuRepository {
	return &ibuRepository{db: db}
}

func (r *ibuRepository) FindByKlienID(klienID string) (*models.Ibu, error) {
	var ibu models.Ibu
	err := r.db.Where("klien_id = ?", klienID).First(&ibu).Error
	if err != nil {
		return nil, err
	}
	return &ibu, nil
}

// Upsert creates or updates the Ibu record (1-to-1 with klien)
func (r *ibuRepository) Upsert(ibu *models.Ibu) error {
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "klien_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"hpht", "berat_sebelum_hamil", "tinggi_badan", "updated_at"}),
	}).Create(ibu).Error
}
