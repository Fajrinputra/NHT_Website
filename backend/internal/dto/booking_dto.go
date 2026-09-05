package dto

import "time"

// CreateBookingRequest payload untuk membuat booking baru
type CreateBookingRequest struct {
	JenisLayanan     string `json:"jenisLayanan" binding:"required,oneof=PIJAT_HAMIL PIJAT_NIFAS TERAPI_LAKTASI PIJAT_BAYI"`
	Tanggal          string `json:"tanggal" binding:"required"` // YYYY-MM-DD
	Jam              string `json:"jam" binding:"required"`
	KeluhanScreening string `json:"keluhanScreening"`
}

// BookingResponse data booking
type BookingResponse struct {
	ID               string     `json:"id"`
	KlienID          string     `json:"klienId"`
	TerapisID        *string    `json:"terapisId"`
	JenisLayanan     string     `json:"jenisLayanan"`
	Tanggal          time.Time  `json:"tanggal"`
	Jam              string     `json:"jam"`
	KeluhanScreening string     `json:"keluhanScreening"`
	Status           string     `json:"status"`
	CatatanTerapis   string     `json:"catatanTerapis"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}
