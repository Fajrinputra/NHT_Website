package models

import "time"

type KategoriArtikel string

const (
	KategoriIbuHamil KategoriArtikel = "IBU_HAMIL"
	KategoriBayi     KategoriArtikel = "BAYI"
	KategoriAnak     KategoriArtikel = "ANAK"
)

type Artikel struct {
	ID         string          `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Judul      string          `gorm:"not null" json:"judul"`
	Kategori   KategoriArtikel `gorm:"type:varchar(20);not null" json:"kategori"`
	GambarURL  string          `json:"gambarUrl"`
	Cuplikan   string          `gorm:"type:text" json:"cuplikan"`
	IsiKonten  string          `gorm:"type:text" json:"isiKonten"`
	CreatedAt  time.Time       `json:"createdAt"`
}
