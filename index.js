'use strict';

//時間の種類
const TIMES = [
  { time: "5:00" },{ time: "5:30" },
  { time: "6:00" },{ time: "6:30" },
  { time: "7:00" },{ time: "7:30" },
  { time: "8:00" },{ time: "8:30" },
  { time: "9:00" },{ time: "9:30" },
  { time: "10:00" },{ time: "10:30" },
  { time: "11:00" },{ time: "11:30" },
  { time: "12:00" },{ time: "12:30" },
  { time: "13:00" },{ time: "13:30" },
  { time: "14:00" },{ time: "14:30" },
  { time: "15:00" },{ time: "15:30" },
  { time: "16:00" },{ time: "16:30" },
  { time: "17:00" },{ time: "17:30" },
  { time: "18:00" },{ time: "18:30" },
  { time: "19:00" },{ time: "19:30" },
  { time: "20:00" },{ time: "20:30" },
  { time: "21:00" },{ time: "21:30" },
  { time: "22:00" },{ time: "22:30" },
  { time: "23:00" },{ time: "23:30" },
  { time: "0:00" },{ time: "0:30" },
  { time: "1:00" },{ time: "1:30" },
  { time: "2:00" },{ time: "2:30" },
  { time: "3:00" },{ time: "3:30" },
  { time: "4:00" },{ time: "4:30" },
];

//tableタグ内に追加する行の要素
const tableRow = ({time}) =>  
  `<tr>
    <th>${time}</th>
    <td><textarea maxlength="200" id="scheduleAt${time}" rows="3" placeholder="${time}のスケジュールを入力してください"></textarea></td>
    <td class="colorLine">
      <p>ChangeColor🎨</p>
      <input type="color" name="font-color" id="colorOf${time}" onclick="changeColor('${time}')" value="#ffffff">
    </td>
    <td class="saveLine">
      <input type="button" value="SAVE" onclick="save('${time}')" class="save-button">
    </td>
    <td class="conclusionLine">
      <p id="doneAt${time}" class="conclusionText"></p>
      <input type="button" value="完了" onclick="done('${time}')" id="${time}isDone" class="done-button">
      <input type="button" value="未完了" onclick="unfinished('${time}')" id="${time}isUnfinished" class="unfinished-button">
    </td>
   </tr>`;

//tableタグ内の行を追加
document.addEventListener('DOMContentLoaded', function() {
  const table = document.querySelector('table');
  //文字列を入れる
  table.innerHTML = TIMES.map(tableRow).join('');
  reload();
});

/**
 * 文字の色を変更 
 * @param {string} time 
 */
function changeColor(time) {
  var color = document.getElementById(`colorOf${time}`);
  color.addEventListener('change', (event) => {
    var fontColor = event.target.value;
    document.getElementById(`scheduleAt${time}`).style.color = fontColor;
    //スケジュールの文字の色を保存
    const colorKey = `ColorAt${time}`;
    const colorValue = fontColor;
    localStorage.setItem(colorKey, colorValue);
  })
}

/**
 * スケジュールの保存
 * @param {string} time 
 */
function save(time) {
  //スケジュールの内容を保存
  const key = `scheduleAt${time}`;
  const value = document.getElementById(`scheduleAt${time}`).value;
  localStorage.setItem(key, value);

  //発言の処理
  var saveSound = new SpeechSynthesisUtterance();
  saveSound.text = 'セーブしました';
  saveSound.lang = 'ja-JP';
  speechSynthesis.speak(saveSound);
  reload();
}

//スケジュールの更新
function reload() {
  TIMES.forEach(({time}) => {
    document.getElementById(`scheduleAt${time}`).value = localStorage.getItem(`scheduleAt${time}`);
    document.getElementById(`scheduleAt${time}`).style.color = localStorage.getItem(`ColorAt${time}`);
    document.getElementById(`doneAt${time}`).textContent = localStorage.getItem(`conclusionAt${time}`);
    //もし完了または未完了の設定がされていなかったらデフォルトで未完了を設定
    if (localStorage.getItem(`conclusionAt${time}`) == null || localStorage.getItem(`conclusionAt${time}`) == "") {
      document.getElementById(`doneAt${time}`).textContent = "未完了";
    }
    //完了・未完了の色を指定し完了の時は完了ボタンを隠し、未完了の時は未完了ボタンを隠す
    if (localStorage.getItem(`conclusionAt${time}`) == "完了") {
      document.getElementById(`doneAt${time}`).style.color = "rgb(23, 204, 23)";
      document.getElementById(`${time}isDone`).style.visibility = "hidden";
      document.getElementById(`${time}isUnfinished`).style.visibility = "visible"
    } else {
      document.getElementById(`doneAt${time}`).style.color = "rgb(248, 62, 30)";
      document.getElementById(`${time}isUnfinished`).style.visibility = "hidden"
      document.getElementById(`${time}isDone`).style.visibility = "visible";
    }
  })
  nowSchedule();
}

//現在の日付、時刻の取得、現在のスケジュールの取得
function nowSchedule() {
  const date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  //現在の時刻を取得して表示
  const today = (date.getMonth() + 1) + "月" + date.getDate() + "日" + hour + "時" + minutes + "分";
  document.getElementById("today").textContent = today; 
  //現在の時刻が30分以上だったら30分に、それ以外（0分以上30分未満）だったら0分にする
  if (30 <= minutes) {
    var nowTime = `${hour}:30`;
  } else {
    var nowTime = `${hour}:00`;
  }

  TIMES.forEach( function(item){
    document.getElementById(`scheduleAt${item.time}`).style.fontSize = "17px";
    if (nowTime == item.time) {
      //現在のスケジュールの部分に現在のスケジュールを取得して表示
      document.getElementById('nowSchedule').textContent = localStorage.getItem(`scheduleAt${item.time}`);
      //現在のスケジュールの部分の色を変更
      document.getElementById('nowSchedule').style.color = localStorage.getItem(`ColorAt${item.time}`);
      //現在のスケジュールを強調して表示
      document.getElementById(`scheduleAt${item.time}`).style.fontSize = "30px";
      //もし現在のスケジュールがなかったら「現在のスケジュールはありません」と表示
      if (localStorage.getItem(`scheduleAt${item.time}`) == null || localStorage.getItem(`scheduleAt${item.time}`) == "") {
        document.getElementById('nowSchedule').textContent = "現在のスケジュールはありません";
      }
    }
  })
  setInterval(nowSchedule, 1000);
}

//完了ボタンの処理
function done(time) {
  document.getElementById(`doneAt${time}`).textContent = "完了";
  conclusionSave(time);
}

//未完了ボタンの処理
function unfinished(time) {
  document.getElementById(`doneAt${time}`).textContent = "未完了";
  conclusionSave(time);
}

//完了か未完了かを保存
function conclusionSave(time) {
  const conclusionKey = `conclusionAt${time}`;
  const conclusionValue = document.getElementById(`doneAt${time}`).textContent;
  localStorage.setItem(conclusionKey, conclusionValue);
  reload();
}

// HowToUse（マニュアル）の処理
function howTouse() {
  alert(
    '１日のスケジュールを30分単位で管理できるアプリです。\n＜ボタンの説明＞\nCLEARボタン:　全てのスケジュールとその設定を削除します\nSPEAKボタン:　コンピュータが時間に応じた言葉をくれます。\n今日のスケジュールをダウンロードボタン:　自分が書いたスケジュールをファイル形式で保存してくれます。オフライン環境でもダウンロードしておくといつでもスケジュールを見ることができます。\nChangeColorボタン:　スケジュールの文字の色を自分好みにカスタマイズできます。変更した色は完全に保存されます。\nSAVEボタン:　書いたスケジュールを保存するボタンです。このボタンを押さないとページを閉じた時にスケジュールの内容も失われます。\n完了・未完了ボタン：　スケジュールを完了したかを設定でき完全に保存されます'
  );
}

//ダウンロード関係の処理
function download() {
  //音声の処理
  var downloadSound = new SpeechSynthesisUtterance();
  downloadSound.text = '今日のスケジュールをダウンロードします';
  downloadSound.lang = 'ja-JP';
  speechSynthesis.speak(downloadSound);

  // スケジュールをまとめた配列を用意
  const array = [];
  TIMES.forEach( function(item){
    array.push(`${item.time}   ${localStorage.getItem(`scheduleAt${item.time}`)}\n`);
    for(var i = 0; i < array.length; i++){
      if(array[i] === "4:30"){
          break;
      }
    }
  })
  // arrayのカンマをなくす
  var arr = array.join("");
  //ダウンロード
  let blob = new Blob([arr],{type:"text/plan"});
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const date = new Date();
  var today = `${date.getMonth() + 1}月${date.getDate()}日`;
  //ファイル名
  link.download = `${today}のスケジュール.txt`;
  link.click();
}

//SPEAKボタンの処理
function speak() {
  const date = new Date();
  var nowhour = date.getHours();
  var message = new SpeechSynthesisUtterance();
  if (5 <= nowhour && nowhour <= 10) { //朝の場合
    const messageinMorning = ['おはようございます', '今日も１日頑張ってください', '朝食は食べましたか？', '体調はいかがですか？', 'よく眠れましたか？', 'お目覚めはいかがですか？','朝食は何をお食べになられたのですか？', '私はまだ眠いです'];
    var landomMessage = Math.floor(messageinMorning.length*Math.random());
    message.text = messageinMorning[landomMessage];
  } else if (11 <= nowhour && nowhour <= 17) { //昼の場合
    const messageinNoon = ['こんにちは', '今日の調子はいかがですか？', '無理しすぎず頑張ってください', '昼食はしっかり食べましょうね', '私はお腹が減りました'];
    var landomMessage = Math.floor(messageinNoon.length*Math.random());
    message.text = messageinNoon[landomMessage];
  } else if (18 <= nowhour && nowhour <= 23) { //夜の場合
    const messageinNight = ['こんばんは', '今日も1日お疲れ様でした', '夜はしっかり休みましょうね', '夜は休んで明日に備えましょう', '私は眠くなってきました', 'おやすみなさい']; 
    var landomMessage = Math.floor(messageinNight.length*Math.random());
    message.text = messageinNight[landomMessage];
  } else { //夜中の場合
    const messageinMidnight = ['こんばんは', '今日は夜ふかしですか', '夜はしっかり寝ましょうね', 'おやすみなさい']; 
    var landomMessage = Math.floor(messageinMidnight.length*Math.random());
    message.text = messageinMidnight[landomMessage];
  }
  message.lang = 'ja-JP';
  speechSynthesis.speak(message);
}

//CLEARボタンの処理
function clearData() {
  //confirmの結果でデータを削除するかしないかを分岐させる
  var result = confirm('全てのデータを削除します。よろしいですか？');
  if (result == true) {
    localStorage.clear();
    reload();
  } else {
    return;
  }
}
