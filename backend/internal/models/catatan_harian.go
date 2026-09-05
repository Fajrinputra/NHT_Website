package models

import "time"

type KonteksCatatan string

const (
	KonteksIbuHamil KonteksCatatan = "IBU_HAMIL"
	KonteksBayi     KonteksCatatan = "BAYI"
	KonteksAnak     KonteksCatatan = "ANAK"
)

type CatatanHarian struct {
	ID          string         `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	KlienID     string         `gorm:"type:uuid;not null;index" json:"klienId"`
	Konteks     KonteksCatatan `gorm:"type:varchar(20);not null" json:"konteks"`
	AnakID      *string        `gorm:"type:uuid" json:"anakId"`
	Tanggal     time.Time      `gorm:"not null" json:"tanggal"`
	IsiCatatan  string         `gorm:"not null;type:text" json:"isiCatatan"`
	CreatedAt   time.Time      `json:"createdAt"`

	Klien Klien `gorm:"foreignKey:KlienID" json:"-"`
	Anak  *Anak `gorm:"foreignKey:AnakID" json:"-"`
}
