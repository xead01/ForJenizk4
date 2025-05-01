// Müzik kontrolü için global değişkenler
let muzikPlayer = null;
let isMusicPlaying = true; // Varsayılan olarak müzik açık
let currentTime = 0;
let userInteracted = false; // Kullanıcı etkileşimi olup olmadığını takip et
let positionInterval = null; // Pozisyon kaydetme için interval
let lastKnownPosition = 0; // Son bilinen müzik pozisyonu

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function() {
    console.log("Sayfa yüklendi, müzik ayarlanıyor...");
    
    // Müzik durumunu localStorage'dan al (ilk ziyarette yoksa true olarak başla)
    isMusicPlaying = localStorage.getItem('isMusicPlaying') === null ? true : localStorage.getItem('isMusicPlaying') === 'true';
    userInteracted = localStorage.getItem('userInteracted') === 'true';
    
    // Son bilinen müzik pozisyonunu al
    lastKnownPosition = parseFloat(localStorage.getItem('lastMusicPosition') || '0');
    
    console.log("Son bilinen müzik pozisyonu:", lastKnownPosition);
    
    // Müzik player elementini bul
    muzikPlayer = document.getElementById('background-music');
    
    if (muzikPlayer) {
        // Müzik yüklendiğinde pozisyonu ayarla
        muzikPlayer.addEventListener('loadedmetadata', function() {
            try {
                // Son bilinen pozisyonu ayarla
                if (!isNaN(lastKnownPosition) && lastKnownPosition > 0 && lastKnownPosition < muzikPlayer.duration) {
                    muzikPlayer.currentTime = lastKnownPosition;
                    console.log("Müzik pozisyonu ayarlandı:", lastKnownPosition);
                }
                
                // Kullanıcı daha önce etkileşimde bulunduysa müziği çalmayı dene
                if (userInteracted && isMusicPlaying) {
                    muzikPlayer.play().catch(error => {
                        console.log("Otomatik oynatma engellendi:", error);
                    });
                }
            } catch (e) {
                console.log("Müzik pozisyonu ayarlama hatası:", e);
            }
        });
        
        // Müzik durumunu localStorage'a kaydet
        localStorage.setItem('isMusicPlaying', 'true');
        
        // Müzik çalıyor mu durumunu kontrol et ve kaydet
        muzikPlayer.addEventListener('play', function() {
            localStorage.setItem('musicPlaying', 'true');
            console.log("Müzik çalmaya başladı, pozisyon:", muzikPlayer.currentTime);
            
            // Müzik çalmaya başladığında pozisyon kaydetmeyi başlat
            if (positionInterval) clearInterval(positionInterval);
            positionInterval = setInterval(saveMusicPosition, 500);
        });
        
        muzikPlayer.addEventListener('pause', function() {
            localStorage.setItem('musicPlaying', 'false');
            console.log("Müzik duraklatıldı, pozisyon:", muzikPlayer.currentTime);
            
            // Müzik durduğunda pozisyon kaydetmeyi durdur
            if (positionInterval) clearInterval(positionInterval);
            
            // Son pozisyonu kaydet
            saveMusicPosition();
        });
        
        // Müzik bittiğinde
        muzikPlayer.addEventListener('ended', function() {
            console.log("Müzik bitti");
            
            // Müzik bittiğinde pozisyon kaydetmeyi durdur
            if (positionInterval) clearInterval(positionInterval);
            
            // Pozisyonu sıfırla
            localStorage.setItem('lastMusicPosition', '0');
        });
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

// Müzik pozisyonunu kaydet
function saveMusicPosition() {
    if (muzikPlayer && !muzikPlayer.paused) {
        const currentPos = muzikPlayer.currentTime;
        if (!isNaN(currentPos) && currentPos > 0) {
            // Son bilinen pozisyonu kaydet
            localStorage.setItem('lastMusicPosition', currentPos);
            console.log("Son müzik pozisyonu kaydedildi:", currentPos);
        }
    }
}

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
        // Son bilinen pozisyonu kaydet
        localStorage.setItem('lastMusicPosition', muzikPlayer.currentTime);
        console.log("Sayfa kapatılırken son müzik pozisyonu kaydedildi:", muzikPlayer.currentTime);
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
