package dto

type KlienListResponse struct {
	ID               string `json:"id"`
	NamaLengkap      string `json:"namaLengkap"`
	NomorTelepon     string `json:"nomorTelepon"`
	StatusVerifikasi string `json:"statusVerifikasi"`
	CreatedAt        string `json:"createdAt"`
}

type UpdateVerifikasiRequest struct {
	Status string `json:"status" binding:"required,oneof=AKTIF DITOLAK"`
}
