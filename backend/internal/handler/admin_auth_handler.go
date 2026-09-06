package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type AdminAuthHandler struct {
	adminAuthService service.AdminAuthService
}

func NewAdminAuthHandler(adminAuthService service.AdminAuthService) *AdminAuthHandler {
	return &AdminAuthHandler{adminAuthService: adminAuthService}
}

// Login godoc
// POST /api/v1/admin/auth/login
func (h *AdminAuthHandler) Login(c *gin.Context) {
	var req dto.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Format input tidak valid")
		return
	}

	res, err := h.adminAuthService.Login(&req)
	if err != nil {
		utils.ResponseError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Login berhasil", res)
}
