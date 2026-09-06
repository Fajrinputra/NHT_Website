package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
)

type AdminBookingHandler struct {
	adminBookingSvc service.AdminBookingService
}

func NewAdminBookingHandler(svc service.AdminBookingService) *AdminBookingHandler {
	return &AdminBookingHandler{adminBookingSvc: svc}
}

func (h *AdminBookingHandler) GetAll(c *gin.Context) {
	status := c.Query("status") // optional filter
	
	res, err := h.adminBookingSvc.GetAllBookings(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

func (h *AdminBookingHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	
	res, err := h.adminBookingSvc.GetBookingByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

func (h *AdminBookingHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req dto.AdminUpdateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid atau status salah"})
		return
	}

	res, err := h.adminBookingSvc.UpdateBooking(id, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Booking berhasil diperbarui",
		"data":    res,
	})
}
