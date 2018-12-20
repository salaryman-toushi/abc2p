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

### API情報の記入 Setting API key and secret
取引所で取得したAPIの情報を設定してください。この情報は、決して、第三者に渡してはいけません。
Put API key and secret of exchange in "config.json". Never disclose API key and secret to others.

### 各取引所毎の積立金額、積立対象通貨毎の比率の記入 Periodic buying rate and ratio settings

#### 例 Example
ひと月当り4万円(=1年あたり48万円)、BTCに33%、ETHに33%、XEMに34%の積立の場合以下の通り。
In case of periodic buying at rate of 40,000 JPY/per month (= 480,000 JPY/per year), in ratio of BTC:33%, ETH:33% and XEM:34%.
<pre>
"tsumitate": {
  "per_year": 480000,
  "ratio": {
    "btc": 33,
    "eth": 33,
    "xem": 34,
    "mona": 0,
    "bch": 0
  },
  "interval": 5000
}
</pre>

# 実行
以下コマンドを実行することで、積立が開始します。何もしない場合、24時間毎に自動的な買付けが永続的に実行されます。停止させるには、コマンドラインから「Ctrl」+「C」を入力する等して、強制的に停止してください。
Execute bellow comand. Then, it makes periodic buying orders every day automatically. If you want to stop the program, Press "Ctrl" + "C".
<pre>
node abc2p-jp-zaif.js
</pre>
