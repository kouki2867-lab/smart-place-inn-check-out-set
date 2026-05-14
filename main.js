// リネンアイテムの設定データ
const itemsConfig = [
  { id: 'sheets', name: 'シーツ', usagePerPerson: 1, perSet: 10, inputId: 'stock-sheets' },
  { id: 'duvet', name: 'デュベカバー', usagePerPerson: 1, perSet: 5, inputId: 'stock-duvet' },
  { id: 'pillow', name: 'ピローケース', usagePerPerson: 2, perSet: 20, inputId: 'stock-pillow' },
  { id: 'bathmat', name: 'バスマット', usagePerPerson: 1, perSet: 10, inputId: 'stock-bathmat' },
  { id: 'bathtowel', name: 'バスタオル', usagePerPerson: 2, perSet: 10, inputId: 'stock-bathtowel' },
  { id: 'facetowel', name: 'フェイスタオル', usagePerPerson: 2, perSet: 10, inputId: 'stock-facetowel' },
];

document.addEventListener('DOMContentLoaded', () => {
  const calculateBtn = document.getElementById('calculateBtn');
  const resultBody = document.getElementById('resultBody');

  // 入力フィールドがフォーカスされたときに中身を選択する（入力を簡単にするため）
  const allInputs = document.querySelectorAll('input[type="number"]');
  allInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.select();
    });
  });

  calculateBtn.addEventListener('click', () => {
    // アニメーションのためにボタンを少し沈ませる
    calculateBtn.style.transform = 'scale(0.98)';
    setTimeout(() => {
      calculateBtn.style.transform = '';
    }, 100);

    const peopleCountInput = document.getElementById('peopleCount').value;
    const peopleCount = parseInt(peopleCountInput, 10) || 0;

    // テーブルの中身をクリア
    resultBody.innerHTML = '';

    // 人数が0の場合は警告などを出しても良いが、今回はそのまま0として計算
    
    itemsConfig.forEach((item, index) => {
      const stockInput = document.getElementById(item.inputId).value;
      const stock = parseInt(stockInput, 10) || 0;

      // 計算ロジック
      // 必要総数 ＝ (予定人数 × 1人あたりの使用量)
      const totalNeeded = peopleCount * item.usagePerPerson;
      
      // 追加補充数 ＝ 必要総数 － 前日の残数（※マイナスの場合は0とする）
      const additionalNeeded = Math.max(0, totalNeeded - stock);
      
      // 持ってくるセット数 ＝ 追加補充数 ÷ 1セットあたりの数量（※小数点以下切り上げ）
      const setsToBring = Math.ceil(additionalNeeded / item.perSet);
      
      // 余り（ストック） ＝ (持ってくるセット数 × 1セットあたりの数量) ＋ 前日の残数 － 必要総数
      const remainder = (setsToBring * item.perSet) + stock - totalNeeded;

      // 行の生成
      const tr = document.createElement('tr');
      tr.className = 'row-appear';
      // アニメーションの遅延設定（CSSでも設定しているが、動的生成に対応）
      tr.style.animationDelay = `${index * 0.05}s`;

      // 余りが少ない場合は警告色にするなどの工夫
      const remClass = remainder <= 2 ? 'highlight-rem warning' : 'highlight-rem';
      const setsClass = setsToBring > 0 ? 'highlight-sets' : '';

      tr.innerHTML = `
        <td><strong>${item.name}</strong> <span style="font-size: 0.8rem; color: var(--text-muted);">(${item.perSet}枚/セット)</span></td>
        <td>${totalNeeded} 枚</td>
        <td>${stock} 枚</td>
        <td class="${setsClass}">${setsToBring} セット</td>
        <td class="${remClass}">${remainder} 枚</td>
      `;

      resultBody.appendChild(tr);
    });
    
    // スクロールして結果を見やすくする（モバイル向け）
    const resultSection = document.querySelector('.result-section');
    if (window.innerWidth <= 768) {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
