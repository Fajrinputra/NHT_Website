package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nata-house/backend/internal/utils"
)

// AdminAuthMiddleware validates JWT token and ensures the role is "admin"
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ResponseError(c, http.StatusUnauthorized, "Token autentikasi diperlukan")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			utils.ResponseError(c, http.StatusUnauthorized, "Format token tidak valid. Gunakan: Bearer <token>")
			c.Abort()
			return
		}

		tokenStr := parts[1]
		claims, err := utils.ValidateToken(tokenStr)
		if err != nil {
			utils.ResponseError(c, http.StatusUnauthorized, "Token tidak valid atau sudah kadaluarsa")
			c.Abort()
			return
		}

		// Verify role
		if claims.Role != "admin" {
			utils.ResponseError(c, http.StatusForbidden, "Akses ditolak: Hanya admin yang diizinkan")
			c.Abort()
			return
		}

		c.Set("adminID", claims.AdminID)
		c.Next()
	}
}
