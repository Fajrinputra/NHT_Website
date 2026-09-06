package dto

type AdminUpdateBookingRequest struct {
	TerapisID      *string `json:"terapisId"`
	Status         string  `json:"status" binding:"required,oneof=MENUNGGU_KONFIRMASI DIKONFIRMASI DITOLAK SELESAI DIBATALKAN"`
	CatatanTerapis string  `json:"catatanTerapis"`
}

type AdminBookingResponse struct {
	ID               string  `json:"id"`
	KlienID          string  `json:"klienId"`
	NamaKlien        string  `json:"namaKlien"`
	TerapisID        *string `json:"terapisId"`
	NamaTerapis      string  `json:"namaTerapis"`
	JenisLayanan     string  `json:"jenisLayanan"`
	Tanggal          string  `json:"tanggal"`
	Jam              string  `json:"jam"`
	KeluhanScreening string  `json:"keluhanScreening"`
	Status           string  `json:"status"`
	CatatanTerapis   string  `json:"catatanTerapis"`
	CreatedAt        string  `json:"createdAt"`
}
