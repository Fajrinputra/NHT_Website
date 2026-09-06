package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
)

type AdminJadwalHandler struct {
	adminJadwalSvc service.AdminJadwalService
}

func NewAdminJadwalHandler(svc service.AdminJadwalService) *AdminJadwalHandler {
	return &AdminJadwalHandler{adminJadwalSvc: svc}
}

func (h *AdminJadwalHandler) GetJadwalByTanggal(c *gin.Context) {
	tanggal := c.Query("tanggal")
	if tanggal == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parameter tanggal (YYYY-MM-DD) diperlukan"})
		return
	}

	res, err := h.adminJadwalSvc.GetJadwalByTanggal(tanggal)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

func (h *AdminJadwalHandler) Create(c *gin.Context) {
	var req dto.CreateJadwalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak lengkap atau format salah"})
		return
	}

	res, err := h.adminJadwalSvc.CreateJadwal(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Jadwal berhasil ditambahkan",
		"data":    res,
	})
}

func (h *AdminJadwalHandler) Toggle(c *gin.Context) {
	id := c.Param("id")
	var req dto.ToggleJadwalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	err := h.adminJadwalSvc.ToggleJadwal(id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status jadwal berhasil diperbarui",
	})
}
