// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('active');
  nav.classList.toggle('active');
});

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
  });
});

// Gallery functionality
const galleryGrid = document.querySelector('.gallery-grid');
const galleryDots = document.querySelectorAll('.gallery-dot');
const prevBtn = document.getElementById('gallery-prev');
const nextBtn = document.getElementById('gallery-next');
let currentIndex = 0;
let galleryItems = [];
const imagesPerView = 3;

// Array of gallery image filenames
const galleryImages = [
  'gallery1.jpeg',
  'gallery2.jpeg', 
  'gallery3.jpeg',
  'gallery4.jpeg',
  'gallery5.jpeg',
  'gallery6.jpeg',
  'gallery7.jpeg'
];

// Dynamically create gallery items
function createGalleryItems() {
  galleryGrid.innerHTML = ''; // Clear existing content
  
  galleryImages.forEach((imageName, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-index', index);
    
    const img = document.createElement('img');
    img.src = `./images/gallery/${imageName}`;
    img.alt = `Sierra Villa Gallery Image ${index + 1}`;
    img.className = 'gallery-image';
    
    galleryItem.appendChild(img);
    galleryGrid.appendChild(galleryItem);
  });
  
  // Re-select gallery items after creation
  galleryItems = document.querySelectorAll('.gallery-item');
}

function showImages(startIndex) {
  const totalImages = galleryItems.length;
  
  // Hide all images first
  galleryItems.forEach(item => {
    item.style.display = 'none';
    item.classList.remove('active');
  });
  
  // Show 3 images starting from startIndex and position them correctly
  for (let i = 0; i < imagesPerView; i++) {
    const imageIndex = (startIndex + i) % totalImages;
    if (galleryItems[imageIndex]) {
      galleryItems[imageIndex].style.display = 'block';
      galleryItems[imageIndex].style.gridColumn = i + 1; // Position in grid column 1, 2, or 3
      galleryItems[imageIndex].classList.add('active');
    }
  }
  
  // Update dots - each dot represents a position
  galleryDots.forEach((dot, index) => {
    dot.classList.remove('active');
  });
  
  if (galleryDots[startIndex]) {
    galleryDots[startIndex].classList.add('active');
  }
  
  // Update navigation buttons
  prevBtn.disabled = startIndex === 0;
  nextBtn.disabled = startIndex >= totalImages - imagesPerView;
}

function nextImages() {
  const totalImages = galleryItems.length;
  currentIndex = (currentIndex + 1) % (totalImages - imagesPerView + 1);
  showImages(currentIndex);
}

function prevImages() {
  const totalImages = galleryItems.length;
  currentIndex = (currentIndex - 1);
  if (currentIndex < 0) {
    currentIndex = totalImages - imagesPerView; // Go to last position
  }
  showImages(currentIndex);
}

// Event listeners
nextBtn.addEventListener('click', nextImages);
prevBtn.addEventListener('click', prevImages);

// Dot navigation - each dot shows a different starting position
galleryDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    showImages(currentIndex);
  });
});

// Initialize gallery
createGalleryItems();
showImages(0);

// Auto-advance gallery every 5 seconds
setInterval(nextImages, 5000);

// =========================
// Booking Popup Functionality
// =========================

// Booking popup elements
const bookingPopup = document.getElementById('booking-popup');
const bookingBtn = document.querySelector('.booking-btn');
const bookingClose = document.getElementById('booking-close');
const bookingCancel = document.getElementById('booking-cancel');
const bookingForm = document.getElementById('booking-form');

// Show booking popup
function showBookingPopup() {
  bookingPopup.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Set minimum date for check-in to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-checkin').min = today;
  
  // Focus on first input
  setTimeout(() => {
    document.getElementById('booking-name').focus();
  }, 300);
}

// Hide booking popup
function hideBookingPopup() {
  bookingPopup.classList.remove('active');
  document.body.style.overflow = '';
  bookingForm.reset();
}

// Close popup when clicking outside
bookingPopup.addEventListener('click', (e) => {
  if (e.target === bookingPopup) {
    hideBookingPopup();
  }
});

// Close popup with escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingPopup.classList.contains('active')) {
    hideBookingPopup();
  }
});

// Event listeners for popup controls
bookingBtn.addEventListener('click', showBookingPopup);
bookingClose.addEventListener('click', hideBookingPopup);
bookingCancel.addEventListener('click', hideBookingPopup);

// Handle form submission
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(bookingForm);
  const bookingData = {
    name: formData.get('name'),
    checkin: formData.get('checkin'),
    checkout: formData.get('checkout'),
    persons: formData.get('persons'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    message: formData.get('message')
  };
  
  // Format dates
  const checkinDate = new Date(bookingData.checkin).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const checkoutDate = new Date(bookingData.checkout).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get current language
  const currentLang = localStorage.getItem('siteLang') || (document.documentElement.getAttribute('lang') || 'id');
  
  // Build WhatsApp message
  let whatsappMessage = '';
  
  if (currentLang === 'en') {
    whatsappMessage = `Hello Sierra Villa,

I would like to make a booking reservation:

*Name:* ${bookingData.name}
*Check-in Date:* ${checkinDate}
*Check-out Date:* ${checkoutDate}
*Number of Guest(s):* ${bookingData.persons}
*Phone Number:* ${bookingData.phone}`;
    
    if (bookingData.email) {
      whatsappMessage += `\n*Email:* ${bookingData.email}`;
    }
    
    if (bookingData.message) {
      whatsappMessage += `\n\n*Additional Message:*
${bookingData.message}`;
    }
    
    whatsappMessage += `\n\nPlease confirm my booking. Thank you!`;
  } else {
    whatsappMessage = `Halo Sierra Villa,

Saya ingin melakukan pemesanan:

*Nama:* ${bookingData.name}
*Tanggal Check-in:* ${checkinDate}
*Tanggal Check-out:* ${checkoutDate}
*Jumlah Tamu:* ${bookingData.persons}
*Nomor Telepon:* ${bookingData.phone}`;
    
    if (bookingData.email) {
      whatsappMessage += `\n*Email:* ${bookingData.email}`;
    }
    
    if (bookingData.message) {
      whatsappMessage += `\n\n*Pesan Tambahan:*
${bookingData.message}`;
    }
    
    whatsappMessage += `\n\nMohon konfirmasi pemesanan saya. Terima kasih!`;
  }
  
  // Open WhatsApp with the message
  const whatsappUrl = `https://api.whatsapp.com/send?phone=6285792164690&text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank');
  
  // Hide popup after sending
  hideBookingPopup();
});

// Update checkout minimum date when check-in changes
document.getElementById('booking-checkin').addEventListener('change', function() {
  const checkoutInput = document.getElementById('booking-checkout');
  checkoutInput.min = this.value;
  
  // If checkout date is before check-in, clear it
  if (checkoutInput.value && checkoutInput.value < this.value) {
    checkoutInput.value = '';
  }
});

// =========================
// Simple i18n (ID / EN)
// =========================
const translations = {
  id: {
    'nav.why': 'Mengapa Kami?',
    'nav.accommodation': 'Akomodasi',
    'nav.amenities': 'Fasilitas',
    'nav.gallery': 'Galeri',
    'nav.book': 'Pesan Sekarang',
    'hero.badge': '4.9 Review Google',
    'hero.title': 'Rasakan Kemewahan Minimalis di Malang',
    'hero.desc': 'Temukan Sierra Villa - tempat minimalis modern bertemu keramahan Indonesia. Akomodasi terbaik dengan pelayanan istimewa dan interior yang memukau.',
    'hero.cta': 'Pesan Sekarang',
    'why.badge': 'Mengapa Memilih Kami?',
    'why.title': 'Desain Minimalis & Kenyamanan Premium',
    'why.desc': 'Rasakan perpaduan sempurna antara minimalis kontemporer dan kehangatan Indonesia. Guest house kami meraih rating 4.9 bintang di Google Maps berkat pelayanan istimewa dan desain interior yang memukau.',
    'why.features.1.title': '4.9 Bintang',
    'why.features.1.desc': 'Konsisten mendapat rating terbaik dari tamu kami',
    'why.features.2.title': 'Desain Minimalis',
    'why.features.2.desc': 'Interior bersih dan modern yang menginspirasi ketenangan',
    'why.features.3.title': 'Pelayanan Premium',
    'why.features.3.desc': 'Pengalaman keramahan yang dipersonalisasi',
    'why.features.4.title': 'Lokasi Strategis',
    'why.features.4.desc': 'Di jantung Malang, akses mudah ke mana saja',
    'why.contact': 'Pesan Kamar',
    'rooms.badge': 'Akomodasi Kami',
    'rooms.title': 'Kamar yang Dirancang dengan Teliti',
    'rooms.desc': 'Setiap kamar memadukan estetika minimalis dengan kenyamanan modern, menciptakan tempat perlindungan sempurna untuk menginap Anda di Malang.',
    'rooms.card1.title': 'Ruang Tamu Utama',
    'rooms.card1.desc': 'Suasana sederhana namun nyaman',
    'rooms.card2.title': 'Kamar Tidur',
    'rooms.card2.desc': 'Kenyamanan sempurna',
    'rooms.card3.title': 'Kolam Renang',
    'rooms.card3.desc': 'Kesegaran yang menyenangkan',
    'amenities.badge': 'Fasilitas Premium',
    'amenities.title': 'Semua yang Anda Butuhkan untuk Menginap Sempurna',
    'amenities.desc': 'Nikmati kenyamanan modern dan sentuhan istimewa yang dirancang untuk meningkatkan pengalaman Anda di Malang.',
    'amenities.card1.title': 'WiFi Gratis',
    'amenities.card1.desc': 'Internet berkecepatan tinggi di seluruh properti',
    'amenities.card2.title': 'Kolam Renang',
    'amenities.card2.desc': 'Kolam renang outdoor yang menyegarkan dengan area bersantai',
    'amenities.card3.title': 'Parkir Gratis',
    'amenities.card3.desc': 'Parkir aman di lokasi untuk semua tamu',
    'amenities.card4.title': 'Akses Cepat',
    'amenities.card4.desc': 'Akses mudah dan cepat ke semua kebutuhan sehari-hari',
    'gallery.badge': 'Galeri Foto',
    'gallery.title': 'Rasakan Ruang Indah Kami',
    'gallery.desc': 'Jelajahi perjalanan visual melalui desain minimalis dan akomodasi nyaman kami.',
    'cta.badge': 'Terbaik di Malang',
    'cta.title': 'Siap Merasakan Sierra Villa?',
    'cta.desc': 'Pesan menginap Anda di akomodasi minimalis terdepan Malang. Bergabunglah dengan ratusan tamu puas yang telah merasakan keramahan istimewa kami.',
    'cta.stats.reviews': 'Review Google',
    'cta.stats.guests': 'Tamu Puas',
    'cta.stats.support': 'Dukungan Tamu',
    'cta.contact': 'Pesan Kamar',
    'location.badge': 'Lokasi Kami',
    'location.title': 'Temukan Kami dengan Mudah',
    'location.desc': 'Berada strategis di jantung Malang, properti kami hanya beberapa menit dari atraksi lokal, restoran, dan pusat transportasi.',
    'footer.title': 'Hubungi Kami',
    'footer.desc': 'Temukan Sierra Villa - tempat minimalis modern bertemu keramahan Indonesia.',
    'booking.title': 'Formulir Pemesanan',
    'booking.name': 'Nama Lengkap *',
    'booking.checkin': 'Tanggal Check-In *',
    'booking.checkout': 'Tanggal Check-Out *',
    'booking.persons': 'Jumlah Orang *',
    'booking.phone': 'Nomor Telepon *',
    'booking.email': 'Email',
    'booking.message': 'Pesan Tambahan',
    'booking.note': 'Pesan khusus atau permintaan tambahan...',
    'booking.cancel': 'Batal',
    'booking.submit': 'Kirim ke WhatsApp',
    'booking.total': 'Pilih Jumlah Tamu',
    'booking.note': 'Pesan khusus atau permintaan tambahan'
  },
  en: {
    'nav.why': 'Why Us?',
    'nav.accommodation': 'Accommodation',
    'nav.amenities': 'Amenities',
    'nav.gallery': 'Gallery',
    'nav.book': 'Book Now',
    'hero.badge': '4.9 Google Reviews',
    'hero.title': 'Experience Minimalist Luxury in Malang',
    'hero.desc': 'Discover Sierra Villa — where modern minimalism meets Indonesian hospitality. Top-rated accommodation with exceptional service and stunning interiors.',
    'hero.cta': 'Book Now',
    'why.badge': 'Why Choose Us?',
    'why.title': 'Minimalist Design & Premium Comfort',
    'why.desc': 'Experience the perfect blend of contemporary minimalism and Indonesian warmth. Our guest house has earned a 4.9-star rating on Google Maps for exceptional service and stunning interiors.',
    'why.features.1.title': '4.9 Star Reviews',
    'why.features.1.desc': 'Consistently rated excellence by our guests',
    'why.features.2.title': 'Minimalist Design',
    'why.features.2.desc': 'Clean, modern interiors that inspire tranquility',
    'why.features.3.title': 'Premium Services',
    'why.features.3.desc': 'Personalized hospitality experience',
    'why.features.4.title': 'Prime Location',
    'why.features.4.desc': 'Heart of Malang, easy access to everywhere',
    'why.contact': 'Book Room',
    'rooms.badge': 'Our Accommodation',
    'rooms.title': 'Thoughtfully Designed Rooms',
    'rooms.desc': 'Each room blends minimalist aesthetics with modern comfort, creating the perfect sanctuary for your stay in Malang.',
    'rooms.card1.title': 'Main Living Room',
    'rooms.card1.desc': 'Simple yet cozy ambience',
    'rooms.card2.title': 'Bedroom',
    'rooms.card2.desc': 'Perfect comfort',
    'rooms.card3.title': 'Pool',
    'rooms.card3.desc': 'Fun & joyful refreshment',
    'amenities.badge': 'Premium Amenities',
    'amenities.title': 'Everything You Need for a Perfect Stay',
    'amenities.desc': 'Enjoy modern conveniences and thoughtful touches designed to enhance your experience in Malang.',
    'amenities.card1.title': 'Free WiFi',
    'amenities.card1.desc': 'High-speed internet throughout the property',
    'amenities.card2.title': 'Swimming Pool',
    'amenities.card2.desc': 'Refreshing outdoor pool with lounge area',
    'amenities.card3.title': 'Free Parking',
    'amenities.card3.desc': 'Secure on-site parking for all guests',
    'amenities.card4.title': 'Fast Access',
    'amenities.card4.desc': 'Easy and fast access to your everyday needs',
    'gallery.badge': 'Photo Gallery',
    'gallery.title': 'Experience Our Beautiful Spaces',
    'gallery.desc': 'Take a visual journey through our minimalist design and comfortable accommodations.',
    'cta.badge': 'Best in Malang',
    'cta.title': 'Ready to Experience Sierra Villa?',
    'cta.desc': "Book your stay at Malang's premier minimalist accommodation. Join hundreds of satisfied guests who've experienced our exceptional hospitality.",
    'cta.stats.reviews': 'Google Reviews',
    'cta.stats.guests': 'Happy Guests',
    'cta.stats.support': 'Guest Support',
    'cta.contact': 'Book Room',
    'location.badge': 'Our Location',
    'location.title': 'Find Us with Ease',
    'location.desc': 'Conveniently located in the heart of Malang, our property is just minutes away from local attractions, dining, and transportation hubs.',
    'footer.title': 'Contact Us',
    'footer.desc': 'Discover Sierra Villa — where modern minimalism meets Indonesian hospitality.',
    'booking.title': 'Booking Form',
    'booking.name': 'Full Name *',
    'booking.checkin': 'Check-in Date *',
    'booking.checkout': 'Check-out Date *',
    'booking.persons': 'Number of Guests *',
    'booking.phone': 'Phone Number *',
    'booking.email': 'Email',
    'booking.message': 'Additional Message',
    'booking.note': 'Special message or additional requests...',
    'booking.cancel': 'Cancel',
    'booking.submit': 'Send to WhatsApp',
    'booking.total': 'Select Total Guests',
    'booking.note': 'Add your additional notes'
  }
};

function applyTranslations(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = translations[lang] && translations[lang][key];
    if (typeof value === 'string') {
      el.textContent = value;
    }
  });

  // Handle placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = translations[lang] && translations[lang][key];
    if (typeof value === 'string') {
      el.placeholder = value;
    }
  });

  // Update html lang attribute
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'id');

  // Update SEO title and description for the selected language
  const titleEl = document.querySelector('title');
  const metaTitle = document.querySelector('meta[name="title"]');
  const metaDesc = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  const twTitle = document.querySelector('meta[property="twitter:title"]');
  const twDesc = document.querySelector('meta[property="twitter:description"]');

  if (lang === 'en') {
    const t = 'Sierra Villa - Minimalist Accommodation in Malang';
    const d = 'Discover Sierra Villa — where modern minimalism meets Indonesian hospitality. 4.9-star rated accommodation in Malang with exceptional service and stunning minimalist interiors.';
    if (titleEl) titleEl.textContent = t;
    if (metaTitle) metaTitle.setAttribute('content', 'Sierra Villa - Luxury Minimalist Accommodation in Malang');
    if (metaDesc) metaDesc.setAttribute('content', d);
    if (ogTitle) ogTitle.setAttribute('content', 'Sierra Villa - Luxury Minimalist Accommodation in Malang');
    if (ogDesc) ogDesc.setAttribute('content', d);
    if (ogLocale) ogLocale.setAttribute('content', 'en_US');
    if (twTitle) twTitle.setAttribute('content', 'Sierra Villa - Luxury Minimalist Accommodation in Malang');
    if (twDesc) twDesc.setAttribute('content', d);
  } else {
    const t = 'Sierra Villa - Akomodasi Minimalis Terbaik di Malang';
    const d = 'Temukan Sierra Villa - tempat minimalis modern bertemu keramahan Indonesia. Akomodasi bintang 4.9 di Malang dengan pelayanan istimewa dan interior minimalis yang memukau.';
    if (titleEl) titleEl.textContent = t;
    if (metaTitle) metaTitle.setAttribute('content', 'Sierra Villa - Akomodasi Mewah Minimalis di Malang');
    if (metaDesc) metaDesc.setAttribute('content', d);
    if (ogTitle) ogTitle.setAttribute('content', 'Sierra Villa - Akomodasi Mewah Minimalis di Malang');
    if (ogDesc) ogDesc.setAttribute('content', d);
    if (ogLocale) ogLocale.setAttribute('content', 'id_ID');
    if (twTitle) twTitle.setAttribute('content', 'Sierra Villa - Akomodasi Mewah Minimalis di Malang');
    if (twDesc) twDesc.setAttribute('content', d);
  }

  // Toggle active state on buttons
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function initLanguage() {
  const saved = localStorage.getItem('siteLang');
  const defaultLang = saved ? saved : ((navigator.language || 'id').startsWith('en') ? 'en' : 'id');
  applyTranslations(defaultLang);
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      localStorage.setItem('siteLang', lang);
      applyTranslations(lang);
    });
  });

  // Prefill WhatsApp chat message
  const whatsappLinks = document.querySelectorAll('.whatsapp-link');
  const buildWhatsAppText = (lang) => {
    if (lang === 'en') {
      // return 'Hello Sierra Villa,\n\nName:\nOrigin:\nPhone:\nNumber of Guests:\nBooking Date:';
      return 'Hello Sierra Villa, is the villa available on '
    }
    // return 'Halo Sierra Villa,\n\nNama:\nAsal Kota:\nNo. Hp:\nJumlah Orang:\nTanggal Booking:';
    return 'Hallo Sierra Villa, apakah villa tersedia untuk tanggal '
  };

  function updateWhatsAppLinks() {
    const lang = localStorage.getItem('siteLang') || (document.documentElement.getAttribute('lang') || 'id');
    const text = buildWhatsAppText(lang === 'en' ? 'en' : 'id');
    whatsappLinks.forEach((a) => {
      try {
        const url = new URL(a.href);
        url.searchParams.set('text', text);
        a.href = url.toString();
      } catch (e) {
        // Fallback for relative or malformed hrefs: append properly encoded text param
        const sep = a.href.indexOf('?') !== -1 ? '&' : '?';
        a.href = a.href + sep + 'text=' + encodeURIComponent(text);
      }
    });
  }

  updateWhatsAppLinks();

  // Rebuild links when language changes
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setTimeout(updateWhatsAppLinks, 0);
    });
  });
});

