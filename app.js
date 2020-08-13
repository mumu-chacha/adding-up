'use strict';

//①csvファイルからデータを読み取る

const fs = require('fs');//ファイルを読み込むモジュールをに変数fsに代入
const readline = require('readline');//1行ずつ読み込むモジュールを変数readlineに代入
const rs = fs.createReadStream('./popu-pref.csv');//ファイルを指定しfsの機能でストリームを作る。rsに代入
const rl = readline.createInterface({'input': rs,'output':{}});//ストリームを1行ずつ読み込む機能に渡し、1行ずつ読んでもらう。rlに代入
const prefectureDataMap = new Map();//key: 都道府県 value: 集計データのオブジェクト
//②ファイルからデータを抜き出す

rl.on('line', (lineString) => {
    const columns = lineString.split(',');//文字列を , で区切りcolumnsという名前の配列にする
    const year = parseInt(columns[0]);//配列０番目を文字列を数値に変換して、yearに代入
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {//タイトル部分を読まないように、データ部分を指定
        let value = prefectureDataMap.get(prefecture);//データ持ってるか確認
        if (!value) {//まだ持ってないなら空のデータを作る
            value = {
              popu10: 0,
              popu15: 0,
              change: null
            };
          }
          if (year === 2010) {//2010年のものならvalue.popu10に代入
            value.popu10 = popu;
          }
          if (year === 2015) {
            value.popu15 = popu;
          }
          prefectureDataMap.set(prefecture, value);
        }
      });
      rl.on('close', () => {//③データの計算　for-of 構文で変数代入したままMapをループさせる間に、変化率を計算する
        for (let [key, value] of prefectureDataMap){
            value.change = value.popu15/ value.popu10;
        }
        //④データの並び替え　普通の配列に変換して、後ろの変化率が前の変化率より大きかったら入れ替え（大きい順になる）
        const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
            return pair2[1].change - pair1[1].change;
          });
          // '愛知県: 361670=>371756 変化率:1.0278873005778748'
          //↑となるようにすべての配列を綺麗に整える
          const rankingStrings = rankingArray.map(([key, value]) => {
            return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
          });
          console.log(rankingStrings);
      });
      
    
  
    

