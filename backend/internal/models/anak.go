package models

import "time"

type JenisKelamin string

const (
	JenisKelaminLakiLaki  JenisKelamin = "LAKI_LAKI"
	JenisKelaminPerempuan JenisKelamin = "PEREMPUAN"
)

type Anak struct {
	ID                  string       `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	KlienID             string       `gorm:"type:uuid;not null;index" json:"klienId"`
	Nama                string       `gorm:"not null" json:"nama"`
	TanggalLahir        time.Time    `gorm:"not null" json:"tanggalLahir"`
	JenisKelamin        JenisKelamin `gorm:"type:varchar(20);not null" json:"jenisKelamin"`
	BeratLahir          *float64     `json:"beratLahir"`
	PanjangLahir        *float64     `json:"panjangLahir"`
	LingkarKepalaLahir  *float64     `json:"lingkarKepalaLahir"`
	CreatedAt           time.Time    `json:"createdAt"`

	Klien Klien `gorm:"foreignKey:KlienID" json:"-"`
}
