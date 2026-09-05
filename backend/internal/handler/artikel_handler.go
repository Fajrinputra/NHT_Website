package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type ArtikelHandler struct {
	artikelService service.ArtikelService
}

func NewArtikelHandler(s service.ArtikelService) *ArtikelHandler {
	return &ArtikelHandler{artikelService: s}
}

// GetArtikels godoc
// GET /api/v1/artikel?limit=2&kategori=IBU_HAMIL&q=search
func (h *ArtikelHandler) GetArtikels(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	searchQuery := c.Query("q")
	kategori := c.Query("kategori")

	if searchQuery != "" || kategori != "" {
		artikels, err := h.artikelService.GetArtikels(searchQuery, kategori)
		if err != nil {
			utils.ResponseError(c, http.StatusInternalServerError, err.Error())
			return
		}
		utils.ResponseSuccess(c, http.StatusOK, "Hasil pencarian artikel", artikels)
		return
	}

	artikels, err := h.artikelService.GetLatestArtikels(limit)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.ResponseSuccess(c, http.StatusOK, "Artikel berhasil diambil", artikels)
}

// GetArtikelByID godoc
// GET /api/v1/artikel/:id
func (h *ArtikelHandler) GetArtikelByID(c *gin.Context) {
	id := c.Param("id")

	artikel, err := h.artikelService.GetArtikelByID(id)
	if err != nil {
		utils.ResponseError(c, http.StatusNotFound, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Artikel berhasil diambil", artikel)
}
