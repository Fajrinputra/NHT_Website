package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type TerapisKunjunganHandler struct {
	terapisKunjunganSvc service.TerapisKunjunganService
}

func NewTerapisKunjunganHandler(svc service.TerapisKunjunganService) *TerapisKunjunganHandler {
	return &TerapisKunjunganHandler{terapisKunjunganSvc: svc}
}

// GetJadwalKunjungan godoc
// GET /api/v1/terapis/jadwal-kunjungan
func (h *TerapisKunjunganHandler) GetJadwalKunjungan(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	status := c.Query("status")

	res, err := h.terapisKunjunganSvc.GetJadwalKunjungan(terapisID, status)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengambil jadwal kunjungan", res)
}

// GetDetailKunjungan godoc
// GET /api/v1/terapis/booking/:id
func (h *TerapisKunjunganHandler) GetDetailKunjungan(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	bookingID := c.Param("id")

	res, err := h.terapisKunjunganSvc.GetDetailKunjungan(terapisID, bookingID)
	if err != nil {
		utils.ResponseError(c, http.StatusForbidden, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengambil detail kunjungan", res)
}

// GetRiwayatKesehatanKlien godoc
// GET /api/v1/terapis/klien/:klienId/riwayat-kesehatan
func (h *TerapisKunjunganHandler) GetRiwayatKesehatanKlien(c *gin.Context) {
	terapisID := c.GetString("terapisId")
	klienID := c.Param("klienId")

	res, err := h.terapisKunjunganSvc.GetRiwayatKesehatanKlien(terapisID, klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusForbidden, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Berhasil mengambil riwayat kesehatan klien", res)
}
