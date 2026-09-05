package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type ProfilHandler struct {
	profilService service.ProfilService
}

func NewProfilHandler(s service.ProfilService) *ProfilHandler {
	return &ProfilHandler{profilService: s}
}

// GetProfil godoc
// GET /api/v1/profil
func (h *ProfilHandler) GetProfil(c *gin.Context) {
	klienID := c.GetString("klienID")

	profil, err := h.profilService.GetProfil(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Profil berhasil diambil", profil)
}
