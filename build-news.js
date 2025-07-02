const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

// markedの設定をカスタマイズ
marked.setOptions({
  breaks: true, // 改行をbrタグに変換
  gfm: true,    // GitHub Flavored Markdownを有効化
  headerIds: true,
  mangle: false,
  sanitize: false // HTMLタグを許可（リンクなどのHTMLを有効にするため）
});

// _newsディレクトリのパス
const newsDir = path.join(__dirname, '_news');
// 出力先のJSONファイルパス
const outputFile = path.join(__dirname, 'news-data.json');

// Markdownファイルを読み込んでJSONに変換する関数
function buildNewsData() {
  try {
    // _newsディレクトリが存在するか確認
    if (!fs.existsSync(newsDir)) {
      console.error('_newsディレクトリが見つかりません');
      return;
    }

    // _newsディレクトリ内のすべてのMarkdownファイルを取得
    const files = fs.readdirSync(newsDir).filter(file => file.endsWith('.md'));
    
    // 各ファイルを処理
    const newsItems = files.map(file => {
      const filePath = path.join(newsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Front Matterとコンテンツを分離
      const { data, content } = matter(fileContent);
      
      // Markdownをパースしてコンテンツを生成
      const htmlContent = marked.parse(content);
      
      // リンクが正しく機能するようにする処理
      // (markedの設定だけでは不十分な場合の追加処理)
      
      // 日付をフォーマット
      const date = new Date(data.date);
      const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      
      // 要約を生成（最初の段落から取得）
      const summaryMatch = content.match(/\n([^\n#].+?)\n/);
      const summary = summaryMatch ? summaryMatch[1].trim() : '詳細はクリックして確認してください。';
      
      // ファイル名からIDを生成
      const id = file.replace(/\.md$/, '');
      
      return {
        title: data.title,
        date: formattedDate,
        summary: summary,
        id: id,
        content: htmlContent
      };
    });
    
    // 日付の新しい順にソート
    newsItems.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-'));
      const dateB = new Date(b.date.replace(/\./g, '-'));
      return dateB - dateA;
    });
    
    // JSONファイルに書き出し
    fs.writeFileSync(outputFile, JSON.stringify(newsItems, null, 2));
    console.log(`${newsItems.length}件のニュース記事をJSONに変換しました: ${outputFile}`);
    
  } catch (error) {
    console.error('ニュースデータの生成に失敗しました:', error);
  }
}

// 実行
buildNewsData();
