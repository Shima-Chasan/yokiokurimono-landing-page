document.addEventListener('DOMContentLoaded', function() {
  // お知らせを表示する要素を取得
  const newsContainer = document.querySelector('#news-container');
  const noNewsMessage = document.querySelector('#no-news-message');
  const newsModal = document.querySelector('#news-modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalDate = document.querySelector('#modal-date');
  const modalContent = document.querySelector('#modal-content');
  const closeModalBtn = document.querySelector('#close-modal');
  const loadMoreContainer = document.querySelector('#load-more-container');
  const loadMoreButton = document.querySelector('#load-more-button');
  
  // 前回の記事数を記録する変数
  let previousNewsCount = 0;
  // 最後に表示した記事のIDを記録
  let lastDisplayedNewsIds = [];
  // 記事データを保持する変数
  let newsData = [];
  // 現在表示している記事の数
  let currentDisplayCount = 3;
  // 1ページあたりの記事数
  const newsPerPage = 3;
  
  if (!newsContainer) return;
  
  // お知らせ記事を取得する関数
  async function fetchNews(isInitialLoad = false) {
    try {
      // 実際の環境では、ここでCMSの記事を取得するリクエストを行う
      // 例: const response = await fetch('/api/news');
      // const data = await response.json();
      
      // デモ用にサンプルデータを生成
      const data = await getNewsData();
      
      // 新しい記事があるかチェック
      const hasNewContent = checkForNewContent(data);
      
      if (hasNewContent) {
        // 新しい記事があれば表示を更新
        const oldNewsCount = newsData.length;
        newsData = data;
        displayCmsNews(newsData);
        
        // 初回読み込みでない場合、かつ記事数が増えている場合は通知を表示
        if (!isInitialLoad && data.length > oldNewsCount) {
          const newItemsCount = data.length - oldNewsCount;
          showNotification(`新しいお知らせが${newItemsCount}件追加されました`);
          
          // 新しい記事をハイライト表示
          highlightNewItems(data, oldNewsCount);
        }
      }
    } catch (error) {
      console.error('お知らせの読み込みに失敗しました:', error);
    }
  }
  
  // 新しい記事をハイライト表示する関数
  function highlightNewItems(data, oldCount) {
    // 日付でソートして新しい順に並べ替え
    const sortedNews = [...data].sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-'));
      const dateB = new Date(b.date.replace(/\./g, '-'));
      return dateB - dateA; // 降順（新しい順）
    });
    
    // 新しい記事の数だけ、先頭からハイライト表示
    const newItemsCount = data.length - oldCount;
    
    // 少し遅延させてハイライト表示（DOMが更新されるのを待つ）
    setTimeout(() => {
      const newsItems = document.querySelectorAll('.news-item');
      
      // 新しい記事の数だけ、先頭からハイライト表示
      for (let i = 0; i < Math.min(newItemsCount, newsItems.length); i++) {
        newsItems[i].classList.add('bg-yellow-50');
        newsItems[i].classList.add('border-l-4');
        newsItems[i].classList.add('border-amber-500');
        newsItems[i].classList.add('pl-2');
        
        // 5秒後にハイライトを消す
        setTimeout(() => {
          newsItems[i].classList.remove('bg-yellow-50');
          newsItems[i].classList.remove('border-l-4');
          newsItems[i].classList.remove('border-amber-500');
          newsItems[i].classList.remove('pl-2');
          newsItems[i].classList.add('transition-all');
          newsItems[i].classList.add('duration-1000');
        }, 5000);
      }
    }, 100);
  }
  
  // CMSの記事データを取得する関数
  async function getNewsData() {
    try {
      console.log('ニュースデータを取得中...');
      
      // 生成されたJSONファイルからニュース記事を読み込む
      const response = await fetch('/news-data.json');
      
      if (!response.ok) {
        throw new Error('JSONファイルの読み込みに失敗しました');
      }
      
      const newsItems = await response.json();
      console.log('ニュースデータを取得しました:', newsItems.length, '件');
      return newsItems;
      
    } catch (error) {
      console.error('ニュースデータの取得に失敗しました:', error);
      
      // エラー時はサンプルデータを返す
      return [
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
    }
  }
  
  // Markdown形式のニュース記事をパースする関数
  function parseMarkdownNews(markdown, filename) {
    try {
      // ファイル名からIDを生成
      const id = filename.replace(/\.md$/, '');
      
      // Front Matterを抽出
      const frontMatterRegex = /---\n([\s\S]*?)\n---\n([\s\S]*)/;
      const match = markdown.match(frontMatterRegex);
      
      if (!match) {
        console.error('正しい形式のFront Matterが見つかりません:', filename);
        return null;
      }
      
      const frontMatter = match[1];
      const content = match[2];
      
      // Front Matterからタイトルと日付を抽出
      const titleMatch = frontMatter.match(/title:\s*(.+)/);
      const dateMatch = frontMatter.match(/date:\s*(.+)/);
      
      if (!titleMatch || !dateMatch) {
        console.error('タイトルまたは日付が見つかりません:', filename);
        return null;
      }
      
      const title = titleMatch[1].trim();
      const dateStr = dateMatch[1].trim();
      
      // 日付をフォーマット変換
      const date = formatDate(dateStr);
      
      // 要約を生成（最初の段落から取得）
      const summaryMatch = content.match(/\n([^\n#].+?)\n/);
      const summary = summaryMatch ? summaryMatch[1].trim() : '詳細はクリックして確認してください。';
      
      // MarkdownをHTMLに変換
      const htmlContent = markdownToHtml(content);
      
      return {
        title,
        date,
        summary,
        id,
        content: htmlContent
      };
    } catch (error) {
      console.error('マークダウンのパースに失敗しました:', error);
      return null;
    }
  }
  
  // 日付をフォーマットする関数
  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (error) {
      console.error('日付のフォーマットに失敗しました:', dateStr);
      return dateStr; // 元の形式を返す
    }
  }
  
  // 簡易的なMarkdownをHTMLに変換する関数
  function markdownToHtml(markdown) {
    let html = markdown
      // 見出し変換
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      
      // リスト変換
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      
      // リストをulタグで囲む
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      
      // 段落変換（見出しやリスト以外のテキスト行）
      .replace(/^([^<\n].+)$/gm, '<p>$1</p>')
      
      // リンク変換
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-800 hover:underline">$1</a>')
      
      // 空行を除去
      .replace(/<p>\s*<\/p>/g, '');
    
    return html;
  }
  
  // 新しい記事があるかチェックする関数
  function checkForNewContent(newData) {
    // 記事数が変わった場合
    if (newData.length !== previousNewsCount) {
      previousNewsCount = newData.length;
      return true;
    }
    
    // 記事のIDを比較して変更があるかチェック
    const currentIds = newData.map(item => item.id).sort().join(',');
    const previousIds = lastDisplayedNewsIds.sort().join(',');
    
    if (currentIds !== previousIds) {
      lastDisplayedNewsIds = newData.map(item => item.id);
      return true;
    }
    
    return false;
  }
  
  // CMSのお知らせ記事を表示する関数
  function displayCmsNews(cmsNews = null) {
    // 引数が指定されていない場合は、デフォルトのデータを使用
    if (!cmsNews) {
      cmsNews = newsData.length > 0 ? newsData : [
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
    }
    
    // 表示する前に最新の記事データを保存
    newsData = cmsNews;
    lastDisplayedNewsIds = cmsNews.map(item => item.id);
    previousNewsCount = cmsNews.length;
    
    // お知らせがあれば表示する
    if (cmsNews.length > 0) {
      // 「お知らせがありません」メッセージを非表示にする
      if (noNewsMessage) {
        noNewsMessage.style.display = 'none';
      }
      
      // お知らせをHTMLで生成
      let newsHtml = '';
      
      // 日付でソートして新しい順に表示
      const sortedNews = [...cmsNews].sort((a, b) => {
        const dateA = new Date(a.date.replace(/\./g, '-'));
        const dateB = new Date(b.date.replace(/\./g, '-'));
        return dateB - dateA; // 降順（新しい順）
      });
      
      // 表示する記事数を制限
      const newsToDisplay = sortedNews.slice(0, currentDisplayCount);
      
      // 「過去のお知らせを見る」ボタンの表示制御
      if (loadMoreContainer) {
        if (sortedNews.length > currentDisplayCount) {
          loadMoreContainer.style.display = 'block';
        } else {
          loadMoreContainer.style.display = 'none';
        }
      }
      
      newsToDisplay.forEach(news => {
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
    } else {
      // お知らせがない場合
      if (noNewsMessage) {
        noNewsMessage.style.display = 'block';
      }
      newsContainer.innerHTML = '';
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
  
  // お知らせを読み込む（初回読み込みなので通知は表示しない）
  fetchNews(true);
  
  // 定期的に更新をチェックする機能
  // デフォルトは30秒ごとにチェック
  const AUTO_REFRESH_INTERVAL = 30000; // 30秒
  
  // 自動更新を開始する関数
  function startAutoRefresh() {
    // 定期的に更新をチェック
    setInterval(async () => {
      console.log('お知らせの更新をチェックしています...');
      await fetchNews();
    }, AUTO_REFRESH_INTERVAL);
  }
  
  // 「過去のお知らせを見る」ボタンのクリックイベントを設定
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function() {
      // 表示件数を増やす
      currentDisplayCount += newsPerPage;
      
      // 記事を再表示
      displayCmsNews(newsData);
      
      // スクロールアニメーション（新しく表示された最初の記事へ）
      const newsItems = document.querySelectorAll('.news-item');
      if (newsItems.length > 0 && newsItems.length >= (currentDisplayCount - newsPerPage)) {
        const targetElement = newsItems[currentDisplayCount - newsPerPage];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
  
  // 自動更新を開始
  startAutoRefresh();
  
  // 新しいお知らせがあるときに通知を表示する関数
  function showNotification(message) {
    // 通知がサポートされているかチェック
    if (!('Notification' in window)) {
      console.log('このブラウザは通知をサポートしていません');
      return;
    }
    
    // 通知の権限がすでに付与されている場合
    if (Notification.permission === 'granted') {
      new Notification('善き贈り物からのお知らせ', {
        body: message,
        icon: '/images/logo.png'
      });
    }
    // 通知の権限がまだ決定されていない場合
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('善き贈り物からのお知らせ', {
            body: message,
            icon: '/images/logo.png'
          });
        }
      });
    }
  }
});
