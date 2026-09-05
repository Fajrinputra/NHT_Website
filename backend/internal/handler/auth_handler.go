package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Register godoc
// POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	klien, err := h.authService.Register(&req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Akun berhasil dibuat. Silakan tunggu verifikasi dari tim kami.", klien)
}

// Login godoc
// POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	resp, err := h.authService.Login(&req)
	if err != nil {
		utils.ResponseError(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Login berhasil", resp)
}

// GetStatus godoc
// GET /api/v1/auth/status — digunakan oleh VerificationPendingPage untuk polling
func (h *AuthHandler) GetStatus(c *gin.Context) {
	klienID := c.GetString("klienID")

	status, err := h.authService.GetStatus(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusNotFound, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Status berhasil diambil", status)
}

// GetMe godoc
// GET /api/v1/auth/me
func (h *AuthHandler) GetMe(c *gin.Context) {
	klienID := c.GetString("klienID")

	klien, err := h.authService.GetMe(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusNotFound, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Data klien berhasil diambil", klien)
}

// ChangePassword godoc
// PUT /api/v1/auth/password
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	klienID := c.GetString("klienID")

	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	if err := h.authService.ChangePassword(klienID, &req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Kata sandi berhasil diubah", nil)
}
