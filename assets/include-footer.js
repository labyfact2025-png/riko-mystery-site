/* 目的：フッターを挿入してから、共有ボタン（X / Instagram相当 / コピー）を配線する */
// 🚩ここから修正（全置換）
(async () => {
    const mount = document.getElementById('site-footer');
    if (!mount) return; // ページにフッター挿入先が無いときは何もしない

    // 1) フッターHTMLを読み込んで挿入
    try {
        const res = await fetch('assets/footer.html', { cache: 'no-store' });
        const html = await res.text();
        mount.innerHTML = html;
    } catch (e) {
        mount.innerHTML = '<div class="footer container"><p class="muted">フッターの読み込みに失敗しました。</p></div>';
        return;
    }

    // 2) 共有ボタンの配線（挿入“後”に実行）
    const pageUrl = location.href.split('#')[0];
    const shareText = '理工展の謎解きに参加しよう！';
    const hashtags = '理工展,謎解き';

    // X（Twitter）
    const x = document.getElementById('share-x');
    if (x) {
        const xUrl = new URL('https://twitter.com/intent/tweet');
        xUrl.searchParams.set('text', shareText);
        xUrl.searchParams.set('url', pageUrl);
        xUrl.searchParams.set('hashtags', hashtags);
        x.href = xUrl.toString();
    }

    // Instagram：Web共有URLが無いため、Web Share API → 非対応端末はコピーへ
    const nativeBtn = document.getElementById('share-native');
    const copyBtn = document.getElementById('share-copy');

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText} ${pageUrl}`);
            alert('リンクをコピーしました。Instagramアプリで貼り付けて共有してください。');
        } catch {
            prompt('共有に対応していないため、以下をコピーしてください：', `${shareText} ${pageUrl}`);
        }
    };

    if (nativeBtn) {
        nativeBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: document.title, text: shareText, url: pageUrl });
                } catch { /* キャンセル等は無視 */ }
            } else {
                copy();
            }
        });
    }
    if (copyBtn) copyBtn.addEventListener('click', copy);
})();
// 🚩ここまで修正