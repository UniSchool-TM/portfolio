# TM Portfolio

映像クリエイター **TM**(UniSchool リーダー / 動画編集担当)のポートフォリオサイト。

**→ [https://unischool-tm.github.io/portfolio/](https://unischool-tm.github.io/portfolio/)**

企画から撮影・編集までを一人でこなす高校生クリエイター TM の活動を、制作事例・実績・SNS 投稿・所属団体の紹介としてまとめた1ページ構成のサイトです。

## サイトの内容

| Section | 内容 |
| --- | --- |
| `>_ About` | 恐竜ブログから始まり、SNS発信を経て映像へ至るまでのストーリーとタイムライン(JHS〜NOW) |
| `>_ Works` | UniSchool としての映像制作事例。Google Drive 埋め込みで視聴可能(随時追加予定) |
| `>_ Posts` | Instagram [@unischool_tm](https://www.instagram.com/unischool_tm/) の最新投稿を自動表示(`posts.json` を読み込んで描画) |
| `>_ Achievements` | Suno AI × LoFi チャンネルの収益化達成 / YouTube・Instagram 制作案件の受注 / 三田学園 PR 映像が劇場版名探偵コナンの上映前 CM として放映 |
| `>_ Organization` | 所属する学生事業グループ [UniSchool](https://unischool.jp/) の紹介(リーダー / 動画編集担当) |
| `>_ Skills` | 使用ツール: Premiere Pro / Photoshop / Canva Pro |
| `>_ Contact` | 映像制作・SNS 案件の問い合わせ(メール / Instagram) |

## デザインと実装

- プリローダー(液体アニメーション)、カスタムカーソル、巨大タイポグラフィ、マーキー、フルスクリーンメニューを備えたデザイン
- フレームワーク非依存の素の HTML / CSS / JavaScript 構成。スクロール連動のリビール演出は IntersectionObserver で実装
- Instagram 投稿は `posts.json` 経由で取得し、更新があればサイトに自動反映

## ファイル構成

```
portfolio/
├── index.html      # ページ本体(セクション定義・作品埋め込み)
├── style.css       # デザイン(ローダー・カーソル・各セクション)
├── script.js       # ローディング・スクロールアニメーション・メニュー開閉・投稿描画
├── posts.json      # Instagram 投稿データ(自動更新)
└── README.md
```
