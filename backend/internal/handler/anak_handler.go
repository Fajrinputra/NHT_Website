package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type AnakHandler struct {
	anakService service.AnakService
}

func NewAnakHandler(s service.AnakService) *AnakHandler {
	return &AnakHandler{anakService: s}
}

// CreateAnak godoc
// POST /api/v1/anak
func (h *AnakHandler) CreateAnak(c *gin.Context) {
	klienID := c.GetString("klienID")

	var req dto.CreateAnakRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	anak, err := h.anakService.CreateAnak(klienID, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Data anak berhasil ditambahkan", anak)
}

// GetAnak godoc
// GET /api/v1/anak
func (h *AnakHandler) GetAnak(c *gin.Context) {
	klienID := c.GetString("klienID")

	anaks, err := h.anakService.GetAnakByKlienID(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Data anak berhasil diambil", anaks)
}

// UpdateAnak godoc
// PUT /api/v1/anak/:id
func (h *AnakHandler) UpdateAnak(c *gin.Context) {
	klienID := c.GetString("klienID")
	anakID := c.Param("id")

	var req dto.UpdateAnakRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	anak, err := h.anakService.UpdateAnak(anakID, klienID, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Data anak berhasil diperbarui", anak)
}
