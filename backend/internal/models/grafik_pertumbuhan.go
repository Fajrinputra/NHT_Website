package models

import "time"

type GrafikPertumbuhan struct {
	ID           string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AnakID       string    `gorm:"type:uuid;not null;index" json:"anakId"`
	TanggalUkur  time.Time `gorm:"not null" json:"tanggalUkur"`
	BeratBadan   *float64  `json:"beratBadan"`
	PanjangBadan *float64  `json:"panjangBadan"`
	LingkarKepala *float64 `json:"lingkarKepala"`
	Status       string    `json:"status"`
	DiisiOleh    string    `json:"diisiOleh"`
	CreatedAt    time.Time `json:"createdAt"`

	Anak Anak `gorm:"foreignKey:AnakID" json:"-"`
}
