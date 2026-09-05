package models

import "time"

type JenisLayanan string
type StatusBooking string

const (
	JenisLayananPijatHamil   JenisLayanan = "PIJAT_HAMIL"
	JenisLayananPijatNifas   JenisLayanan = "PIJAT_NIFAS"
	JenisLayananTerapiLaktasi JenisLayanan = "TERAPI_LAKTASI"
	JenisLayananPijatBayi    JenisLayanan = "PIJAT_BAYI"

	StatusBookingMenungguKonfirmasi StatusBooking = "MENUNGGU_KONFIRMASI"
	StatusBookingDikonfirmasi       StatusBooking = "DIKONFIRMASI"
	StatusBookingDitolak            StatusBooking = "DITOLAK"
	StatusBookingSelesai            StatusBooking = "SELESAI"
	StatusBookingDibatalkan         StatusBooking = "DIBATALKAN"
)

type Booking struct {
	ID               string        `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	KlienID          string        `gorm:"type:uuid;not null;index" json:"klienId"`
	TerapisID        *string       `gorm:"type:uuid" json:"terapisId"`
	JenisLayanan     JenisLayanan  `gorm:"type:varchar(30);not null" json:"jenisLayanan"`
	Tanggal          time.Time     `gorm:"not null" json:"tanggal"`
	Jam              string        `gorm:"not null" json:"jam"`
	KeluhanScreening string        `gorm:"type:text" json:"keluhanScreening"`
	Status           StatusBooking `gorm:"type:varchar(30);not null;default:'MENUNGGU_KONFIRMASI'" json:"status"`
	CatatanTerapis   string        `gorm:"type:text" json:"catatanTerapis"`
	CreatedAt        time.Time     `json:"createdAt"`
	UpdatedAt        time.Time     `json:"updatedAt"`

	Klien   Klien    `gorm:"foreignKey:KlienID" json:"-"`
	Terapis *Terapis `gorm:"foreignKey:TerapisID" json:"-"`
}
