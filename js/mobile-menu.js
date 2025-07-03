document.addEventListener('DOMContentLoaded', function() {
  // モバイルメニュー関連の要素を取得
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  // 要素が存在するか確認
  if (!mobileMenuButton || !mobileMenu) return;
  
  // メニューの開閉状態
  let isMenuOpen = false;
  
  // メニューを開く関数
  function openMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenuButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
    isMenuOpen = true;
  }
  
  // メニューを閉じる関数
  function closeMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenuButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    `;
    isMenuOpen = false;
  }
  
  // メニューボタンのクリックイベント
  mobileMenuButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // メニュー内のリンクがクリックされたらメニューを閉じる
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // メニュー外をクリックしたらメニューを閉じる
  document.addEventListener('click', function(e) {
    if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== mobileMenuButton) {
      closeMenu();
    }
  });
  
  // ウィンドウのリサイズ時にメニューを閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && isMenuOpen) {
      closeMenu();
    }
  });
  
  console.log('モバイルメニューの初期化が完了しました');
});
