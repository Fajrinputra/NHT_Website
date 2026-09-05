package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type IbuHamilHandler struct {
	ibuHamilService service.IbuHamilService
}

func NewIbuHamilHandler(s service.IbuHamilService) *IbuHamilHandler {
	return &IbuHamilHandler{ibuHamilService: s}
}

// GetIbuHamil godoc
// GET /api/v1/ibu-hamil
func (h *IbuHamilHandler) GetIbuHamil(c *gin.Context) {
	klienID := c.GetString("klienID")

	resp, err := h.ibuHamilService.GetIbuHamil(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Data ibu hamil berhasil diambil", resp)
}

// UpdateIbuHamil godoc
// PUT /api/v1/ibu-hamil
func (h *IbuHamilHandler) UpdateIbuHamil(c *gin.Context) {
	klienID := c.GetString("klienID")

	var req dto.UpdateIbuHamilRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	resp, err := h.ibuHamilService.UpdateIbuHamil(klienID, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Data ibu hamil berhasil disimpan", resp)
}
