document.addEventListener('DOMContentLoaded', function () {
    liff.init({ liffId: "2006144295-P0Q5xnmr" }).then(() => {
        // LIFF初期化成功
        alert('初期化成功');
    }).catch(err => {
        alert('LIFF初期化エラー:', err);
    });
});

function toggleWarrantyFields() {
    const warrantyChecked = document.getElementById('warranty').checked;
    document.getElementById('warrantyDetails').style.display = warrantyChecked ? 'block' : 'none';
}

function toggleAssessmentFields() {
    const assessment = document.querySelector('input[name="otherAssessment"]:checked').value;
    document.getElementById('assessmentAmountField').style.display = assessment === 'あり' ? 'block' : 'none';
}

function sendData() {
    // 必須項目のチェック
    const requiredFields = [
        document.getElementById('file1'),
        document.getElementById('file2'),
        document.getElementById('file3'),
        document.getElementById('file4'),
    ];

    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value) {
            alert('必須項目を入力してください');
            isValid = false;
            return;
        }
    });

    // 保証書がチェックされた場合の年と月のチェック
    if (document.getElementById('warranty').checked) {
        const warrantyYear = document.getElementById('warrantyYear').value;
        const warrantyMonth = document.getElementById('warrantyMonth').value;
        if (!warrantyYear || !warrantyMonth) {
            alert('保証書年と月を入力してください');
            isValid = false;
            return;
        }
    }

    // 他社査定が「あり」の場合の査定金額のチェック
    const assessment = document.querySelector('input[name="otherAssessment"]:checked');
    if (assessment && assessment.value === 'あり') {
        const assessmentAmount = document.getElementById('assessmentAmount').value;
        if (!assessmentAmount) {
            alert('他社査定金額を入力してください');
            isValid = false;
            return;
        }
    }

    if (!isValid) {
        return;
    }
    alert('必須確認問題なし');

    // 送信するメッセージリスト
    let messages = [];

    // 添付ファイルの処理
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];
    const file3 = document.getElementById('file3').files[0];
    const file4 = document.getElementById('file4').files[0];

    // ファイルのリストを配列にして処理
    const files = [file1, file2, file3, file4];

    let processedFiles = 0;

    files.forEach((file, index) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                alert('start reader onload');
                // 画像データをBase64にエンコードし、画像メッセージとして追加
                messages.push({
                    type: 'image',
                    originalContentUrl: event.target.result,
                    previewImageUrl: event.target.result
                });

                processedFiles++;

                // すべてのファイルが処理されたら、テキストメッセージを追加して送信
                if (processedFiles === files.length) {
                    alert('processedFiles === files.length');
                    // その他のテキストメッセージを作成
                    const textMessage = {
                        type: 'text',
                        text: `
ブランド: ${document.getElementById('brand').value}\n
モデル: ${document.getElementById('model').value}\n
型番: ${document.getElementById('modelNumber').value}\n
付属品: ${getAccessories()}\n
他社査定: ${assessment ? assessment.value : 'なし'}\n
他社査定金額: ${document.getElementById('assessmentAmount').value}`
                    };
                    messages.push(textMessage);

                    // メッセージを送信
                    liff.sendMessages(messages).then(() => {
                        alert('送信が完了しました！');
                        liff.closeWindow();
                    }).catch(err => {
                        console.error('メッセージ送信エラー:', err);
                    });
                }
            };
            reader.readAsDataURL(file);  // ファイルをBase64形式で読み込む
        }
    });
}

function getAccessories() {
    let accessories = '';
    if (document.getElementById('warranty').checked) {
        accessories += '保証書 ';
    }
    if (document.getElementById('box').checked) {
        accessories += '箱 ';
    }
    if (document.getElementById('others').checked) {
        accessories += 'その他 ';
    }
    return accessories.trim();
}
