package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type TerapisInputHandler struct {
	terapisInputSvc service.TerapisInputService
}

func NewTerapisInputHandler(svc service.TerapisInputService) *TerapisInputHandler {
	return &TerapisInputHandler{terapisInputSvc: svc}
}

// TambahGrafikPertumbuhan godoc
// POST /api/v1/terapis/anak/:anakId/grafik-pertumbuhan
func (h *TerapisInputHandler) TambahGrafikPertumbuhan(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	anakID := c.Param("anakId")

	var req dto.TambahGrafikPertumbuhanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data yang dikirim tidak valid")
		return
	}

	if err := h.terapisInputSvc.TambahGrafikPertumbuhan(terapisID, anakID, &req); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Berhasil menambahkan data grafik pertumbuhan", nil)
}

// GetImunisasi godoc
// GET /api/v1/terapis/anak/:anakId/imunisasi
func (h *TerapisInputHandler) GetImunisasi(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	anakID := c.Param("anakId")

	data, err := h.terapisInputSvc.GetImunisasi(terapisID, anakID)
	if err != nil {
		utils.ResponseError(c, http.StatusForbidden, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengambil data imunisasi", data)
}

// UpdateImunisasi godoc
// PUT /api/v1/terapis/imunisasi/:id
func (h *TerapisInputHandler) UpdateImunisasi(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	imunisasiID := c.Param("id")

	var req dto.UpdateImunisasiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data yang dikirim tidak valid")
		return
	}

	if err := h.terapisInputSvc.UpdateImunisasi(terapisID, imunisasiID, &req); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengupdate status imunisasi", nil)
}

// TambahDenverII godoc
// POST /api/v1/terapis/anak/:anakId/denver-ii
func (h *TerapisInputHandler) TambahDenverII(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	anakID := c.Param("anakId")

	var req dto.TambahDenverIIRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data yang dikirim tidak valid")
		return
	}

	if err := h.terapisInputSvc.TambahDenverII(terapisID, anakID, &req); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Berhasil menambahkan data skrining Denver II", nil)
}

// SelesaikanKunjungan godoc
// PUT /api/v1/terapis/booking/:id/selesai
func (h *TerapisInputHandler) SelesaikanKunjungan(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	bookingID := c.Param("id")

	var req dto.SelesaikanKunjunganRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data yang dikirim tidak valid")
		return
	}

	if err := h.terapisInputSvc.SelesaikanKunjungan(terapisID, bookingID, &req); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Kunjungan berhasil ditandai selesai", nil)
}

// TandaiRujukan godoc
// PUT /api/v1/terapis/booking/:id/rujukan
func (h *TerapisInputHandler) TandaiRujukan(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	bookingID := c.Param("id")

	var req dto.TandaiRujukanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data yang dikirim tidak valid")
		return
	}

	if err := h.terapisInputSvc.TandaiRujukan(terapisID, bookingID, &req); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil menandai kunjungan sebagai rujukan", nil)
}

// GetProfilTerapis godoc
// GET /api/v1/terapis/profil
func (h *TerapisInputHandler) GetProfilTerapis(c *gin.Context) {
	terapisID := c.GetString("terapisId")

	res, err := h.terapisInputSvc.GetProfilTerapis(terapisID)
	if err != nil {
		utils.ResponseError(c, http.StatusForbidden, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengambil profil terapis", res)
}

// GantiKataSandi godoc
// PUT /api/v1/terapis/profil/kata-sandi
func (h *TerapisInputHandler) GantiKataSandi(c *gin.Context) {
	terapisID := c.GetString("terapisId")

	var req dto.GantiKataSandiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data yang dikirim tidak valid (minimal 6 karakter)")
		return
	}

	if err := h.terapisInputSvc.GantiKataSandi(terapisID, &req); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengubah kata sandi", nil)
}
