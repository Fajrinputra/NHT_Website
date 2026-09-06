package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type BookingRepository interface {
	Create(booking *models.Booking) error
	FindByKlienID(klienID string) ([]models.Booking, error)
	FindByID(id string) (*models.Booking, error)
	FindAll(status string) ([]models.Booking, error)
	Update(booking *models.Booking) error
}

type bookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) Create(booking *models.Booking) error {
	return r.db.Create(booking).Error
}

func (r *bookingRepository) FindByKlienID(klienID string) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Preload("Terapis").Where("klien_id = ?", klienID).Order("tanggal DESC, jam DESC").Find(&bookings).Error
	return bookings, err
}

func (r *bookingRepository) FindByID(id string) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("Terapis").First(&booking, "id = ?", id).Error
	return &booking, err
}

func (r *bookingRepository) Update(booking *models.Booking) error {
	return r.db.Save(booking).Error
}

func (r *bookingRepository) FindAll(status string) ([]models.Booking, error) {
	var bookings []models.Booking
	db := r.db.Preload("Klien").Preload("Terapis")
	
	if status != "" && status != "SEMUA" {
		db = db.Where("status = ?", status)
	}
	
	err := db.Order("created_at DESC").Find(&bookings).Error
	return bookings, err
}
