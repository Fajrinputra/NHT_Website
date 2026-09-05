/**
 * Konfigurasi terpusat untuk kontak dan media sosial Nata House Treatment.
 * Ubah nilai di sini untuk memperbarui seluruh aplikasi sekaligus.
 */

/** Nomor WA admin (format internasional tanpa +) */
export const ADMIN_WA_NUMBER = '6285881801658';

/** Link Instagram resmi */
export const INSTAGRAM_URL = 'https://www.instagram.com/nata_housetreatment';

/** Nama bisnis */
export const BISNIS_NAMA = 'Nata House Treatment';

/**
 * Buat link WA dengan pesan pre-filled.
 * @param {string} pesan - Teks pesan yang sudah di-encode
 */
export const buatLinkWA = (pesan = '') => {
  const encoded = pesan ? `?text=${encodeURIComponent(pesan)}` : '';
  return `https://wa.me/${ADMIN_WA_NUMBER}${encoded}`;
};

/**
 * Link WA untuk konfirmasi booking.
 * @param {string} layanan - Label jenis layanan
 * @param {string} tanggal - Tanggal yang sudah diformat
 * @param {string} jam - Jam pesanan
 */
export const buatLinkWABooking = (layanan, tanggal, jam) => {
  const pesan = `Halo Admin ${BISNIS_NAMA}, saya ingin mengkonfirmasi pesanan ${layanan} untuk tanggal ${tanggal} jam ${jam}.`;
  return buatLinkWA(pesan);
};

/** Link WA untuk kontak umum / tanya */
export const LINK_WA_KONTAK = buatLinkWA(`Halo Admin ${BISNIS_NAMA}, saya ingin bertanya mengenai layanan Anda.`);
