package dto

// ArtikelResponse adalah data artikel untuk response API
type ArtikelResponse struct {
	ID        string `json:"id"`
	Judul     string `json:"judul"`
	Kategori  string `json:"kategori"`
	GambarURL string `json:"gambarUrl"`
	Cuplikan  string `json:"cuplikan"`
	CreatedAt string `json:"createdAt"`
}

// ArtikelDetailResponse termasuk isi konten penuh
type ArtikelDetailResponse struct {
	ArtikelResponse
	IsiKonten string `json:"isiKonten"`
}
