package models

import "time"

type JadwalTersedia struct {
	ID        string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Tanggal   time.Time `gorm:"not null" json:"tanggal"`
	Jam       string    `gorm:"not null" json:"jam"`
	Tersedia  bool      `gorm:"default:true" json:"tersedia"`
}
