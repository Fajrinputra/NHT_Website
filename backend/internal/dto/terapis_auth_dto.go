package dto

type TerapisLoginRequest struct {
	NomorTelepon string `json:"nomorTelepon" binding:"required"`
	KataSandi    string `json:"kataSandi" binding:"required"`
}

type TerapisLoginResponse struct {
	Token   string          `json:"token"`
	Terapis TerapisResponse `json:"terapis"`
}
