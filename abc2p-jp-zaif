'use strict';

//定義
const ccxt = require ('ccxt');//npmパッケージのccxtを読み込み
var config = require ("./config.json");//設定情報の読み込み
const zaif = new ccxt.zaif ({
        apiKey: config.zaif.api.key,
        secret: config.zaif.api.secret,
    })//ccxtにconfigの中のapikey, secretの値を渡す
const money_per_day = config.zaif.tsumitate.per_year / 365//年間365日毎日積立

//ここの割合を変えれば、各通貨の積立割合を変えられる
const btc_ratio = config.zaif.tsumitate.ratio.btc //%
const eth_ratio = config.zaif.tsumitate.ratio.eth //%
const xem_ratio = config.zaif.tsumitate.ratio.xem //%
const mona_ratio = config.zaif.tsumitate.ratio.mona //% MONA購入は現在Zaifでは不可能なためデフォルト0%設定
const bch_ratio = config.zaif.tsumitate.ratio.bch //% BCH購入はハッシュウォーの経緯等リスクを感じるためデフォルト0%設定

//各通貨の1日当りの購入金額の計算と端数の処理
const money_per_day_btc = money_per_day * btc_ratio / 100
const money_per_day_eth = money_per_day * eth_ratio / 100
const money_per_day_xem = money_per_day * xem_ratio / 100
const money_per_day_mona = money_per_day * mona_ratio / 100
const money_per_day_bch = money_per_day * bch_ratio / 100

//積立間隔をミリ秒で設定する　例えば1日なら 24 * 60 * 60 * 1000
const interval = 24 * 60 * 60 * 1000

//次回積立タイミングまで待機する関数の定義
const sleep = (timer) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timer)
    })
}

//ここからプログラム本体(同期、非同期を考慮した記述)
(async function () {
    //常に繰り返し→明示的にキルしない限り実行され続ける
    while (true) {
        //板情報取得
        const ticker_btc = await zaif.fetchTicker ('BTC/JPY')
        const ticker_eth = await zaif.fetchTicker ('ETH/JPY')
        const ticker_xem = await zaif.fetchTicker ('XEM/JPY')
        const ticker_mona = await zaif.fetchTicker ('MONA/JPY')
        const ticker_bch = await zaif.fetchTicker ('BCH/JPY')
        
        //makerのほうが手数料有利のため、ベストaskより最小刻み幅分安い価格を指定
        //価格刻み最小幅はZaifではBTCは5JPY、XEMは0.0001JPY、ETHは5JPY、MONAは0.1JPY、BCHは5JPY
        const ask_btc_maker = Math.round(ticker_btc.ask - 5)
        const ask_eth_maker = Math.round(ticker_eth.ask - 5)
        const ask_xem_maker = Math.round((ticker_xem.ask - 1 / 10000) * 10000)/10000
        const ask_mona_maker = Math.round((ticker_mona.ask - 1 / 10)*10) / 10
        const ask_bch_maker = Math.round(ticker_bch.ask - 5)

        //積立金額にあわせて各通貨購入数量の計算及び端数の処理
        const amount_btc = Math.round(money_per_day_btc / ask_btc_maker * 10000) / 10000
        const amount_eth = Math.round(money_per_day_eth / ask_eth_maker * 10000) / 10000
        const amount_xem = Math.round(money_per_day_xem / ask_xem_maker * 10) / 10
        const amount_mona = Math.round(money_per_day_mona / ask_mona_maker * 10) / 10
        const amount_bch = Math.round(money_per_day_bch / ask_bch_maker * 10000) / 10000

        //年月日＆日時の取得
        const today = new Date()
        
        //確認のための出力
        console.log(today)
        console.log(ticker_btc.ask, ticker_eth.ask, ticker_xem.ask, ticker_mona.ask, ticker_bch.ask)
        console.log(ask_btc_maker, ask_eth_maker, ask_xem_maker, ask_mona_maker, ask_bch_maker)
        console.log(money_per_day_btc, money_per_day_eth, money_per_day_xem, money_per_day_mona, money_per_day_bch)
        console.log(amount_btc, amount_eth, amount_xem, amount_mona, amount_bch)
        
        //指値注文実行と確認のための出力(MONAは購入は現在Zaifでは不可のためコメントアウト)
        console.log (zaif.id, await zaif.createLimitBuyOrder ('BTC/JPY', amount_btc, ask_btc_maker))
        console.log (zaif.id, await zaif.createLimitBuyOrder ('ETH/JPY', amount_eth, ask_eth_maker))
        console.log (zaif.id, await zaif.createLimitBuyOrder ('XEM/JPY', amount_xem, ask_xem_maker))
        //console.log (zaif.id, await zaif.createLimitBuyOrder ('MONA/JPY', amount_mona, ask_mona_maker))
        //console.log (zaif.id, await zaif.createLimitBuyOrder ('BCH/JPY', amount_bch, ask_bch_maker))
        
        //次回積立タイミングまで待機
        await sleep(interval)
    }
}) ();
