package dto

import "time"

// CreateCatatanHarianRequest payload membuat catatan harian
type CreateCatatanHarianRequest struct {
	Konteks    string  `json:"konteks" binding:"required,oneof=IBU_HAMIL BAYI ANAK"`
	AnakID     *string `json:"anakId"`
	Tanggal    string  `json:"tanggal" binding:"required"` // YYYY-MM-DD
	IsiCatatan string  `json:"isiCatatan" binding:"required"`
}

// CatatanHarianResponse data catatan harian
type CatatanHarianResponse struct {
	ID         string     `json:"id"`
	KlienID    string     `json:"klienId"`
	Konteks    string     `json:"konteks"`
	AnakID     *string    `json:"anakId"`
	Tanggal    time.Time  `json:"tanggal"`
	IsiCatatan string     `json:"isiCatatan"`
	CreatedAt  time.Time  `json:"createdAt"`
}
