'use strict';

//定義(ライブラリ)
const ccxt = require ('ccxt');  //npmパッケージccxt読込

//定義(設定)
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8')) //設定情報をjsonとして読込

//定義(ccxtにAPI情報を設定)
const liquid = new ccxt.liquid ({
    apiKey: config.liquid.api.key,
    secret: config.liquid.api.secret,
})

//定義(積立関係の変数定義)
const interval = config.liquid.tsumitate.interval    //単位はミリ秒
const money_per_day = config.liquid.tsumitate.per_year / (365 * 24 * 60 * 60 * 1000 / interval)   //単位はJPY/積立間隔 1日1回積立ならJPY/日だし、config中のintervalの設定しだいでは2日に1回や半日に1回等自由に設定可能
const btc_ratio = config.liquid.tsumitate.ratio.btc   //単位は% BTC購入比率
const eth_ratio = config.liquid.tsumitate.ratio.eth   //単位は% ETH購入比率
const xrp_ratio = config.liquid.tsumitate.ratio.xrp   //単位は% QASH購入比率
const bch_ratio = config.liquid.tsumitate.ratio.bch   //単位は% BCH購入比率
const qash_ratio = config.liquid.tsumitate.ratio.qash   //単位は% QASH購入比率
const money_per_day_btc = money_per_day * btc_ratio / 100   //単位はJPY/日 1日当たりのBTC購入金額
const money_per_day_eth = money_per_day * eth_ratio / 100   //単位はJPY/日 1日当たりのETH購入金額
const money_per_day_xrp = money_per_day * xrp_ratio / 100   //単位はJPY/日 1日当たりのXRP購入金額
const money_per_day_bch = money_per_day * bch_ratio / 100   //単位はJPY/日 1日当たりのBCH購入金額
const money_per_day_qash = money_per_day * qash_ratio / 100   //単位はJPY/日 1日当たりのQASH購入金額


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
            liquid.fetchTicker ('BTC/JPY'),
            liquid.fetchTicker ('ETH/JPY'),
            liquid.fetchTicker ('XRP/JPY'),
            liquid.fetchTicker ('BCH/JPY'),
            liquid.fetchTicker ('QASH/JPY')
        ])
        
        //maker注文のための価格計算
        const ask_btc_maker = Math.round((ticker_all[0].ask - 1 / 100) * 100) / 100
        const ask_eth_maker = Math.round((ticker_all[1].ask - 1 / 100) * 100) / 100
        const ask_xrp_maker = Math.round((ticker_all[2].ask - 1 / 100) * 100) / 100
        const ask_bch_maker = Math.round((ticker_all[3].ask - 1 / 100) * 100) / 100
        const ask_qash_maker = Math.round((ticker_all[4].ask - 1 / 100) * 100) / 100
        
        //注文数量の計算
        const amount_btc = Math.round(money_per_day_btc / ask_btc_maker * 100000000) / 100000000
        const amount_eth = Math.round(money_per_day_eth / ask_eth_maker * 1000000) / 1000000
        const amount_xrp = Math.round(money_per_day_xrp / ask_xrp_maker * 10000) / 10000
        const amount_bch = Math.round(money_per_day_bch / ask_bch_maker * 100000000) / 100000000
        const amount_qash = Math.round(money_per_day_qash / ask_qash_maker * 10000) / 10000
        
        //確認のため表示
        console.log('liquid自動積立')
        console.log(today_jst)
        console.log(ask_btc_maker, 'JPY/BTC', ask_eth_maker, 'JPY/ETH', ask_xrp_maker, 'JPY/XRP', ask_bch_maker, 'JPY/BCH', ask_qash_maker, 'JPY/QASH')
        console.log('BTC:', amount_btc, 'ETH:', amount_eth, 'XRP:', amount_xrp, 'BCH:', amount_bch, 'QASH:', amount_qash)
        
        //買い注文(最低発注金額に満たない場合は発注されないので注意)
        if (amount_btc >= 0.001) {
            console.log(await liquid.createLimitBuyOrder ('BTC/JPY', amount_btc, ask_btc_maker))
        }
        if (amount_eth >= 0.01) {
            console.log(await liquid.createLimitBuyOrder ('ETH/JPY', amount_eth, ask_eth_maker))
        }
        if (amount_xrp >= 1) {
            console.log(await liquid.createLimitBuyOrder ('XRP/JPY', amount_xrp, ask_xrp_maker))
        }
        if (amount_bch >= 0.01) {
            console.log(await liquid.createLimitBuyOrder ('BCH/JPY', amount_bch, ask_bch_maker))
        }
        if (amount_qash >= 1) {
            console.log(await liquid.createLimitBuyOrder ('QASH/JPY', amount_qash, ask_qash_maker))
        }
        
        //指定時間だけ待機
        await sleep(interval)
    }
}

jidou_tsumitate()
