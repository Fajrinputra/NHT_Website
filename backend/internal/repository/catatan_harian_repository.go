package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type CatatanHarianRepository interface {
	Create(catatan *models.CatatanHarian) error
	FindByKonteks(klienID string, konteks models.KonteksCatatan, anakID *string) ([]models.CatatanHarian, error)
	FindByID(id string) (*models.CatatanHarian, error)
	Update(catatan *models.CatatanHarian) error
}

type catatanHarianRepository struct {
	db *gorm.DB
}

func NewCatatanHarianRepository(db *gorm.DB) CatatanHarianRepository {
	return &catatanHarianRepository{db: db}
}

func (r *catatanHarianRepository) Create(catatan *models.CatatanHarian) error {
	return r.db.Create(catatan).Error
}

func (r *catatanHarianRepository) FindByKonteks(klienID string, konteks models.KonteksCatatan, anakID *string) ([]models.CatatanHarian, error) {
	var catatan []models.CatatanHarian
	
	query := r.db.Where("klien_id = ? AND konteks = ?", klienID, konteks)
	
	if anakID != nil && *anakID != "" {
		query = query.Where("anak_id = ?", *anakID)
	}

	err := query.Order("tanggal DESC").Find(&catatan).Error
	return catatan, err
}

func (r *catatanHarianRepository) FindByID(id string) (*models.CatatanHarian, error) {
	var catatan models.CatatanHarian
	err := r.db.First(&catatan, "id = ?", id).Error
	return &catatan, err
}

func (r *catatanHarianRepository) Update(catatan *models.CatatanHarian) error {
	return r.db.Save(catatan).Error
}
