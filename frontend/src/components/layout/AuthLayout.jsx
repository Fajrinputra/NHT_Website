import { ReactNode } from 'react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 lg:p-8 font-sans">
      
      {/* Container 2 modal box (split screen inside a centered box) */}
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* KIRI - Gambar Grafis (Sembunyi di mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50 flex-col justify-center items-center p-10 overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary-200/40 rounded-full blur-3xl z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full blur-3xl z-0"></div>
          
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 leading-snug mb-2">
              Layanan Homecare & <br/> KIA Digital Terpercaya
            </h2>
            <p className="text-sm text-gray-600">
              Pantau tumbuh kembang anak dan <br/> pesan layanan dengan mudah.
            </p>
          </div>
          
          <img 
            src="/hero-login.jpg" 
            alt="Maternal and child healthcare illustration" 
            className="relative z-10 w-full max-w-[320px] object-contain mix-blend-multiply drop-shadow-sm rounded-2xl"
          />
        </div>

        {/* KANAN - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative z-10">
          
          {/* Logo */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <img 
              src="/logo.jpg" 
              alt="Nata House Treatment" 
              className="h-28 sm:h-32 object-contain mix-blend-multiply"
            />
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
          </div>

          {children}

        </div>

      </div>
    </div>
  );
}
