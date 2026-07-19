# TM ポートフォリオサイト

## GitHub Pagesでの公開手順

1. GitHubで新しいリポジトリを作成（例: `tm-portfolio`）
2. このフォルダの中身（`index.html` / `style.css` / `script.js` / `assets/`）をすべてリポジトリのルートにアップロード
3. リポジトリの **Settings → Pages** を開く
4. "Branch" を `main`（または公開したいブランチ）、フォルダを `/ (root)` に設定して Save
5. 数分待つと `https://ユーザー名.github.io/リポジトリ名/` で公開されます
6. 公開をやめたい時は Settings → Pages で "None" に戻すか、リポジトリを非公開にしてください

## 公開前に必ず確認すること

- [ ] `index.html` 内の `contact@example.com` を、実際に使う問い合わせ用メールアドレスに置き換える（2箇所あります）
- [ ] Google Driveの動画2本の共有設定が **「リンクを知っている全員が閲覧可」** になっているか確認する（そうでないと埋め込みが再生されません）
- [ ] `assets/hero.jpg` の顔・服装などが公開して問題ないか、本人と確認する
- [ ] `works` セクションの動画タイトル・説明文（現在は仮テキスト）を、実際の内容に合わせて編集する

## ファイル構成

```
portfolio/
├── index.html      # ページ本体
├── style.css       # デザイン
├── script.js       # スクロールアニメーション・メニュー開閉
├── assets/
│   └── hero.jpg    # トップの写真
└── README.md
```
