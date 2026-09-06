package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type AdminKlienHandler struct {
	adminKlienService service.AdminKlienService
}

func NewAdminKlienHandler(adminKlienService service.AdminKlienService) *AdminKlienHandler {
	return &AdminKlienHandler{adminKlienService: adminKlienService}
}

// GetKliens godoc
// GET /api/v1/admin/klien?status=MENUNGGU
func (h *AdminKlienHandler) GetKliens(c *gin.Context) {
	status := c.Query("status")
	kliens, err := h.adminKlienService.GetKliens(status)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, "Gagal mengambil daftar klien")
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Daftar klien berhasil diambil", kliens)
}

// GetKlienDetail godoc
// GET /api/v1/admin/klien/:id
func (h *AdminKlienHandler) GetKlienDetail(c *gin.Context) {
	klienID := c.Param("id")
	detail, err := h.adminKlienService.GetKlienDetail(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusNotFound, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Detail klien berhasil diambil", detail)
}

// UpdateVerifikasi godoc
// PUT /api/v1/admin/klien/:id/verifikasi
func (h *AdminKlienHandler) UpdateVerifikasi(c *gin.Context) {
	klienID := c.Param("id")
	var req dto.UpdateVerifikasiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Format input tidak valid atau status salah")
		return
	}

	if err := h.adminKlienService.UpdateVerifikasi(klienID, req.Status); err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Status verifikasi berhasil diperbarui", nil)
}
