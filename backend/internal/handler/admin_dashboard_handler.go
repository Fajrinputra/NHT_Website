package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type AdminDashboardHandler struct {
	dashboardService service.AdminDashboardService
}

func NewAdminDashboardHandler(dashboardService service.AdminDashboardService) *AdminDashboardHandler {
	return &AdminDashboardHandler{dashboardService: dashboardService}
}

// GetStats godoc
// GET /api/v1/admin/dashboard/stats
func (h *AdminDashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.dashboardService.GetStats()
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, "Gagal mengambil statistik dashboard")
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Statistik berhasil diambil", stats)
}
