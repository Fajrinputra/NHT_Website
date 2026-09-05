package models

import "time"

type Ibu struct {
	ID                string     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	KlienID           string     `gorm:"type:uuid;uniqueIndex;not null" json:"klienId"`
	Nama              string     `gorm:"not null" json:"nama"`
	TanggalLahir      *time.Time `json:"tanggalLahir"`
	HPHT              *time.Time `json:"hpht"`
	BeratSebelumHamil *float64   `json:"beratSebelumHamil"`
	TinggiBadan       *float64   `json:"tinggiBadan"`
	UpdatedAt         time.Time  `json:"updatedAt"`

	Klien Klien `gorm:"foreignKey:KlienID" json:"-"`
}
