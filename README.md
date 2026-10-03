# TM Portfolio

映像クリエイター **TM**(UniSchool リーダー / 動画編集担当)のポートフォリオサイト。

**→ [https://tm.unischool.jp/](https://tm.unischool.jp/)**

企画から撮影・編集までを一人でこなす高校生クリエイター TM の活動を、制作事例・実績・SNS 投稿・所属団体の紹介としてまとめた1ページ構成のサイトです。

## サイトの内容

| Section | 内容 |
| --- | --- |
| `>_ About` | 恐竜ブログから始まり、SNS発信を経て映像へ至るまでのストーリーとタイムライン(JHS〜NOW) |
| `>_ Works` | UniSchool としての映像制作事例。Google Drive 埋め込みで視聴可能(随時追加予定) |
| `>_ Posts` | Instagram [@unischool_tm](https://www.instagram.com/unischool_tm/) の投稿を表示(画像は `posts/` に保存し `posts.json` から描画) |
| `>_ Achievements` | Suno AI × LoFi チャンネルの収益化達成 / YouTube・Instagram 制作案件の受注 / 三田学園 PR 映像が劇場版名探偵コナンの上映前 CM として放映 |
| `>_ Organization` | 所属する学生事業グループ [UniSchool](https://unischool.jp/) の紹介(リーダー / 動画編集担当) |
| `>_ Skills` | 使用ツール: Premiere Pro / Photoshop / Canva Pro |
| `>_ Contact` | 映像制作・SNS 案件の問い合わせ(メール / Instagram) |

### 制作事例の詳細ページ

| Page | 内容 |
| --- | --- |
| [`/work-01`](https://tm.unischool.jp/work-01) | 学内活動「ラーニングコンパス」の記録映像。生徒と先生の話し合いから校長先生へのインタビュー |
| [`/work-02`](https://tm.unischool.jp/work-02) | 三田学園の広報 PR 映像。劇場版名探偵コナンの上映前 CM として映画館で放映 |

## デザインと実装

- プリローダー(液体アニメーション)、カスタムカーソル、巨大タイポグラフィ、マーキー、フルスクリーンメニューを備えたデザイン
- フレームワーク非依存の素の HTML / CSS / JavaScript 構成。スクロール連動のリビール演出は IntersectionObserver で実装
- Instagram 投稿の画像は `posts/` に保存し、`posts.json` から描画している。Instagram の画像 URL は署名付きで数週間で期限切れになるため、ローカル保存を採っている
- 投稿の更新は手動。`posts/` に画像を追加し、`posts.json` の `posts` 配列先頭にレコードを挿入する（`image` は `posts/xxx.jpg` 形式）
- SEO は OGP / Twitter Card / JSON-LD(`Person`・`CreativeWork`) / canonical / sitemap で整備。スクリーンショット時の見栄えは `og-image.png` で指定

## 公開・配信の仕組み

```
tm.unischool.jp  →  Cloudflare(DNS + プロキシ)  →  unischool-tm.github.io/portfolio  →  GitHub Pages
```

- **配信元**: GitHub Pages(`main` ブランチの `/` をルートとしてビルド)。`main` へ push すると自動反映
- **独自ドメイン**: Cloudflare 側で `tm.unischool.jp` の A レコードがプロキシ指向。GitHub Pages 側には `CNAME` を登録していない
- **clean URL**: Cloudflare のリダイレクトルールにより `/work-01.html` → `/work-01` へ 308 転送される。サイト内のリンクと canonical は拡張子なしの `/work-01` を指している
- **robots.txt**: Cloudflare のメール難読化（`__cf_email__`)が有効化されているため、`mailto:` は JS 無効時に読めない

## ファイル構成

```
portfolio/
├── index.html      # ページ本体(セクション定義・作品埋め込み)
├── work-01.html    # 制作事例 01(ラーニングコンパス記録映像)
├── work-02.html    # 制作事例 02(三田学園 PR 映像)
├── style.css       # デザイン(ローダー・カーソル・各セクション)
├── script.js       # ローディング・スクロールアニメーション・メニュー開閉・投稿描画
├── posts.json      # Instagram 投稿データ(手動更新)
├── posts/          # Instagram 投稿画像のローカル保存先
├── og-image.png    # OGP / Twitter Card 用画像
├── sitemap.xml     # 検索エンジンへのページ一覧
├── robots.txt      # クローラー設定
├── 404.html        # カスタム 404
└── README.md
```
