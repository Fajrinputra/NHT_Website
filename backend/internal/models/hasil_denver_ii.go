package models

import "time"

type HasilDenver string

const (
	HasilDenverSesuaiUsia    HasilDenver = "SESUAI_USIA"
	HasilDenverPerluPerhatian HasilDenver = "PERLU_PERHATIAN"
)

type HasilDenverII struct {
	ID              string      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AnakID          string      `gorm:"type:uuid;not null;index" json:"anakId"`
	TanggalSkrining time.Time   `gorm:"not null" json:"tanggalSkrining"`
	DiisiOleh       string      `json:"diisiOleh"`
	MotorikKasar    HasilDenver `gorm:"type:varchar(25)" json:"motorikKasar"`
	MotorikHalus    HasilDenver `gorm:"type:varchar(25)" json:"motorikHalus"`
	Bahasa          HasilDenver `gorm:"type:varchar(25)" json:"bahasa"`
	PersonalSosial  HasilDenver `gorm:"type:varchar(25)" json:"personalSosial"`

	Anak Anak `gorm:"foreignKey:AnakID" json:"-"`
}
