package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type TerapisAuthHandler struct {
	terapisAuthService service.TerapisAuthService
}

func NewTerapisAuthHandler(svc service.TerapisAuthService) *TerapisAuthHandler {
	return &TerapisAuthHandler{terapisAuthService: svc}
}

// Login godoc
// POST /api/v1/terapis/auth/login
func (h *TerapisAuthHandler) Login(c *gin.Context) {
	var req dto.TerapisLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Nomor telepon dan kata sandi wajib diisi")
		return
	}

	res, err := h.terapisAuthService.Login(req)
	if err != nil {
		utils.ResponseError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Login berhasil", res)
}
