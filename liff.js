document.addEventListener('DOMContentLoaded', function () {
    liff.init({ liffId: "2006144295-P0Q5xnmr" }).then(() => {
        // LIFF初期化成功
    }).catch(err => {
        console.error('LIFF初期化エラー:', err);
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

    // 送信するメッセージの作成
    const message = `添付ファイル1: ${document.getElementById('file1').value}\n
                     添付ファイル2: ${document.getElementById('file2').value}\n
                     添付ファイル3: ${document.getElementById('file3').value}\n
                     添付ファイル4: ${document.getElementById('file4').value}\n
                     ブランド: ${document.getElementById('brand').value}\n
                     モデル: ${document.getElementById('model').value}\n
                     型番: ${document.getElementById('modelNumber').value}\n
                     付属品: ${getAccessories()}\n
                     他社査定: ${assessment ? assessment.value : 'なし'}\n
                     他社査定金額: ${document.getElementById('assessmentAmount').value}`;

    liff.sendMessages([{
        type: 'text',
        text: message
    }]).then(() => {
        alert('送信が完了しました！');
        liff.closeWindow();
    }).catch(err => {
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
    return accessories.trim();
}
