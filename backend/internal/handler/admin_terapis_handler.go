package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type AdminTerapisHandler struct {
	terapisService service.TerapisService
}

func NewAdminTerapisHandler(terapisService service.TerapisService) *AdminTerapisHandler {
	return &AdminTerapisHandler{terapisService: terapisService}
}

// GetAll godoc
// GET /api/v1/admin/terapis
func (h *AdminTerapisHandler) GetAll(c *gin.Context) {
	terapisList, err := h.terapisService.GetAll()
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, "Gagal mengambil daftar terapis")
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Daftar terapis berhasil diambil", terapisList)
}

// Create godoc
// POST /api/v1/admin/terapis
func (h *AdminTerapisHandler) Create(c *gin.Context) {
	var req dto.CreateTerapisRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Format input tidak valid")
		return
	}

	res, err := h.terapisService.Create(&req)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, "Gagal menambah terapis")
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Terapis berhasil ditambahkan", res)
}

// Update godoc
// PUT /api/v1/admin/terapis/:id
func (h *AdminTerapisHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req dto.UpdateTerapisRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Format input tidak valid")
		return
	}

	res, err := h.terapisService.Update(id, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Data terapis berhasil diperbarui", res)
}
