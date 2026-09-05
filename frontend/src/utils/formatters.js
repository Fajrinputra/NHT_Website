import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date
 * @param {string} fmt - format date-fns, default: 'd MMMM yyyy'
 */
export function formatTanggal(date, fmt = 'd MMMM yyyy') {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt, { locale: id });
  } catch {
    return '-';
  }
}

/**
 * Format usia anak dari tanggal lahir
 * @param {string|Date} tanggalLahir
 */
export function formatUsiaAnak(tanggalLahir) {
  if (!tanggalLahir) return '-';
  const d = typeof tanggalLahir === 'string' ? parseISO(tanggalLahir) : tanggalLahir;
  const now = new Date();
  const months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());
  if (months < 1) return 'Baru lahir';
  if (months < 12) return `${months} bulan`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years} tahun ${remMonths} bulan` : `${years} tahun`;
}

/**
 * Format nomor telepon ke format +62
 * @param {string} phone
 */
export function formatNomorTelepon(phone) {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '+62' + cleaned.slice(1);
  }
  if (cleaned.startsWith('62')) {
    return '+' + cleaned;
  }
  return phone;
}

/**
 * Ambil inisial nama (maks 2 huruf)
 * @param {string} nama
 */
export function getInisial(nama) {
  if (!nama) return 'N';
  const parts = nama.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
