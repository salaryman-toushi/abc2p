'use strict';

//定義(ライブラリ)
const ccxt = require ('ccxt');  //npmパッケージccxt読込

//定義(設定)
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8')) //設定情報をjsonとして読込

//定義(ccxtにAPI情報を設定)
const zaif = new ccxt.zaif ({
    apiKey: config.zaif.api.key,
    secret: config.zaif.api.secret,
})

//定義(積立関係の変数定義)
const money_per_day = config.zaif.tsumitate.per_year /365   //単位はJPY/日 1日当たりの購入金額
const btc_ratio = config.zaif.tsumitate.ratio.btc   //単位は% BTC購入比率
const eth_ratio = config.zaif.tsumitate.ratio.eth   //単位は% ETH購入比率
const xem_ratio = config.zaif.tsumitate.ratio.xem   //単位は% XEM購入比率
const mona_ratio = config.zaif.tsumitate.ratio.mona //単位は% MONA購入比率
const bch_ratio = config.zaif.tsumitate.ratio.bch   //単位は% BCH購入比率
const money_per_day_btc = money_per_day * btc_ratio / 100   //単位はJPY/日 1日当たりのBTC購入金額
const money_per_day_eth = money_per_day * eth_ratio / 100   //単位はJPY/日 1日当たりのETH購入金額
const money_per_day_xem = money_per_day * xem_ratio / 100   //単位はJPY/日 1日当たりのXEM購入金額
const money_per_day_mona = money_per_day * mona_ratio / 100 //単位はJPY/日 1日当たりのMONA購入金額
const money_per_day_bch = money_per_day * bch_ratio / 100   //単位はJPY/日 1日当たりのBCH購入金額
const interval = config.zaif.tsumitate.interval    //単位はミリ秒

//定義(次のタイミングまで待機する関数の定義)設定した時間後にresolveされPromiseが返される
const sleep = (timer) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
                resolve()
        }, timer)
    })
}   //次の購入タイミングまで待機する関数の定義

//定義(自動積立)
const jidou_tsumitate = async function () {
    
    //明示的にキルするまで永続的に繰り返し
    while(true) {
        //日時取得
        const today_gmt = new Date()
        const today_jst = today_gmt + 9 * 60 * 60 * 1000
        
        //板情報取得
        const ticker_all = await Promise.all ([
            zaif.fetchTicker ('BTC/JPY'),
            zaif.fetchTicker ('ETH/JPY'),
            zaif.fetchTicker ('XEM/JPY'),
            zaif.fetchTicker ('MONA/JPY'),
            zaif.fetchTicker ('BCH/JPY')
        ])
        
        //maker注文のための価格計算
        const ask_btc_maker = Math.round(ticker_all[0].ask - 5)
        const ask_eth_maker = Math.round(ticker_all[1].ask - 5)
        const ask_xem_maker = Math.round((ticker_all[2].ask - 1 / 10000) * 10000) / 10000
        const ask_mona_maker = Math.round((ticker_all[3].ask - 1 / 10) * 10) / 10
        const ask_bch_maker = Math.round(ticker_all[4].ask - 5)
        
        //注文数量の計算
        const amount_btc = Math.round(money_per_day_btc / ask_btc_maker * 10000) / 10000
        const amount_eth = Math.round(money_per_day_eth / ask_eth_maker * 10000) / 10000
        const amount_xem = Math.round(money_per_day_xem / ask_xem_maker * 10) / 10
        const amount_mona = Math.round(money_per_day_mona / ask_mona_maker * 10000) / 10000
        const amount_bch = Math.round(money_per_day_bch / ask_bch_maker * 10000) / 10000
        
        //確認のため表示
        console.log('zaif自動積立')
        console.log(today_jst)
        console.log(ask_btc_maker, 'JPY/BTC', ask_eth_maker, 'JPY/ETH', ask_xem_maker, 'JPY/XEM', ask_mona_maker, 'JPY/MONA', ask_bch_maker, 'JPY/BCH')
        console.log('BTC:', amount_btc, 'ETH:', amount_eth, 'XEM:', amount_xem, 'MONA:', amount_mona, 'BCH:', amount_bch)
        
        //買い注文
        if (amount_btc >= 0.001) {
            console.log(await zaif.createLimitBuyOrder ('BTC/JPY', amount_btc, ask_btc_maker))
        }
        if (amount_eth >= 0.001) {
            console.log(await zaif.createLimitBuyOrder ('ETH/JPY', amount_eth, ask_eth_maker))
        }
        if (amount_xem >= 0.1) {
            console.log(await zaif.createLimitBuyOrder ('XEM/JPY', amount_xem, ask_xem_maker))
        }
        if (amount_mona >= 0.001) {
            console.log(await zaif.createLimitBuyOrder ('MONA/JPY', amount_mona, ask_mona_maker))
        }
        if (amount_bch >= 0.001) {
            console.log(await zaif.createLimitBuyOrder ('BCH/JPY', amount_bch, ask_bch_maker))
        }
        
        //指定時間だけ待機
        await sleep(interval)
    }
}

jidou_tsumitate()
