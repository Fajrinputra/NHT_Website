package repository

import (
	"github.com/nata-house/backend/internal/models"
	"gorm.io/gorm"
)

type NotifikasiRepository interface {
	Create(notif *models.Notifikasi) error
	FindByKlienID(klienID string) ([]models.Notifikasi, error)
	MarkAsRead(id string) error
	CountUnread(klienID string) (int64, error)
}

type notifikasiRepository struct {
	db *gorm.DB
}

func NewNotifikasiRepository(db *gorm.DB) NotifikasiRepository {
	return &notifikasiRepository{db: db}
}

func (r *notifikasiRepository) Create(notif *models.Notifikasi) error {
	return r.db.Create(notif).Error
}

func (r *notifikasiRepository) FindByKlienID(klienID string) ([]models.Notifikasi, error) {
	var notifs []models.Notifikasi
	err := r.db.Where("klien_id = ?", klienID).Order("created_at DESC").Find(&notifs).Error
	return notifs, err
}

func (r *notifikasiRepository) MarkAsRead(id string) error {
	return r.db.Model(&models.Notifikasi{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *notifikasiRepository) CountUnread(klienID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Notifikasi{}).Where("klien_id = ? AND is_read = ?", klienID, false).Count(&count).Error
	return count, err
}
