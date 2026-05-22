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

    // サマリー用のデータを集める配列
    const summaryItems = [];

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

      if (setsToBring > 0) {
        summaryItems.push({
          name: item.name,
          sets: setsToBring,
          perSet: item.perSet
        });
      }

      // 行の生成
      const tr = document.createElement('tr');
      tr.className = 'row-appear';
      // アニメーションの遅延設定（CSSでも設定しているが、動的生成に対応）
      tr.style.animationDelay = `${index * 0.05}s`;

      // 余りが少ない場合は警告色にするなどの工夫
      const remClass = remainder <= 2 ? 'highlight-rem warning' : 'highlight-rem';
      const setsClass = setsToBring > 0 ? 'highlight-sets' : '';

      tr.innerHTML = `
        <td data-label="アイテム名"><strong>${item.name}</strong> <span style="font-size: 0.8rem; color: var(--text-muted);">(${item.perSet}枚/セット)</span></td>
        <td data-label="必要総数">${totalNeeded} 枚</td>
        <td data-label="前日残">${stock} 枚</td>
        <td data-label="持ってくるセット数" class="${setsClass}">${setsToBring} セット</td>
        <td data-label="余る数" class="${remClass}">${remainder} 枚</td>
      `;

      resultBody.appendChild(tr);
    });

    // サマリーの表示更新
    const summaryWrapper = document.getElementById('summaryWrapper');
    const summaryList = document.getElementById('summaryList');
    if (summaryWrapper && summaryList) {
      summaryList.innerHTML = '';
      if (summaryItems.length > 0) {
        summaryWrapper.style.display = 'block';
        summaryItems.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'summary-item';
          itemEl.innerHTML = `
            <span class="summary-item-name">${item.name}</span>
            <span class="summary-item-sets"><strong>${item.sets}</strong> セット <span class="summary-item-detail">(${item.sets * item.perSet}枚)</span></span>
          `;
          summaryList.appendChild(itemEl);
        });
      } else {
        // すべて0セットの場合
        summaryWrapper.style.display = 'block';
        summaryList.innerHTML = `
          <div class="summary-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            追加で持ってくるリネンはありません（在庫で足りています）
          </div>
        `;
      }
    }
    
    // スクロールして結果を見やすくする（モバイル向け）
    const resultSection = document.querySelector('.result-section');
    if (window.innerWidth <= 768) {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
