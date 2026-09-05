package dto

type KeluargaResponse struct {
	Peran        string `json:"peran"` // "Ibu", "Suami", "Anak"
	Nama         string `json:"nama"`
	TanggalLahir string `json:"tanggalLahir,omitempty"` // untuk Anak
}

type ProfilResponse struct {
	KlienID      string             `json:"klienId"`
	NomorTelepon string             `json:"nomorTelepon"`
	Keluarga     []KeluargaResponse `json:"keluarga"`
}

type UpdateProfilRequest struct {
	NomorTelepon string             `json:"nomorTelepon"`
	Keluarga     []KeluargaResponse `json:"keluarga"` // Sederhana: kita ambil 'Ibu', 'Suami', lalu selebihnya 'Anak'
}
