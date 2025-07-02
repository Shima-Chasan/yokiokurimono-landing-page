document.addEventListener('DOMContentLoaded', function() {
  // お知らせを表示する要素を取得
  const newsContainer = document.querySelector('#news-container');
  const noNewsMessage = document.querySelector('#no-news-message');
  const newsModal = document.querySelector('#news-modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalDate = document.querySelector('#modal-date');
  const modalContent = document.querySelector('#modal-content');
  const closeModalBtn = document.querySelector('#close-modal');
  
  if (!newsContainer) return;
  
  // お知らせ記事を取得する関数
  async function fetchNews() {
    try {
      // CMSで作成したサンプル記事を表示
      displayCmsNews();
    } catch (error) {
      console.error('お知らせの読み込みに失敗しました:', error);
    }
  }
  
  // CMSのお知らせ記事を表示する関数
  function displayCmsNews() {
    // CMSで作成したサンプル記事
    const cmsNews = [
      {
        title: "新サービス開始のお知らせ",
        date: "2025.07.01",
        summary: "この度、善き贈り物では新たなクラウドファンディング支援サービスを開始いたしました。",
        id: "cms-1",
        content: `
          <h2>新サービス開始のお知らせ</h2>
          
          <p>この度、善き贈り物では新たなクラウドファンディング支援サービスを開始いたしました。</p>
          
          <h3>主な特徴</h3>
          
          <ul>
            <li>専門スタッフによる伴走支援</li>
            <li>SNSを活用した未来のファンづくり</li>
            <li>運営代行サービス</li>
          </ul>
          
          <p>鹿児島の魅力を全国に発信するお手伝いをさせていただきます。詳しくはお問い合わせください。</p>
        `
      }
    ];
    
    // お知らせがあれば表示する
    if (cmsNews.length > 0) {
      // 「お知らせがありません」メッセージを非表示にする
      if (noNewsMessage) {
        noNewsMessage.style.display = 'none';
      }
      
      // お知らせをHTMLで生成
      let newsHtml = '';
      
      cmsNews.forEach(news => {
        newsHtml += `
          <div class="bg-white border-b border-gray-100 py-6 fade-in news-item cursor-pointer hover:bg-gray-50 transition-colors duration-200" data-news-id="${news.id}">
            <div class="flex flex-col md:flex-row md:items-center">
              <span class="text-amber-800 font-medium mb-2 md:mb-0 md:w-32">${news.date}</span>
              <div>
                <h3 class="text-lg font-medium">${news.title}</h3>
                <p class="text-gray-500 text-sm mt-1">${news.summary}</p>
              </div>
            </div>
          </div>
        `;
      });
      
      // お知らせを表示
      newsContainer.innerHTML = newsHtml;
      
      // お知らせをクリックしたときのイベントを設定
      const newsItems = document.querySelectorAll('.news-item');
      newsItems.forEach(item => {
        item.addEventListener('click', function() {
          const newsId = this.getAttribute('data-news-id');
          const newsItem = cmsNews.find(news => news.id === newsId);
          
          if (newsItem) {
            // モーダルに詳細を表示
            modalTitle.textContent = newsItem.title;
            modalDate.textContent = newsItem.date;
            modalContent.innerHTML = newsItem.content;
            
            // モーダルを表示
            newsModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // 背景のスクロールを無効化
          }
        });
      });
    }
  }
  
  // モーダルを閉じる処理
  if (closeModalBtn && newsModal) {
    // 閉じるボタンをクリックしたとき
    closeModalBtn.addEventListener('click', function() {
      newsModal.classList.add('hidden');
      document.body.style.overflow = ''; // 背景のスクロールを有効化
    });
    
    // モーダルの外側をクリックしたとき
    newsModal.addEventListener('click', function(e) {
      if (e.target === newsModal) {
        newsModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !newsModal.classList.contains('hidden')) {
        newsModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
  
  // お知らせを読み込む
  fetchNews();
});
