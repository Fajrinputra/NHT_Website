package utils

import "github.com/gin-gonic/gin"

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func ResponseSuccess(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, APIResponse{
		Success: true,
		Data:    data,
		Message: message,
	})
}

func ResponseError(c *gin.Context, statusCode int, errMsg string) {
	c.JSON(statusCode, APIResponse{
		Success: false,
		Error:   errMsg,
	})
}
