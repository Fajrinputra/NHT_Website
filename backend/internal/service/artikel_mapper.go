package service

import (
	"github.com/nata-house/backend/internal/dto"
	"github.com/nata-house/backend/internal/models"
)

// toArtikelResponseList mengkonversi slice models.Artikel ke slice dto.ArtikelResponse
func toArtikelResponseList(artikels []models.Artikel) []dto.ArtikelResponse {
	result := make([]dto.ArtikelResponse, 0, len(artikels))
	for _, a := range artikels {
		result = append(result, dto.ArtikelResponse{
			ID:        a.ID,
			Judul:     a.Judul,
			Kategori:  string(a.Kategori),
			GambarURL: a.GambarURL,
			Cuplikan:  a.Cuplikan,
			CreatedAt: a.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	return result
}
