package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type CatatanHarianHandler struct {
	catatanService service.CatatanHarianService
}

func NewCatatanHarianHandler(s service.CatatanHarianService) *CatatanHarianHandler {
	return &CatatanHarianHandler{catatanService: s}
}

// CreateCatatan godoc
// POST /api/v1/catatan-harian
func (h *CatatanHarianHandler) CreateCatatan(c *gin.Context) {
	klienID := c.GetString("klienID")

	var req dto.CreateCatatanHarianRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	catatan, err := h.catatanService.Create(klienID, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Catatan harian berhasil ditambahkan", catatan)
}

// GetCatatan godoc
// GET /api/v1/catatan-harian
func (h *CatatanHarianHandler) GetCatatan(c *gin.Context) {
	klienID := c.GetString("klienID")
	konteks := c.Query("konteks")
	anakIDStr := c.Query("anakId")
	
	var anakID *string
	if anakIDStr != "" {
		anakID = &anakIDStr
	}

	if konteks == "" {
		utils.ResponseError(c, http.StatusBadRequest, "Konteks catatan wajib diisi (IBU_HAMIL, BAYI, ANAK)")
		return
	}

	catatans, err := h.catatanService.GetByKonteks(klienID, konteks, anakID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Catatan harian berhasil diambil", catatans)
}

// UpdateCatatan godoc
// PUT /api/v1/catatan-harian/:id
func (h *CatatanHarianHandler) UpdateCatatan(c *gin.Context) {
	klienID := c.GetString("klienID")
	id := c.Param("id")

	var req dto.UpdateCatatanHarianRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	catatan, err := h.catatanService.Update(id, klienID, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Catatan harian berhasil diperbarui", catatan)
}
