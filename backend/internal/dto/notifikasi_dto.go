package dto

type NotifikasiResponse struct {
	ID        string `json:"id"`
	Judul     string `json:"judul"`
	Pesan     string `json:"pesan"`
	Tipe      string `json:"tipe"`
	IsRead    bool   `json:"isRead"`
	CreatedAt string `json:"createdAt"`
}
