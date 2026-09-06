package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
)

type AdminArtikelHandler struct {
	adminArtikelSvc service.AdminArtikelService
}

func NewAdminArtikelHandler(svc service.AdminArtikelService) *AdminArtikelHandler {
	return &AdminArtikelHandler{adminArtikelSvc: svc}
}

func (h *AdminArtikelHandler) Create(c *gin.Context) {
	var req dto.CreateArtikelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid atau kategori salah"})
		return
	}

	res, err := h.adminArtikelSvc.CreateArtikel(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Artikel berhasil dibuat",
		"data":    res,
	})
}

func (h *AdminArtikelHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req dto.UpdateArtikelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid atau kategori salah"})
		return
	}

	res, err := h.adminArtikelSvc.UpdateArtikel(id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Artikel berhasil diperbarui",
		"data":    res,
	})
}

func (h *AdminArtikelHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	
	err := h.adminArtikelSvc.DeleteArtikel(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Artikel berhasil dihapus",
	})
}

func (h *AdminArtikelHandler) GetAll(c *gin.Context) {
	res, err := h.adminArtikelSvc.GetAllArtikels()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}
