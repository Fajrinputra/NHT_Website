package models

import "time"

type StatusImunisasi string

const (
	StatusImunisasiSudah    StatusImunisasi = "SUDAH"
	StatusImunisasiBelum    StatusImunisasi = "BELUM"
	StatusImunisasiTerlambat StatusImunisasi = "TERLAMBAT"
)

type CatatanImunisasi struct {
	ID                  string          `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AnakID              string          `gorm:"type:uuid;not null;index" json:"anakId"`
	NamaVaksin          string          `gorm:"not null" json:"namaVaksin"`
	UsiaRekomendasi     string          `json:"usiaRekomendasi"`
	Status              StatusImunisasi `gorm:"type:varchar(20);not null;default:'BELUM'" json:"status"`
	TanggalPemberian    *time.Time      `json:"tanggalPemberian"`
	KeteranganManfaat   string          `json:"keteranganManfaat"`

	Anak Anak `gorm:"foreignKey:AnakID" json:"-"`
}
