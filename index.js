const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox_img');
const lightboxClose = lightbox.querySelector('.lightbox_close');

document.querySelectorAll('.ba_img img').forEach((img) => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.remove('qr-mode');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

const LINE_URL = 'https://line.me/R/ti/p/@482nhzmj?ts=04221619&oat_content=url';

document.querySelectorAll('.line_btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        lightboxImg.src = './img/lineQR.png';
        lightboxImg.alt = 'LINE QRコード';
        lightbox.classList.add('open', 'qr-mode');
        document.body.style.overflow = 'hidden';
    });
});

lightboxImg.addEventListener('click', () => {
    if (lightbox.classList.contains('qr-mode')) {
        window.open(LINE_URL, '_blank');
    }
});

function closeLightbox() {
    lightbox.classList.remove('open', 'qr-mode');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

const eventGrid = document.querySelector('.event_grid');
const eventMore = document.querySelector('.event_more');

if (eventGrid && eventMore) {
    const STEP = 4;
    const cards = Array.from(eventGrid.querySelectorAll('.event_card'));
    let visible = STEP;

    function renderCards() {
        cards.forEach((card, i) => {
            card.classList.toggle('is-hidden', i >= visible);
        });
        const allShown = visible >= cards.length;
        eventMore.textContent = allShown ? '閉じる' : 'もっと見る';
        eventMore.setAttribute('aria-expanded', String(allShown));
    }

    eventMore.addEventListener('click', () => {
        if (visible >= cards.length) {
            visible = STEP;
            eventGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            visible += STEP;
        }
        renderCards();
    });

    renderCards();
}

/* ===== SIGNATURE オートスライド ===== */
const sigTrack = document.querySelector('.sig_track');

if (sigTrack) {
    const INTERVAL = 3000;
    let timer = null;
    let paused = false;
    let isDragging = false;

    // 両端の余白は CSS の .sig_track::before / ::after で中央寄せを担保する

    function nextSlide() {
        const card = sigTrack.querySelector('.sig_card');
        if (!card) return;
        const step = card.offsetWidth + 16; // カード幅 + gap
        const maxScroll = sigTrack.scrollWidth - sigTrack.clientWidth;
        if (sigTrack.scrollLeft >= maxScroll - 2) {
            sigTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            sigTrack.scrollBy({ left: step, behavior: 'smooth' });
        }
    }

    function start() {
        if (timer) return;
        timer = setInterval(() => {
            if (!paused && !isDragging) nextSlide();
        }, INTERVAL);
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    // ホバー / タッチで一時停止
    sigTrack.addEventListener('mouseenter', () => { paused = true; });
    sigTrack.addEventListener('mouseleave', () => { paused = false; });
    sigTrack.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    sigTrack.addEventListener('touchend', () => { paused = false; });

    // ドラッグで左右スクロール
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    sigTrack.addEventListener('pointerdown', (e) => {
        isDragging = true;
        moved = false;
        startX = e.clientX;
        startScroll = sigTrack.scrollLeft;
        sigTrack.style.scrollSnapType = 'none';
        sigTrack.classList.add('dragging');
        sigTrack.setPointerCapture(e.pointerId);
    });

    sigTrack.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        sigTrack.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        sigTrack.classList.remove('dragging');
        sigTrack.style.scrollSnapType = '';
        try { sigTrack.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    sigTrack.addEventListener('pointerup', endDrag);
    sigTrack.addEventListener('pointercancel', endDrag);

    // ドラッグ後のクリック誤作動を防止
    sigTrack.addEventListener('click', (e) => {
        if (moved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    start();
}

document.querySelectorAll('.faq_item').forEach((item) => {
    const btn = item.querySelector('.faq_q');
    const answer = item.querySelector('.faq_a');

    btn.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '';
    });
});
