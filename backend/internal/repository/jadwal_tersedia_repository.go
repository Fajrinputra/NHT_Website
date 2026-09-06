package repository

import (
	"time"

	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type JadwalTersediaRepository interface {
	FindTersediaByBulan(tahun int, bulan int) ([]models.JadwalTersedia, error)
	FindTersediaByTanggal(tanggal time.Time) ([]models.JadwalTersedia, error)
	FindAllByTanggal(tanggal time.Time) ([]models.JadwalTersedia, error)
	MarkAsBooked(tanggal time.Time, jam string) error
	Create(jadwal *models.JadwalTersedia) error
	ToggleTersedia(id string, tersedia bool) error
}

type jadwalTersediaRepository struct {
	db *gorm.DB
}

func NewJadwalTersediaRepository(db *gorm.DB) JadwalTersediaRepository {
	return &jadwalTersediaRepository{db: db}
}

func (r *jadwalTersediaRepository) FindTersediaByBulan(tahun int, bulan int) ([]models.JadwalTersedia, error) {
	var jadwals []models.JadwalTersedia
	
	startOfMonth := time.Date(tahun, time.Month(bulan), 1, 0, 0, 0, 0, time.UTC)
	endOfMonth := startOfMonth.AddDate(0, 1, -1)

	err := r.db.Where("tersedia = ? AND tanggal >= ? AND tanggal <= ?", true, startOfMonth, endOfMonth).Find(&jadwals).Error
	return jadwals, err
}

func (r *jadwalTersediaRepository) FindTersediaByTanggal(tanggal time.Time) ([]models.JadwalTersedia, error) {
	var jadwals []models.JadwalTersedia
	err := r.db.Where("tersedia = ? AND tanggal = ?", true, tanggal).Find(&jadwals).Error
	return jadwals, err
}

func (r *jadwalTersediaRepository) FindAllByTanggal(tanggal time.Time) ([]models.JadwalTersedia, error) {
	var jadwals []models.JadwalTersedia
	err := r.db.Where("tanggal = ?", tanggal).Order("jam ASC").Find(&jadwals).Error
	return jadwals, err
}

func (r *jadwalTersediaRepository) MarkAsBooked(tanggal time.Time, jam string) error {
	return r.db.Model(&models.JadwalTersedia{}).
		Where("tanggal = ? AND jam = ?", tanggal, jam).
		Update("tersedia", false).Error
}

func (r *jadwalTersediaRepository) Create(jadwal *models.JadwalTersedia) error {
	return r.db.Create(jadwal).Error
}

func (r *jadwalTersediaRepository) ToggleTersedia(id string, tersedia bool) error {
	return r.db.Model(&models.JadwalTersedia{}).
		Where("id = ?", id).
		Update("tersedia", tersedia).Error
}
