// Müzik kontrolü için global değişkenler
let muzikPlayer = null;
let isMusicPlaying = true; // Varsayılan olarak müzik açık
let currentTime = 0;

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function() {
    // Müzik durumunu localStorage'dan al (ilk ziyarette yoksa true olarak başla)
    isMusicPlaying = localStorage.getItem('isMusicPlaying') === null ? true : localStorage.getItem('isMusicPlaying') === 'true';
    currentTime = parseFloat(localStorage.getItem('musicCurrentTime') || '0');
    
    // Müzik player elementini bul
    muzikPlayer = document.getElementById('background-music');
    
    if (muzikPlayer) {
        // Müzik pozisyonunu ayarla
        muzikPlayer.currentTime = currentTime;
        
        // Sayfa yüklendiğinde müziği otomatik başlat
        const playPromise = muzikPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Otomatik oynatma engellendi:", error);
                // Kullanıcı etkileşimi gerektiğini bildir
                alert("Müziği başlatmak için sayfaya tıklayın");
            });
        }
        
        // Müzik durumunu localStorage'a kaydet
        localStorage.setItem('isMusicPlaying', 'true');
        
        // Müzik pozisyonunu periyodik olarak kaydet
        setInterval(function() {
            if (muzikPlayer && !muzikPlayer.paused) {
                localStorage.setItem('musicCurrentTime', muzikPlayer.currentTime);
            }
        }, 1000);
    }
    
    // Müzik kontrol butonlarını bul
    const musicToggle = document.getElementById('music-toggle');
    const musicOn = document.getElementById('music-on');
    const musicOff = document.getElementById('music-off');
    
    // Buton görünümünü ayarla
    if (musicOn && musicOff) {
        if (isMusicPlaying) {
            musicOn.style.display = 'block';
            musicOff.style.display = 'none';
        } else {
            musicOn.style.display = 'none';
            musicOff.style.display = 'block';
        }
    }
    
    // Müzik kontrol butonuna tıklama olayı ekle
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Sayfa kapatılmadan önce müzik pozisyonunu kaydet
    window.addEventListener('beforeunload', function() {
        if (muzikPlayer) {
            localStorage.setItem('musicCurrentTime', muzikPlayer.currentTime);
        }
    });
};

// Müziği aç/kapat fonksiyonu
function toggleMusic() {
    // Müzik player elementini kontrol et
    if (!muzikPlayer) {
        muzikPlayer = document.getElementById('background-music');
    }
    
    // Müzik kontrol butonlarını bul
    const musicOn = document.getElementById('music-on');
    const musicOff = document.getElementById('music-off');
    
    // Müzik durumunu değiştir
    isMusicPlaying = !isMusicPlaying;
    
    // Müzik durumunu localStorage'a kaydet
    localStorage.setItem('isMusicPlaying', isMusicPlaying);
    
    // Müzik durumuna göre işlem yap
    if (isMusicPlaying) {
        // Müziği başlat
        if (muzikPlayer) {
            const playPromise = muzikPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Müzik başlatma hatası:", error);
                });
            }
        }
        
        // Buton görünümünü ayarla
        if (musicOn && musicOff) {
            musicOn.style.display = 'block';
            musicOff.style.display = 'none';
        }
    } else {
        // Müziği durdur
        if (muzikPlayer) {
            muzikPlayer.pause();
            // Müzik pozisyonunu kaydet
            localStorage.setItem('musicCurrentTime', muzikPlayer.currentTime);
        }
        
        // Buton görünümünü ayarla
        if (musicOn && musicOff) {
            musicOn.style.display = 'none';
            musicOff.style.display = 'block';
        }
    }
}
