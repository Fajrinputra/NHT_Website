package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type NotifikasiHandler struct {
	notifService service.NotifikasiService
}

func NewNotifikasiHandler(s service.NotifikasiService) *NotifikasiHandler {
	return &NotifikasiHandler{notifService: s}
}

// GetNotifikasi godoc
// GET /api/v1/notifikasi
func (h *NotifikasiHandler) GetNotifikasi(c *gin.Context) {
	klienID := c.GetString("klienID")

	notifs, err := h.notifService.GetNotifikasi(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Notifikasi berhasil diambil", notifs)
}

// MarkAsRead godoc
// PUT /api/v1/notifikasi/:id/read
func (h *NotifikasiHandler) MarkAsRead(c *gin.Context) {
	klienID := c.GetString("klienID")
	id := c.Param("id")

	err := h.notifService.MarkAsRead(klienID, id)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Notifikasi ditandai dibaca", nil)
}

// GetUnreadCount godoc
// GET /api/v1/notifikasi/unread-count
func (h *NotifikasiHandler) GetUnreadCount(c *gin.Context) {
	klienID := c.GetString("klienID")

	count, err := h.notifService.GetUnreadCount(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Jumlah notifikasi belum dibaca", map[string]int64{"count": count})
}
