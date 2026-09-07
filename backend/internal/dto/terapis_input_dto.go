package dto

type TambahGrafikPertumbuhanRequest struct {
	TanggalUkur  string   `json:"tanggalUkur" binding:"required"` // YYYY-MM-DD
	BeratBadan   *float64 `json:"beratBadan"`
	PanjangBadan *float64 `json:"panjangBadan"`
	LingkarKepala *float64 `json:"lingkarKepala"`
	Status       string   `json:"status"`
}

type UpdateImunisasiRequest struct {
	Status           string  `json:"status" binding:"required,oneof=SUDAH BELUM TERLAMBAT"`
	TanggalPemberian *string `json:"tanggalPemberian"` // YYYY-MM-DD, opsional
}

type TambahDenverIIRequest struct {
	MotorikKasar   string `json:"motorikKasar" binding:"required,oneof=SESUAI_USIA PERLU_PERHATIAN"`
	MotorikHalus   string `json:"motorikHalus" binding:"required,oneof=SESUAI_USIA PERLU_PERHATIAN"`
	Bahasa         string `json:"bahasa" binding:"required,oneof=SESUAI_USIA PERLU_PERHATIAN"`
	PersonalSosial string `json:"personalSosial" binding:"required,oneof=SESUAI_USIA PERLU_PERHATIAN"`
}

type SelesaikanKunjunganRequest struct {
	CatatanTerapis string `json:"catatanTerapis"`
}

type TandaiRujukanRequest struct {
	CatatanRujukan string `json:"catatanRujukan" binding:"required"`
}

type GantiKataSandiRequest struct {
	KataSandiBaru string `json:"kataSandiBaru" binding:"required,min=6"`
}
