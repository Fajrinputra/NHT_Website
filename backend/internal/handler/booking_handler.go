package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/service"
	"github.com/nata-house/backend/internal/utils"
)

type BookingHandler struct {
	bookingService service.BookingService
}

func NewBookingHandler(s service.BookingService) *BookingHandler {
	return &BookingHandler{bookingService: s}
}

// CreateBooking godoc
// POST /api/v1/booking
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	klienID := c.GetString("klienID")

	var req dto.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResponseError(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	booking, err := h.bookingService.CreateBooking(klienID, &req)
	if err != nil {
		utils.ResponseError(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusCreated, "Booking berhasil dibuat. Menunggu konfirmasi admin.", booking)
}

// GetBookingHistory godoc
// GET /api/v1/booking
func (h *BookingHandler) GetBookingHistory(c *gin.Context) {
	klienID := c.GetString("klienID")

	bookings, err := h.bookingService.GetBookingHistory(klienID)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Riwayat booking berhasil diambil", bookings)
}

// GetJadwalTersedia godoc
// GET /api/v1/booking/jadwal?tahun=2026&bulan=9
func (h *BookingHandler) GetJadwalTersedia(c *gin.Context) {
	tahunStr := c.Query("tahun")
	bulanStr := c.Query("bulan")

	now := time.Now()
	tahun := now.Year()
	bulan := int(now.Month())

	if t, err := strconv.Atoi(tahunStr); err == nil {
		tahun = t
	}
	if b, err := strconv.Atoi(bulanStr); err == nil && b >= 1 && b <= 12 {
		bulan = b
	}

	jadwals, err := h.bookingService.GetJadwalTersedia(tahun, bulan)
	if err != nil {
		utils.ResponseError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.ResponseSuccess(c, http.StatusOK, "Jadwal tersedia berhasil diambil", jadwals)
}
