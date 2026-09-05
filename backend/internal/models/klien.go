package models

import (
	"time"
)

type StatusVerifikasi string

const (
	StatusMenunggu StatusVerifikasi = "MENUNGGU"
	StatusAktif    StatusVerifikasi = "AKTIF"
	StatusDitolak  StatusVerifikasi = "DITOLAK"
)

type Klien struct {
	ID                string           `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	NamaLengkap       string           `gorm:"not null" json:"namaLengkap"`
	NomorTelepon      string           `gorm:"uniqueIndex;not null" json:"nomorTelepon"`
	KataSandiHash     string           `gorm:"not null" json:"-"`
	StatusVerifikasi  StatusVerifikasi `gorm:"type:varchar(20);not null;default:'MENUNGGU'" json:"statusVerifikasi"`
	CreatedAt         time.Time        `json:"createdAt"`
}
