package dto

type CreateJadwalRequest struct {
	Tanggal string `json:"tanggal" binding:"required"` // Format YYYY-MM-DD
	Jam     string `json:"jam" binding:"required"`     // Format HH:MM
}

type ToggleJadwalRequest struct {
	Tersedia bool `json:"tersedia"`
}

// JadwalAdminResponse includes ID for toggling
type JadwalAdminResponse struct {
	ID       string `json:"id"`
	Tanggal  string `json:"tanggal"`
	Jam      string `json:"jam"`
	Tersedia bool   `json:"tersedia"`
}
