# 1615 — The Summer Siege of Osaka（1人用ズームツアー）

大坂夏の陣の14武将サマリーをもとにした、1人で見られるソロ・ウォークスルー型ツアーです。
Controller/Viewer方式ではなく、ゲスト自身が画面をタップ/スワイプして進める形式です。

## 現在の状態
- 全10章のテキスト・タイトル・画像（PDFからの切り出し）・Ken Burnsズーム演出を実装済み
- 音声は `public/audio/大阪城ツアー1.mp3` 〜 `10.mp3` を参照する設計（未配置 — 既存の音声ファイルをこのフォルダにコピーする必要あり）
- 音声が無い章は自動的に「No narration for this scene yet」と表示され、アプリはクラッシュしない

## 音声ファイルの追加方法
`public/audio/` フォルダに、既存の以下のファイルをそのままの名前でコピーしてください：
```
大阪城ツアー1.mp3
大阪城ツアー2.mp3
...
大阪城ツアー10.mp3
```

## 画像素材について
現在は提供されたPDF（大阪城ツアー総合.pdf）から切り出した10枚のスクリーンショット画像を使用しています。
高画質の元画像（jpg/png）をお持ちになった際は、public/slides/slide_01.png 〜 slide_10.png を差し替えるだけで反映されます。

## デザインコンセプト
- 徳川（紺 #1a2332）と豊臣（赤 #7a1f2b）、金（#c9a35c）を基調にした戦国ドキュメンタリー調
- 見出しはCinzel（重厚なセリフ体）、本文はCormorant Garamond（イタリック）
- 各章でゆっくりと画像がズーム/パンする演出（Ken Burns効果）
- スワイプ・矢印タップ・進行ドットのクリックで章を移動可能

## ローカルでの確認方法
```
npm install
npm run dev
```

## Vercelへのデプロイ
1. このフォルダをGitHubリポジトリにpush（例: osaka-summer-siege-tour）
2. Vercelで新規プロジェクトとしてインポート（Framework: Vite、Build Command: npm run build、Output Directory: dist）
3. デプロイ後、public/audio/ に音声を追加して再デプロイすれば完成

## 次のステップ（保留中）
- 音声ファイルの配置（外出先から戻り次第）
- 高画質スライド画像への差し替え（お持ちであれば）
- GitHubリポジトリ作成 → Vercelデプロイ
