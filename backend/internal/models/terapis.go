package models

type Terapis struct {
	ID           string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Nama         string `gorm:"not null" json:"nama"`
	NomorTelepon string `json:"nomorTelepon"`
	Aktif        bool   `gorm:"default:true" json:"aktif"`
}
