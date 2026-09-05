package utils

import (
	"math"
	"time"
)

// HitungUsiaKehamilan menghitung usia kehamilan dalam minggu dari HPHT
func HitungUsiaKehamilan(hpht time.Time) int {
	now := time.Now()
	diff := now.Sub(hpht)
	weeks := int(diff.Hours() / (24 * 7))
	return weeks
}

// HitungTrimester menentukan trimester berdasarkan usia kehamilan dalam minggu
func HitungTrimester(minggu int) int {
	switch {
	case minggu < 13:
		return 1
	case minggu < 28:
		return 2
	default:
		return 3
	}
}

// HitungHPL menghitung Hari Perkiraan Lahir (HPHT + 280 hari)
func HitungHPL(hpht time.Time) time.Time {
	return hpht.AddDate(0, 0, 280)
}

// HitungIMT menghitung Indeks Massa Tubuh
func HitungIMT(beratKg, tinggiCm float64) float64 {
	if tinggiCm == 0 {
		return 0
	}
	tinggiM := tinggiCm / 100
	imt := beratKg / (tinggiM * tinggiM)
	return math.Round(imt*10) / 10
}

// KategoriIMT mengembalikan kategori IMT dan rekomendasi kenaikan BB (IOM 2009)
type HasilIMT struct {
	Kategori           string
	RekomendasiKenaikan string
}

func KategoriIMT(imt float64) HasilIMT {
	switch {
	case imt < 18.5:
		return HasilIMT{Kategori: "Kurus", RekomendasiKenaikan: "12,5–18 kg"}
	case imt < 25.0:
		return HasilIMT{Kategori: "Normal", RekomendasiKenaikan: "11,5–16 kg"}
	case imt < 30.0:
		return HasilIMT{Kategori: "Gemuk", RekomendasiKenaikan: "7–11,5 kg"}
	default:
		return HasilIMT{Kategori: "Obesitas", RekomendasiKenaikan: "5–9 kg"}
	}
}

// HitungUsiaAnak menghitung usia anak dalam bulan dari tanggal lahir
func HitungUsiaAnak(tanggalLahir time.Time) int {
	now := time.Now()
	years := now.Year() - tanggalLahir.Year()
	months := int(now.Month()) - int(tanggalLahir.Month())
	total := years*12 + months
	if now.Day() < tanggalLahir.Day() {
		total--
	}
	if total < 0 {
		return 0
	}
	return total
}
