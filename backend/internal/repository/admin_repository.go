package repository

import (
	"github.com/nata-house/backend/internal/database"
	"github.com/nata-house/backend/internal/models"
)

type AdminRepository interface {
	FindByEmail(email string) (*models.Admin, error)
}

type adminRepository struct{}

func NewAdminRepository() AdminRepository {
	return &adminRepository{}
}

func (r *adminRepository) FindByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	if err := database.DB.Where("email = ?", email).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}
