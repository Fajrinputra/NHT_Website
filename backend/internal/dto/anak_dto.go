package dto

import "time"

// CreateAnakRequest payload untuk menambah data anak
type CreateAnakRequest struct {
	Nama               string  `json:"nama" binding:"required"`
	TanggalLahir       string  `json:"tanggalLahir" binding:"required"` // YYYY-MM-DD
	JenisKelamin       string  `json:"jenisKelamin" binding:"required,oneof=LAKI_LAKI PEREMPUAN"`
	BeratLahir         float64 `json:"beratLahir"`
	PanjangLahir       float64 `json:"panjangLahir"`
	LingkarKepalaLahir float64 `json:"lingkarKepalaLahir"`
}

// AnakResponse data anak dengan usia terhitung
type AnakResponse struct {
	ID                 string     `json:"id"`
	KlienID            string     `json:"klienId"`
	Nama               string     `json:"nama"`
	TanggalLahir       time.Time  `json:"tanggalLahir"`
	JenisKelamin       string     `json:"jenisKelamin"`
	BeratLahir         *float64   `json:"beratLahir"`
	PanjangLahir       *float64   `json:"panjangLahir"`
	LingkarKepalaLahir *float64   `json:"lingkarKepalaLahir"`
	UsiaBulan          int        `json:"usiaBulan"`
	TipeAnak           string     `json:"tipeAnak"` // "BAYI" (<= 12 bln) atau "ANAK" (> 12 bln)
	CreatedAt          time.Time  `json:"createdAt"`
}
