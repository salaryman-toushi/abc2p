# 免責事項 Disclaimer
このプログラムの利用によるいかなる結果に対しても当方は責任を負いません。ご利用は自己責任でお願いします。<br>
I cannot guarantee any result from these programs. You will need to take full responsibility for your action.

# abc2p
abc2pは仮想通貨自動買付プログラムです。このプログラムを使用することで仮想通貨を毎日自動的に購入することができます。<br>
abc2p is Automatic Buying Crypto Currency Programs. You can buy crypto currency everyday automatically with these programs.

# 環境構築 Set up
## Node.js
Node.jsをインストールします。<br>
Install "Node.js".

## npm init
作業フォルダにて以下コマンドを実行し、全部エンターします。<br>
In your working directory, execute command bellow and press enter all.
<pre>
npm init
</pre>

## ccxt
npmパッケージのccxtをインストールします。具体的には、作業フォルダにて以下コマンドを実行します。<br>
Install ccxt of npm package. In your working directory, execute command bellow.
<pre>
npm install ccxt --save
</pre>

## abc2p
このレポジトリを作業フォルダにクローンします。<br>
Clone this repository to working directory.

# 設定 Configuration
## config_dummy.jsonのリネーム Rename config_dummy.json
config_dummy.jsonをconfig.jsonにリネームします。<br>
Rename "config_dummy.json" to "config.json".

## config.jsonの内容を適切に修正 Modify the contents of "config.json"
### API情報の記入
取引所で取得したAPIの情報を設定してください。この情報は、決して、第三者に渡してはいけません。

### 各取引所毎の積立金額、積立対象通貨毎の比率の記入
#### 金額
金額は、年間購入金額をJPYで整数値で入力してください。例えば月々1万円の積立をしたい場合は120000と設定する必要があります。

#### 比率
取引所内での各通貨毎の積立比率は%で整数値で入力してください。例えば半分をBTC、残り半分をETH等にしたい場合は、それぞれの箇所へ50と設定する必要があります。

# 実行
以下コマンドを実行することで、積立が開始します。何もしない場合、24時間毎に自動的な買付けが永続的に実行されます。停止させるには、コマンドラインから「Ctrl」+「C」を入力する等して、強制的に停止してください。
<pre>
node abc2p-jp-zaif.js
</pre>
