document.addEventListener('DOMContentLoaded', function() {
  // お知らせを表示する要素を取得
  const newsContainer = document.querySelector('#news-container');
  
  if (!newsContainer) return;
  
  // お知らせ記事を取得する関数
  async function fetchNews() {
    try {
      // _newsディレクトリ内のMarkdownファイル一覧を取得
      const response = await fetch('/admin/config.yml');
      if (!response.ok) throw new Error('設定ファイルの読み込みに失敗しました');
      
      // サンプルのお知らせ記事を表示（実際の環境では動的に読み込む）
      displaySampleNews();
      
    } catch (error) {
      console.error('お知らせの読み込みに失敗しました:', error);
      // エラー時もサンプル記事を表示
      displaySampleNews();
    }
  }
  
  // サンプルのお知らせ記事を表示する関数
  function displaySampleNews() {
    // CMSで作成したサンプル記事
    const cmsNews = {
      title: "新サービス開始のお知らせ",
      date: "2025.07.01",
      summary: "この度、善き贈り物では新たなクラウドファンディング支援サービスを開始いたしました。",
      id: "cms-1"
    };
    
    // 既存のお知らせ記事の前にCMSのお知らせを挿入
    const newsHtml = `
      <div class="bg-white border-b border-gray-100 py-6 fade-in news-item" data-news-id="${cmsNews.id}">
        <div class="flex flex-col md:flex-row md:items-center">
          <span class="text-amber-800 font-medium mb-2 md:mb-0 md:w-32">${cmsNews.date}</span>
          <div>
            <h3 class="text-lg font-medium">${cmsNews.title}</h3>
            <p class="text-gray-500 text-sm mt-1">${cmsNews.summary}</p>
          </div>
        </div>
      </div>
    `;
    
    // 既存のお知らせの先頭に挿入
    const firstNewsItem = newsContainer.querySelector('.news-item');
    if (firstNewsItem) {
      firstNewsItem.insertAdjacentHTML('beforebegin', newsHtml);
    } else {
      newsContainer.innerHTML = newsHtml;
    }
  }
  
  // お知らせを読み込む
  fetchNews();
});
