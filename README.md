# README

表組みの高さを拡大・縮小するIllustrator用スクリプトです。

<div class="fig center" style="margin-bottom: 20px;"><img src="https://www.graphicartsunit.com/saucer/images/scale_the_height_of_the_table/cover.png" alt="イメージ" class="noshadow"></div>

-----

### 更新履歴

* **0.5.0：新規作成**

-----

### 検証バージョン

* Illustrator 2021（25.0）

-----

### ダウンロード

* [スクリプトをダウンロードする](https://github.com/gau/scale_the_height_of_the_table/archive/master.zip)

-----

### インストール方法

1. ダウンロードしたファイルを解凍します。
2. 以下の場所に、「テーブルの高さを拡大・縮小.jsx」をコピーします。Windows版ではお使いのIllustratorのモードによって保存する場所が異なりますのでご注意ください。
3. Illustratorを再起動します。
4. “ファイル”メニュー→“スクリプト”に“テーブルの高さを拡大・縮小”と表示されていればインストール成功です。

#### ファイルをコピーする場所

| OS | バージョン | フォルダの場所 |
|:-----|:-----|:-----|
| Mac | 全 | /Applications/Adobe Illustrator *(ver)*/Presets/ja_JP/スクリプト/ |
| 32bit Win | CS5まで | C:\Program Files\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS5, CS6（32bit版） | C:\Program Files (x86)\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS6（64bit版）以降 | C:\Program Files\Adobe\Adobe Illustrator *(ver)* (64 Bit)\Presets\ja_JP\スクリプト\ |

* *(ver)*にはお使いのIllustratorのバージョンが入ります

-----

### スクリプトでできること

<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/scale_the_height_of_the_table/step1.png" alt="使い方" class="noshadow"></div>

Illustratorで作った表組みは、高さの調整が面倒です。このスクリプトを使うと、文字以外のオブジェクトだけの高さを拡大・縮小できます。文字は実行前の相対的な位置を保ちながら、適切な座標に調整されます。

-----

### 使い方

<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/scale_the_height_of_the_table/step2.png" alt="使い方" class="noshadow"></div>

表組みのオブジェクトをすべて選択したあと、スクリプトを実行します。［比率］で元の高さに対する比率を指定し、［モード］（後述）を選んで［実行］をクリックすれば、いい感じに表組みの高さを調整できます。

-----

### モードについて

<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/scale_the_height_of_the_table/step3.png" alt="モードについて" class="noshadow"></div>

Illustratorで表組みするときの代表的な手法として、主に「ひとつずつバラバラの文字オブジェクトで作成する場合」と「一列をひとつの文字オブジェクトにして改行で列を作る場合」の2種類があります。本スクリプトでは、前者を［単行モード］、後者を［複数行モード］と呼び、それぞれに合ったモードを切り替えて実行します。適切なモードで実行することで、文字の位置をなるべく崩さずに拡大・縮小ができます。

* 分かりづらいときは、実際にモードを切り替えてみてプレビューでいい感じになる方を選択すればOKです。

-----

### 文字以外の比率を固定する

<div class="fig center"><img src="https://www.graphicartsunit.com/saucer/images/scale_the_height_of_the_table/step4.png" alt="文字以外の比率の固定" class="noshadow"></div>

本スクリプトは、文字（ポイント文字、エリア内文字）以外のオブジェクトの高さを拡大・縮小します。表組みの中に変形させたくないアートワークが含まれているときは、それらをひとつずつグループ化、またはシンボル化した上で、「no-scale」という名前のレイヤーに移動させておきます。こうすることで、文字と同様に拡大・縮小の影響を受けなくなります。

* 複数オブジェクトで構成されるアートワークは、グループ化、またはシンボル化していないと配置が崩れてしまうことがあるので注意しましょう

-----

### その他

* 表の構造によっては希望した結果にならない場合があります。
* 行送りやベースラインシフトの値が変更されることがあります。

-----

### 免責事項

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* バージョン2021で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

-----

### ライセンス

* 不要オブジェクトを削除.jsx
* Copyright (c) 2020 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* Created by Toshiyuki Takahashi ([Graphic Arts Unit](http://www.graphicartsunit.com/))
* [Twitter](https://twitter.com/gautt)