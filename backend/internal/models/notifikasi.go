package models

import "time"

type Notifikasi struct {
	ID          string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	KlienID     string    `gorm:"type:uuid;not null;index" json:"klienId"`
	Judul       string    `gorm:"not null" json:"judul"`
	Pesan       string    `gorm:"type:text;not null" json:"pesan"`
	SudahDibaca bool      `gorm:"default:false" json:"sudahDibaca"`
	CreatedAt   time.Time `json:"createdAt"`

	Klien Klien `gorm:"foreignKey:KlienID" json:"-"`
}
