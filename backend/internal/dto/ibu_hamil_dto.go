package dto

import "time"

// UpdateIbuHamilRequest adalah payload untuk menyimpan data kehamilan
type UpdateIbuHamilRequest struct {
	HPHT              string  `json:"hpht" binding:"required"`      // format: YYYY-MM-DD
	BeratSebelumHamil float64 `json:"beratSebelumHamil" binding:"required,gt=0"`
	TinggiBadan       float64 `json:"tinggiBadan" binding:"required,gt=0"`
}

// IbuHamilResponse adalah respons gabungan data + hasil kalkulasi
type IbuHamilResponse struct {
	ID                  string     `json:"id"`
	KlienID             string     `json:"klienId"`
	Nama                string     `json:"nama"`
	TanggalLahir        *time.Time `json:"tanggalLahir"`
	HPHT                *time.Time `json:"hpht"`
	BeratSebelumHamil   *float64   `json:"beratSebelumHamil"`
	TinggiBadan         *float64   `json:"tinggiBadan"`
	UpdatedAt           time.Time  `json:"updatedAt"`
	// Hasil kalkulasi (nil jika HPHT belum diisi)
	UsiaKandunganMinggu *int    `json:"usiaKandunganMinggu"`
	Trimester           *int    `json:"trimester"`
	HPL                 *string `json:"hpl"`
	IMT                 *float64 `json:"imt"`
	KategoriIMT         *string `json:"kategoriImt"`
	RekomendasiKenaikanBB *string `json:"rekomendasiKenaikanBb"`
}
