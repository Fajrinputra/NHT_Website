package dto

type CreateArtikelRequest struct {
	Judul     string `json:"judul" binding:"required"`
	Kategori  string `json:"kategori" binding:"required,oneof=IBU_HAMIL BAYI ANAK"`
	Cuplikan  string `json:"cuplikan" binding:"required"`
	IsiKonten string `json:"isiKonten" binding:"required"`
	GambarURL string `json:"gambarUrl"`
}

type UpdateArtikelRequest struct {
	Judul     string `json:"judul" binding:"required"`
	Kategori  string `json:"kategori" binding:"required,oneof=IBU_HAMIL BAYI ANAK"`
	Cuplikan  string `json:"cuplikan" binding:"required"`
	IsiKonten string `json:"isiKonten" binding:"required"`
	GambarURL string `json:"gambarUrl"`
}
