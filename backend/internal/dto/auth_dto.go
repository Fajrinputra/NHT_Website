package dto

// RegisterRequest adalah payload untuk registrasi akun baru
type RegisterRequest struct {
	NamaLengkap  string `json:"namaLengkap" binding:"required,min=2"`
	NomorTelepon string `json:"nomorTelepon" binding:"required,min=10,max=15"`
	KataSandi    string `json:"kataSandi" binding:"required,min=8"`
	KonfirmasiKataSandi string `json:"konfirmasiKataSandi" binding:"required"`
}

// LoginRequest adalah payload untuk login
type LoginRequest struct {
	NomorTelepon string `json:"nomorTelepon" binding:"required"`
	KataSandi    string `json:"kataSandi" binding:"required"`
}

// ChangePasswordRequest adalah payload untuk ganti kata sandi
type ChangePasswordRequest struct {
	KataSandiLama string `json:"kataSandiLama" binding:"required"`
	KataSandiBaru string `json:"kataSandiBaru" binding:"required,min=8"`
}

// KlienResponse adalah data klien yang aman dikembalikan ke client (tanpa hash)
type KlienResponse struct {
	ID               string `json:"id"`
	NamaLengkap      string `json:"namaLengkap"`
	NomorTelepon     string `json:"nomorTelepon"`
	StatusVerifikasi string `json:"statusVerifikasi"`
	CreatedAt        string `json:"createdAt"`
}

// LoginResponse berisi token dan data klien
type LoginResponse struct {
	Token string        `json:"token"`
	Klien KlienResponse `json:"klien"`
}

// StatusResponse berisi hanya status verifikasi
type StatusResponse struct {
	StatusVerifikasi string `json:"statusVerifikasi"`
}
