package dto

type AdminLoginRequest struct {
	Email     string `json:"email" binding:"required,email"`
	KataSandi string `json:"kataSandi" binding:"required"`
}

type AdminLoginResponse struct {
	Token string `json:"token"`
}
