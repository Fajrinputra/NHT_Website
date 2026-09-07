package service

import (
	"errors"
	"time"

	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
	"github.com/nata-house/backend/internal/repository"
	"github.com/nata-house/backend/internal/utils"
)

type TerapisInputService interface {
	TambahGrafikPertumbuhan(terapisID, anakID string, req *dto.TambahGrafikPertumbuhanRequest) error
	UpdateImunisasi(terapisID, imunisasiID string, req *dto.UpdateImunisasiRequest) error
	TambahDenverII(terapisID, anakID string, req *dto.TambahDenverIIRequest) error
	SelesaikanKunjungan(terapisID, bookingID string, req *dto.SelesaikanKunjunganRequest) error
	TandaiRujukan(terapisID, bookingID string, req *dto.TandaiRujukanRequest) error
	GetProfilTerapis(terapisID string) (*dto.TerapisResponse, error)
	GantiKataSandi(terapisID string, req *dto.GantiKataSandiRequest) error
}

type terapisInputService struct {
	terapisRepo         repository.TerapisRepository
	bookingRepo         repository.BookingRepository
	anakRepo            repository.AnakRepository
	grafikRepo          repository.GrafikPertumbuhanRepository
	imunisasiRepo       repository.CatatanImunisasiRepository
	denverRepo          repository.HasilDenverIIRepository
}

func NewTerapisInputService(
	terapisRepo repository.TerapisRepository,
	bookingRepo repository.BookingRepository,
	anakRepo repository.AnakRepository,
	grafikRepo repository.GrafikPertumbuhanRepository,
	imunisasiRepo repository.CatatanImunisasiRepository,
	denverRepo repository.HasilDenverIIRepository,
) TerapisInputService {
	return &terapisInputService{
		terapisRepo:   terapisRepo,
		bookingRepo:   bookingRepo,
		anakRepo:      anakRepo,
		grafikRepo:    grafikRepo,
		imunisasiRepo: imunisasiRepo,
		denverRepo:    denverRepo,
	}
}

// Helper untuk memastikan terapis menangani anak ini
func (s *terapisInputService) verifikasiAksesAnak(terapisID, anakID string) error {
	anak, err := s.anakRepo.FindByID(anakID)
	if err != nil {
		return errors.New("anak tidak ditemukan")
	}

	bookings, err := s.bookingRepo.FindByKlienID(anak.KlienID)
	if err != nil {
		return errors.New("gagal memverifikasi akses")
	}

	for _, b := range bookings {
		if b.TerapisID != nil && *b.TerapisID == terapisID {
			return nil
		}
	}

	return errors.New("akses ditolak: Anda tidak memiliki jadwal penanganan untuk klien ini")
}

func (s *terapisInputService) TambahGrafikPertumbuhan(terapisID, anakID string, req *dto.TambahGrafikPertumbuhanRequest) error {
	if err := s.verifikasiAksesAnak(terapisID, anakID); err != nil {
		return err
	}

	terapis, err := s.terapisRepo.FindByID(terapisID)
	if err != nil {
		return errors.New("terapis tidak ditemukan")
	}

	tanggalUkur, err := time.Parse("2006-01-02", req.TanggalUkur)
	if err != nil {
		return errors.New("format tanggal ukur tidak valid (YYYY-MM-DD)")
	}

	gp := &models.GrafikPertumbuhan{
		AnakID:       anakID,
		TanggalUkur:  tanggalUkur,
		BeratBadan:   req.BeratBadan,
		PanjangBadan: req.PanjangBadan,
		LingkarKepala: req.LingkarKepala,
		Status:       req.Status,
		DiisiOleh:    terapis.Nama,
	}

	return s.grafikRepo.Create(gp)
}

func (s *terapisInputService) UpdateImunisasi(terapisID, imunisasiID string, req *dto.UpdateImunisasiRequest) error {
	imunisasi, err := s.imunisasiRepo.FindByID(imunisasiID)
	if err != nil {
		return errors.New("data imunisasi tidak ditemukan")
	}

	if err := s.verifikasiAksesAnak(terapisID, imunisasi.AnakID); err != nil {
		return err
	}

	imunisasi.Status = models.StatusImunisasi(req.Status)
	if req.TanggalPemberian != nil && *req.TanggalPemberian != "" {
		t, err := time.Parse("2006-01-02", *req.TanggalPemberian)
		if err == nil {
			imunisasi.TanggalPemberian = &t
		}
	} else {
		imunisasi.TanggalPemberian = nil
	}

	return s.imunisasiRepo.Update(imunisasi)
}

func (s *terapisInputService) TambahDenverII(terapisID, anakID string, req *dto.TambahDenverIIRequest) error {
	if err := s.verifikasiAksesAnak(terapisID, anakID); err != nil {
		return err
	}

	terapis, err := s.terapisRepo.FindByID(terapisID)
	if err != nil {
		return errors.New("terapis tidak ditemukan")
	}

	denver := &models.HasilDenverII{
		AnakID:          anakID,
		TanggalSkrining: time.Now(),
		DiisiOleh:       terapis.Nama,
		MotorikKasar:    models.HasilDenver(req.MotorikKasar),
		MotorikHalus:    models.HasilDenver(req.MotorikHalus),
		Bahasa:          models.HasilDenver(req.Bahasa),
		PersonalSosial:  models.HasilDenver(req.PersonalSosial),
	}

	return s.denverRepo.Create(denver)
}

func (s *terapisInputService) SelesaikanKunjungan(terapisID, bookingID string, req *dto.SelesaikanKunjunganRequest) error {
	b, err := s.bookingRepo.FindByID(bookingID)
	if err != nil {
		return errors.New("booking tidak ditemukan")
	}

	if b.TerapisID == nil || *b.TerapisID != terapisID {
		return errors.New("akses ditolak: ini bukan jadwal kunjungan Anda")
	}

	b.Status = models.StatusBookingSelesai
	b.CatatanTerapis = req.CatatanTerapis

	return s.bookingRepo.Update(b)
}

func (s *terapisInputService) TandaiRujukan(terapisID, bookingID string, req *dto.TandaiRujukanRequest) error {
	b, err := s.bookingRepo.FindByID(bookingID)
	if err != nil {
		return errors.New("booking tidak ditemukan")
	}

	if b.TerapisID == nil || *b.TerapisID != terapisID {
		return errors.New("akses ditolak: ini bukan jadwal kunjungan Anda")
	}

	b.PerluRujukan = true
	b.CatatanRujukan = req.CatatanRujukan

	return s.bookingRepo.Update(b)
}

func (s *terapisInputService) GetProfilTerapis(terapisID string) (*dto.TerapisResponse, error) {
	terapis, err := s.terapisRepo.FindByID(terapisID)
	if err != nil {
		return nil, errors.New("terapis tidak ditemukan")
	}

	return &dto.TerapisResponse{
		ID:           terapis.ID,
		Nama:         terapis.Nama,
		NomorTelepon: terapis.NomorTelepon,
		Aktif:        terapis.Aktif,
	}, nil
}

func (s *terapisInputService) GantiKataSandi(terapisID string, req *dto.GantiKataSandiRequest) error {
	terapis, err := s.terapisRepo.FindByID(terapisID)
	if err != nil {
		return errors.New("terapis tidak ditemukan")
	}

	hashedPassword, err := utils.HashPassword(req.KataSandiBaru)
	if err != nil {
		return errors.New("gagal mengenkripsi kata sandi baru")
	}

	terapis.KataSandiHash = hashedPassword
	return s.terapisRepo.Update(terapis)
}
