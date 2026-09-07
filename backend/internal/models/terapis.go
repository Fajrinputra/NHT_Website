package models

type Terapis struct {
	ID           string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Nama         string `gorm:"not null" json:"nama"`
	NomorTelepon  string `json:"nomorTelepon"`
	KataSandiHash string `json:"-"`
	Aktif         bool   `gorm:"default:true" json:"aktif"`
}
