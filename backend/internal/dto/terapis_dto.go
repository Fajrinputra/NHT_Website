package dto

type TerapisResponse struct {
	ID                 string `json:"id"`
	Nama               string `json:"nama"`
	NomorTelepon       string `json:"nomorTelepon"`
	Aktif              bool   `json:"aktif"`
	KataSandiGenerated string `json:"kataSandiGenerated,omitempty"`
}

type CreateTerapisRequest struct {
	Nama         string `json:"nama" binding:"required"`
	NomorTelepon string `json:"nomorTelepon" binding:"required"`
	KataSandi    string `json:"kataSandi"`
}

type UpdateTerapisRequest struct {
	Nama         string `json:"nama" binding:"required"`
	NomorTelepon string `json:"nomorTelepon" binding:"required"`
	Aktif        *bool  `json:"aktif" binding:"required"`
}
