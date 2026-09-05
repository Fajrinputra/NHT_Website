package models

type Suami struct {
	ID           string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	KlienID      string `gorm:"type:uuid;uniqueIndex;not null" json:"klienId"`
	Nama         string `gorm:"not null" json:"nama"`
	NomorTelepon string `json:"nomorTelepon"`

	Klien Klien `gorm:"foreignKey:KlienID" json:"-"`
}
