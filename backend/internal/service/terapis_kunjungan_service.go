package service

import (
	"errors"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/utils"
)

type TerapisKunjunganService interface {
	GetJadwalKunjungan(terapisID string, status string) ([]dto.TerapisKunjunganResponse, error)
	GetDetailKunjungan(terapisID string, bookingID string) (*dto.TerapisKunjunganResponse, error)
	GetRiwayatKesehatanKlien(terapisID string, klienID string) (*dto.TerapisRiwayatKesehatanKlienResponse, error)
}

type terapisKunjunganService struct {
	bookingRepo  repository.BookingRepository
	klienRepo    repository.KlienRepository
	ibuRepo      repository.IbuRepository
	anakRepo     repository.AnakRepository
}

func NewTerapisKunjunganService(
	bookingRepo repository.BookingRepository,
	klienRepo repository.KlienRepository,
	ibuRepo repository.IbuRepository,
	anakRepo repository.AnakRepository,
) TerapisKunjunganService {
	return &terapisKunjunganService{
		bookingRepo: bookingRepo,
		klienRepo:   klienRepo,
		ibuRepo:     ibuRepo,
		anakRepo:    anakRepo,
	}
}

func (s *terapisKunjunganService) GetJadwalKunjungan(terapisID string, status string) ([]dto.TerapisKunjunganResponse, error) {
	bookings, err := s.bookingRepo.FindByTerapisID(terapisID, status)
	if err != nil {
		return nil, errors.New("gagal mengambil jadwal kunjungan")
	}

	var responses []dto.TerapisKunjunganResponse
	for _, b := range bookings {
		responses = append(responses, s.toKunjunganResponse(&b))
	}

	if responses == nil {
		responses = []dto.TerapisKunjunganResponse{}
	}

	return responses, nil
}

func (s *terapisKunjunganService) GetDetailKunjungan(terapisID string, bookingID string) (*dto.TerapisKunjunganResponse, error) {
	b, err := s.bookingRepo.FindByID(bookingID)
	if err != nil {
		return nil, errors.New("booking tidak ditemukan")
	}

	if b.TerapisID == nil || *b.TerapisID != terapisID {
		return nil, errors.New("akses ditolak: ini bukan jadwal kunjungan Anda")
	}

	res := s.toKunjunganResponse(b)
	return &res, nil
}

func (s *terapisKunjunganService) GetRiwayatKesehatanKlien(terapisID string, klienID string) (*dto.TerapisRiwayatKesehatanKlienResponse, error) {
	// 1. Verifikasi Terapis memiliki booking dengan Klien ini
	bookings, err := s.bookingRepo.FindByKlienID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}

	hasAccess := false
	for _, b := range bookings {
		if b.TerapisID != nil && *b.TerapisID == terapisID {
			hasAccess = true
			break
		}
	}

	if !hasAccess {
		return nil, errors.New("akses ditolak: Anda tidak memiliki riwayat penanganan klien ini")
	}

	klien, err := s.klienRepo.FindByID(klienID)
	if err != nil {
		return nil, errors.New("klien tidak ditemukan")
	}

	res := &dto.TerapisRiwayatKesehatanKlienResponse{
		KlienID:     klien.ID,
		NamaLengkap: klien.NamaLengkap,
	}

	// Ambil data Ibu Hamil
	if ibuHamil, _ := s.ibuRepo.FindByKlienID(klienID); ibuHamil != nil {
		res.IbuHamil = ibuHamil
	}

	// Ambil semua data Anak dari SATU tabel (tidak ada BayiRepository terpisah).
	// Klasifikasikan menjadi "Bayi" (< 24 bulan) dan "Anak" (>= 24 bulan)
	// berdasarkan usia yang dihitung secara real-time dari TanggalLahir.
	if semuaAnak, _ := s.anakRepo.FindByKlienID(klienID); len(semuaAnak) > 0 {
		var daftarBayi []models.Anak
		var daftarAnak []models.Anak

		for _, a := range semuaAnak {
			usiaBulan := utils.HitungUsiaAnak(a.TanggalLahir)
			if usiaBulan < 24 {
				daftarBayi = append(daftarBayi, a)
			} else {
				daftarAnak = append(daftarAnak, a)
			}
		}

		if len(daftarBayi) > 0 {
			res.Bayi = daftarBayi
		}
		if len(daftarAnak) > 0 {
			res.Anak = daftarAnak
		}
	}

	return res, nil
}

func (s *terapisKunjunganService) toKunjunganResponse(b *models.Booking) dto.TerapisKunjunganResponse {
	return dto.TerapisKunjunganResponse{
		ID:               b.ID,
		KlienID:          b.KlienID,
		NamaKlien:        b.Klien.NamaLengkap,
		JenisLayanan:     string(b.JenisLayanan),
		Tanggal:          b.Tanggal.Format("2006-01-02"),
		Jam:              b.Jam,
		KeluhanScreening: b.KeluhanScreening,
		Status:           string(b.Status),
		CatatanTerapis:   b.CatatanTerapis,
	}
}
