package dto

type TerapisKunjunganResponse struct {
	ID               string `json:"id"`
	KlienID          string `json:"klienId"`
	NamaKlien        string `json:"namaKlien"`
	JenisLayanan     string `json:"jenisLayanan"`
	Tanggal          string `json:"tanggal"`
	Jam              string `json:"jam"`
	KeluhanScreening string `json:"keluhanScreening"`
	Status           string `json:"status"`
	CatatanTerapis   string `json:"catatanTerapis"`
}

type TerapisRiwayatKesehatanKlienResponse struct {
	KlienID     string      `json:"klienId"`
	NamaLengkap string      `json:"namaLengkap"`
	IbuHamil    interface{} `json:"ibuHamil,omitempty"`
	Bayi        interface{} `json:"bayi,omitempty"`
	Anak        interface{} `json:"anak,omitempty"`
}
