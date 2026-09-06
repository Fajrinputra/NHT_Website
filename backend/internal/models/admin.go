package models

import "time"

type Admin struct {
	ID            string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Nama          string    `gorm:"not null" json:"nama"`
	Email         string    `gorm:"unique;not null" json:"email"`
	KataSandiHash string    `gorm:"not null" json:"-"`
	CreatedAt     time.Time `json:"createdAt"`
}
