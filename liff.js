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

    // チェックボックスのバリデーション
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var isChecked = Array.prototype.slice.call(checkboxes).some(x => x.checked);

    if (!isChecked) {
        alert('付属品を少なくとも1つ選択してください。');
        isValid = false;
        return;
    }

    // ラジオボタンのバリデーション
    var radios = document.querySelectorAll('input[name="otherAssessment"]');
    var isRadioChecked = Array.prototype.slice.call(radios).some(x => x.checked);

    if (!isRadioChecked) {
        alert('他社査定を選択してください。');
        isValid = false;
        return;
    }
    
    if (!isValid) {
        return;
    }

    // 送信するメッセージリスト
    let messages = [];
    let processedFiles = 0;

    // 添付ファイルの処理
    const files = [
        document.getElementById('file1').files[0],
        document.getElementById('file2').files[0],
        document.getElementById('file3').files[0],
        document.getElementById('file4').files[0]
    ];

    // 画像を非同期で読み込むPromiseを作成
    const fileReadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    resolve({
                        type: 'image',
                        originalContentUrl: event.target.result,
                        previewImageUrl: event.target.result
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } else {
                resolve(null);
            }
        });
    });
    // すべての画像の読み込みが完了するのを待つ
    Promise.all(fileReadPromises).then((results) => {
        results.forEach(result => {
            if (result) {
                messages.push(result);
            }
        });

        // テキストメッセージを追加
        const textMessage = {
            type: 'text',
            text: `
ブランド: ${document.getElementById('brand').value}\n
モデル: ${document.getElementById('model').value}\n
型番: ${document.getElementById('modelNumber').value}\n
付属品: ${getAccessories()}\n
他社査定: ${document.querySelector('input[name="otherAssessment"]:checked') ? document.querySelector('input[name="otherAssessment"]:checked').value : 'なし'}\n
他社査定金額: ${document.getElementById('assessmentAmount').value}\n
参考URL: ${document.getElementById('url').value}\n
備考: ${document.getElementById('remarks').value}`
        };
        messages.push(textMessage);

        // メッセージを送信
        return liff.sendMessages(messages);
    }).then(() => {
        alert('送信が完了しました！');
        liff.closeWindow();
    }).catch((err) => {
        console.error('メッセージ送信エラー:', err);
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
    if (document.getElementById('noAccessories').checked) {
        accessories += '付属品なし ';
    }
    return accessories.trim();
}
