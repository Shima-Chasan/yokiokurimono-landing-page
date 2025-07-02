document.addEventListener('DOMContentLoaded', function() {
  // お知らせを表示する要素を取得
  const newsContainer = document.querySelector('#news-container');
  const noNewsMessage = document.querySelector('#no-news-message');
  
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
        id: "cms-1"
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
          <div class="bg-white border-b border-gray-100 py-6 fade-in news-item" data-news-id="${news.id}">
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
    }
  }
  
  // お知らせを読み込む
  fetchNews();
});
