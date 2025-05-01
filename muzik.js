// Müzik kontrolü için global değişkenler
let muzikPlayer = null;
let isMusicPlaying = true; // Varsayılan olarak müzik açık
let currentTime = 0;
let userInteracted = false; // Kullanıcı etkileşimi olup olmadığını takip et

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function() {
    // Müzik durumunu localStorage'dan al (ilk ziyarette yoksa true olarak başla)
    isMusicPlaying = localStorage.getItem('isMusicPlaying') === null ? true : localStorage.getItem('isMusicPlaying') === 'true';
    currentTime = parseFloat(localStorage.getItem('musicCurrentTime') || '0');
    userInteracted = localStorage.getItem('userInteracted') === 'true';
    
    console.log("Müzik pozisyonu yüklenirken:", currentTime);
    
    // Müzik player elementini bul
    muzikPlayer = document.getElementById('background-music');
    
    if (muzikPlayer) {
        // Müzik pozisyonunu ayarla - mobil cihazlar için güvenilirlik artırıldı
        try {
            // Önce müzik dosyasının yüklendiğinden emin ol
            muzikPlayer.addEventListener('loadedmetadata', function() {
                console.log("Müzik metadata yüklendi, pozisyon ayarlanıyor:", currentTime);
                // Geçerli bir pozisyon kontrolü yap
                if (!isNaN(currentTime) && currentTime > 0 && currentTime < muzikPlayer.duration) {
                    muzikPlayer.currentTime = currentTime;
                    console.log("Müzik pozisyonu ayarlandı:", muzikPlayer.currentTime);
                } else {
                    console.log("Geçersiz müzik pozisyonu, sıfırlandı");
                    muzikPlayer.currentTime = 0;
                }
                
                // Kullanıcı daha önce etkileşimde bulunduysa müziği çalmayı dene
                if (userInteracted) {
                    muzikPlayer.play().catch(error => {
                        console.log("Otomatik oynatma engellendi:", error);
                    });
                }
            });
        } catch (e) {
            console.log("Müzik pozisyonu ayarlanırken hata:", e);
        }
        
        // Müzik durumunu localStorage'a kaydet
        localStorage.setItem('isMusicPlaying', 'true');
        
        // Müzik çalıyor mu durumunu kontrol et ve kaydet
        muzikPlayer.addEventListener('play', function() {
            localStorage.setItem('musicPlaying', 'true');
        });
        
        muzikPlayer.addEventListener('pause', function() {
            localStorage.setItem('musicPlaying', 'false');
        });
        
        // Müzik pozisyonunu daha sık ve güvenilir şekilde kaydet
        setInterval(function() {
            if (muzikPlayer && !muzikPlayer.paused) {
                const currentPos = muzikPlayer.currentTime;
                if (!isNaN(currentPos) && currentPos > 0) {
                    localStorage.setItem('musicCurrentTime', currentPos);
                    console.log("Müzik pozisyonu kaydedildi:", currentPos);
                }
            }
        }, 500); // Daha sık güncelleme için 500ms
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
    
    // Müzik kontrol butonuna tıklama olayı
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
};

// Kullanıcı etkileşimini dinle - tüm sayfada herhangi bir yere tıklandığında
document.addEventListener('click', function() {
    userInteracted = true;
    localStorage.setItem('userInteracted', 'true');
    
    // Eğer müzik çalmazsa, kullanıcı etkileşimi sonrası çalmayı dene
    if (muzikPlayer && muzikPlayer.paused && isMusicPlaying) {
        muzikPlayer.play().catch(e => console.log("Yine de çalamadı:", e));
    }
});

// Sayfa kapatılırken müzik pozisyonunu kaydet
window.addEventListener('beforeunload', function() {
    if (muzikPlayer && !muzikPlayer.paused) {
        localStorage.setItem('musicCurrentTime', muzikPlayer.currentTime);
        console.log("Sayfa kapatılırken müzik pozisyonu kaydedildi:", muzikPlayer.currentTime);
    }
});

// Müziği aç/kapat fonksiyonu
function toggleMusic() {
    if (muzikPlayer) {
        if (muzikPlayer.paused) {
            // Müziği çal
            muzikPlayer.play();
            isMusicPlaying = true;
            
            // Buton görünümünü güncelle
            const musicOn = document.getElementById('music-on');
            const musicOff = document.getElementById('music-off');
            
            if (musicOn && musicOff) {
                musicOn.style.display = 'block';
                musicOff.style.display = 'none';
            }
        } else {
            // Müziği durdur
            muzikPlayer.pause();
            isMusicPlaying = false;
            
            // Buton görünümünü güncelle
            const musicOn = document.getElementById('music-on');
            const musicOff = document.getElementById('music-off');
            
            if (musicOn && musicOff) {
                musicOn.style.display = 'none';
                musicOff.style.display = 'block';
            }
        }
        
        // Müzik durumunu localStorage'a kaydet
        localStorage.setItem('isMusicPlaying', isMusicPlaying);
    }
}
