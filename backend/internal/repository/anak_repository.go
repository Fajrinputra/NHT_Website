package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type AnakRepository interface {
	Create(anak *models.Anak) error
	FindByKlienID(klienID string) ([]models.Anak, error)
	FindByID(id string) (*models.Anak, error)
	Update(anak *models.Anak) error
	GetGrafikPertumbuhan(anakID string) ([]models.GrafikPertumbuhan, error)
	GetCatatanImunisasi(anakID string) ([]models.CatatanImunisasi, error)
	GetHasilDenverII(anakID string) ([]models.HasilDenverII, error)
}

type anakRepository struct {
	db *gorm.DB
}

func NewAnakRepository(db *gorm.DB) AnakRepository {
	return &anakRepository{db: db}
}

func (r *anakRepository) Create(anak *models.Anak) error {
	return r.db.Create(anak).Error
}

func (r *anakRepository) FindByKlienID(klienID string) ([]models.Anak, error) {
	var anaks []models.Anak
	err := r.db.Where("klien_id = ?", klienID).Order("tanggal_lahir ASC").Find(&anaks).Error
	return anaks, err
}

func (r *anakRepository) FindByID(id string) (*models.Anak, error) {
	var anak models.Anak
	err := r.db.First(&anak, "id = ?", id).Error
	return &anak, err
}

func (r *anakRepository) Update(anak *models.Anak) error {
	return r.db.Save(anak).Error
}

func (r *anakRepository) GetGrafikPertumbuhan(anakID string) ([]models.GrafikPertumbuhan, error) {
	var grafik []models.GrafikPertumbuhan
	err := r.db.Where("anak_id = ?", anakID).Order("tanggal_ukur ASC").Find(&grafik).Error
	return grafik, err
}

func (r *anakRepository) GetCatatanImunisasi(anakID string) ([]models.CatatanImunisasi, error) {
	var imunisasi []models.CatatanImunisasi
	err := r.db.Where("anak_id = ?", anakID).Order("usia_rekomendasi ASC").Find(&imunisasi).Error
	return imunisasi, err
}

func (r *anakRepository) GetHasilDenverII(anakID string) ([]models.HasilDenverII, error) {
	var denver []models.HasilDenverII
	err := r.db.Where("anak_id = ?", anakID).Order("tanggal_skrining DESC").Find(&denver).Error
	return denver, err
}
