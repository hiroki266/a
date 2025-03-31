// 扶養控除に関する定数
const DEPENDENT_DEDUCTIONS = {
    GENERAL: 380000,      // 一般扶養親族（16歳以上19歳未満、23歳以上70歳未満）
    SPECIFIC: 630000,     // 特定扶養親族（19歳以上23歳未満）
    ELDERLY_PARENTS: 580000,  // 老人扶養親族（70歳以上）で同居老親等以外
    ELDERLY_PARENTS_LIVING_TOGETHER: 680000  // 老人扶養親族のうち同居老親等
};

// 基礎控除に関する定数を追加
const BASIC_DEDUCTION = {
    FULL_AMOUNT: 480000,      // 通常の基礎控除額（48万円）
    REDUCED_2400: 320000,     // 所得2400万円超2450万円以下の場合（32万円）
    REDUCED_2450: 160000,     // 所得2450万円超2500万円以下の場合（16万円）
    LIMIT_2400: 24000000,     // 所得制限開始額（2400万円）
    LIMIT_2450: 24500000,     // 第1段階の所得制限額（2450万円）
    LIMIT_2500: 25000000      // 完全消失する所得制限額（2500万円）
};

let dependentCount = 0;

// 扶養親族フォームを追加する関数
function addDependentForm() {
    const dependentList = document.getElementById('dependent-list');
    const dependentDiv = document.createElement('div');
    dependentDiv.className = 'dependent-form';
    dependentDiv.id = `dependent-${dependentCount}`;

    dependentDiv.innerHTML = `
        <div class="form-group">
            <label for="dependent-age-${dependentCount}">年齢:</label>
            <input type="number" id="dependent-age-${dependentCount}" 
                   min="0" max="120" class="dependent-age" 
                   onchange="calculateDependentDeduction()">
        </div>
        <div class="form-group">
            <label for="dependent-type-${dependentCount}">種類:</label>
            <select id="dependent-type-${dependentCount}" 
                    class="dependent-type" 
                    onchange="calculateDependentDeduction()">
                <option value="general">一般扶養親族</option>
                <option value="elderly_living_together">同居老親等</option>
                <option value="elderly_other">同居していない老親等</option>
            </select>
        </div>
        <button type="button" class="remove-btn" 
                onclick="removeDependent(${dependentCount})">削除</button>
    `;

    dependentList.appendChild(dependentDiv);
    dependentCount++;
    calculateDependentDeduction();
}

// 扶養親族フォームを削除する関数
function removeDependent(id) {
    const dependentDiv = document.getElementById(`dependent-${id}`);
    dependentDiv.remove();
    calculateDependentDeduction();
}

// 扶養控除額を計算する関数
function calculateDependentDeduction() {
    let totalDeduction = 0;
    const dependentForms = document.getElementsByClassName('dependent-form');

    Array.from(dependentForms).forEach(form => {
        const age = Number(form.querySelector('.dependent-age').value);
        const type = form.querySelector('.dependent-type').value;

        if (age && age >= 16) { // 16歳未満は扶養控除の対象外
            if (age >= 70) {
                // 70歳以上の老人扶養親族
                if (type === 'elderly_living_together') {
                    totalDeduction += DEPENDENT_DEDUCTIONS.ELDERLY_PARENTS_LIVING_TOGETHER;
                } else {
                    totalDeduction += DEPENDENT_DEDUCTIONS.ELDERLY_PARENTS;
                }
            } else if (age >= 19 && age < 23) {
                // 特定扶養親族（19歳以上23歳未満）
                totalDeduction += DEPENDENT_DEDUCTIONS.SPECIFIC;
            } else if ((age >= 16 && age < 19) || (age >= 23 && age < 70)) {
                // 一般扶養親族
                totalDeduction += DEPENDENT_DEDUCTIONS.GENERAL;
            }
        }
    });

    // 扶養控除額の表示を更新
    document.getElementById('dependent-total').textContent = totalDeduction.toLocaleString();
    
    // メインの計算関数を呼び出して全体の計算を更新
    calculateTax();
    return totalDeduction;
}

// 基礎控除額を計算する関数
function calculateBasicDeduction(totalIncome) {
    if (totalIncome <= BASIC_DEDUCTION.LIMIT_2400) {
        return BASIC_DEDUCTION.FULL_AMOUNT;
    } else if (totalIncome <= BASIC_DEDUCTION.LIMIT_2450) {
        return BASIC_DEDUCTION.REDUCED_2400;
    } else if (totalIncome <= BASIC_DEDUCTION.LIMIT_2500) {
        return BASIC_DEDUCTION.REDUCED_2450;
    } else {
        return 0; // 所得2500万円超の場合
    }
}

// メインの計算関数を更新
function calculateTax() {
    // 収入と所得の計算
    const salary = Number(document.getElementById('salary').value) || 0;
    const employmentIncome = calculateEmploymentIncome(salary);

    // 事業所得の計算
    const businessIncome = Number(document.getElementById('business-income').value) || 0;
    const businessExpenses = Number(document.getElementById('business-expenses').value) || 0;
    const businessProfit = Math.max(0, businessIncome - businessExpenses);

    // 不動産所得の計算
    const realEstateIncome = Number(document.getElementById('real-estate-income').value) || 0;
    const realEstateExpenses = Number(document.getElementById('real-estate-expenses').value) || 0;
    const realEstateProfit = Math.max(0, realEstateIncome - realEstateExpenses);

    // 雑所得の計算
    const miscIncome = Number(document.getElementById('misc-income').value) || 0;
    const miscExpenses = Number(document.getElementById('misc-expenses').value) || 0;
    const miscProfit = Math.max(0, miscIncome - miscExpenses);

    // その他の収入
    const dividendIncome = Number(document.getElementById('dividend-income').value) || 0;
    const transferIncome = Number(document.getElementById('transfer-income').value) || 0;
    const temporaryIncome = Number(document.getElementById('temporary-income').value) || 0;

    // 総所得金額の計算
    const totalIncome = employmentIncome + 
                       businessProfit + 
                       realEstateProfit + 
                       miscProfit + 
                       dividendIncome + 
                       (transferIncome / 2) + // 譲渡所得は2分の1
                       (temporaryIncome / 2);  // 一時所得は2分の1

    // 基礎控除額の計算（所得制限を考慮）
    const basicDeduction = calculateBasicDeduction(totalIncome);

    // 基礎控除の表示を更新（所得制限の説明を追加）
    const basicDeductionElement = document.getElementById('basic-deduction-display');
    basicDeductionElement.textContent = basicDeduction.toLocaleString();
    
    // 基礎控除の説明を追加
    updateBasicDeductionDescription(totalIncome);

    // 所得の内訳を表示
    document.getElementById('employment-income').textContent = employmentIncome.toLocaleString();
    document.getElementById('business-profit').textContent = businessProfit.toLocaleString();
    document.getElementById('real-estate-profit').textContent = realEstateProfit.toLocaleString();
    document.getElementById('misc-profit').textContent = miscProfit.toLocaleString();
    document.getElementById('dividend-income-display').textContent = dividendIncome.toLocaleString();
    document.getElementById('transfer-income-display').textContent = transferIncome.toLocaleString();
    document.getElementById('temporary-income-display').textContent = temporaryIncome.toLocaleString();
    document.getElementById('total-income').textContent = totalIncome.toLocaleString();

    // 控除の取得と計算
    const socialInsurance = Number(document.getElementById('social-insurance').value) || 0;
    const smallBusiness = Number(document.getElementById('small-business').value) || 0;
    const lifeInsurance = updateLifeInsuranceDisplay();
    
    // 地震保険料控除（上限適用）
    const earthquakeInsuranceInput = Number(document.getElementById('earthquake-insurance').value) || 0;
    const earthquakeInsurance = calculateEarthquakeInsurance(earthquakeInsuranceInput);
    
    const dependentDeduction = calculateDependentDeduction();
    const widowSingleParent = Number(document.getElementById('widow-single-parent').value) || 0;
    const studentDisability = Number(document.getElementById('student-disability').value) || 0;
    const casualtyLoss = Number(document.getElementById('casualty-loss').value) || 0;
    
    // 医療費控除（要件と上限を考慮）
    const medicalExpenses = Number(document.getElementById('medical').value) || 0;
    const medical = updateMedicalDeductionDisplay(medicalExpenses, totalIncome);
    
    // 寄附金控除（要件と上限を考慮）
    const donationAmount = Number(document.getElementById('donation').value) || 0;
    const donation = updateDonationDeductionDisplay(donationAmount, totalIncome);

    // 控除総額の計算
    const totalDeduction = basicDeduction + 
                          socialInsurance + 
                          smallBusiness + 
                          lifeInsurance + 
                          earthquakeInsurance + 
                          dependentDeduction + 
                          widowSingleParent + 
                          studentDisability + 
                          casualtyLoss + 
                          medical + 
                          donation;

    // 控除額の表示を更新
    document.getElementById('basic-deduction-display').textContent = basicDeduction.toLocaleString();
    document.getElementById('social-insurance-display').textContent = socialInsurance.toLocaleString();
    document.getElementById('small-business-display').textContent = smallBusiness.toLocaleString();
    document.getElementById('life-insurance-total').textContent = lifeInsurance.toLocaleString();
    document.getElementById('earthquake-insurance-display').textContent = earthquakeInsurance.toLocaleString();
    document.getElementById('dependent-total').textContent = dependentDeduction.toLocaleString();
    document.getElementById('widow-single-parent-display').textContent = widowSingleParent.toLocaleString();
    document.getElementById('student-disability-display').textContent = studentDisability.toLocaleString();
    document.getElementById('casualty-loss-display').textContent = casualtyLoss.toLocaleString();
    document.getElementById('medical-display').textContent = medical.toLocaleString();
    document.getElementById('donation-display').textContent = donation.toLocaleString();
    document.getElementById('total-deduction').textContent = totalDeduction.toLocaleString();

    // 課税所得金額の計算
    const taxableIncome = Math.max(0, totalIncome - totalDeduction);

    // 所得税額の計算（累進課税）
    let incomeTax = calculateIncomeTax(taxableIncome);

    // 復興特別所得税の計算（所得税額の2.1%）
    const specialTax = Math.floor(incomeTax * 0.021);

    // 合計税額
    const totalTax = incomeTax + specialTax;

    // 結果の表示を更新
    document.getElementById('taxable-income').textContent = taxableIncome.toLocaleString();
    document.getElementById('income-tax').textContent = incomeTax.toLocaleString();
    document.getElementById('special-tax').textContent = specialTax.toLocaleString();
    document.getElementById('total-tax').textContent = totalTax.toLocaleString();
}

function calculateIncomeTax(taxableIncome) {
    // 令和5年分の所得税率
    if (taxableIncome <= 1950000) {
        return Math.floor(taxableIncome * 0.05);
    } else if (taxableIncome <= 3300000) {
        return Math.floor(taxableIncome * 0.10 - 97500);
    } else if (taxableIncome <= 6950000) {
        return Math.floor(taxableIncome * 0.20 - 427500);
    } else if (taxableIncome <= 9000000) {
        return Math.floor(taxableIncome * 0.23 - 636000);
    } else if (taxableIncome <= 18000000) {
        return Math.floor(taxableIncome * 0.33 - 1536000);
    } else if (taxableIncome <= 40000000) {
        return Math.floor(taxableIncome * 0.40 - 2796000);
    } else {
        return Math.floor(taxableIncome * 0.45 - 4796000);
    }
}

function calculateEmploymentIncome(salary) {
    let deduction;
    
    // 給与所得控除額の計算（令和5年分）
    if (salary <= 1625000) {
        deduction = 550000;
    } else if (salary <= 1800000) {
        deduction = salary * 0.4 - 100000;
    } else if (salary <= 3600000) {
        deduction = salary * 0.3 + 80000;
    } else if (salary <= 6600000) {
        deduction = salary * 0.2 + 440000;
    } else if (salary <= 8500000) {
        deduction = salary * 0.1 + 1100000;
    } else {
        deduction = 1950000; // 上限額
    }

    // 給与所得 = 給与収入 - 給与所得控除額
    return Math.max(0, salary - deduction);
}

// 生命保険料控除の計算と表示を更新
function updateLifeInsuranceDisplay() {
    const newLifeInsurance = Number(document.getElementById('new-life-insurance').value) || 0;
    const oldLifeInsurance = Number(document.getElementById('old-life-insurance').value) || 0;
    const newPensionInsurance = Number(document.getElementById('new-pension-insurance').value) || 0;
    const oldPensionInsurance = Number(document.getElementById('old-pension-insurance').value) || 0;
    const nursingInsurance = Number(document.getElementById('nursing-insurance').value) || 0;

    // 各種類ごとの控除額を計算
    const lifeDeduction = calculateInsuranceDeduction(newLifeInsurance, oldLifeInsurance);
    const pensionDeduction = calculateInsuranceDeduction(newPensionInsurance, oldPensionInsurance);
    const nursingDeduction = calculateSingleInsuranceDeduction(nursingInsurance);

    // 合計控除額（上限12万円）
    const totalDeduction = Math.min(120000, lifeDeduction + pensionDeduction + nursingDeduction);

    // 内訳の表示を更新
    document.getElementById('life-insurance-breakdown').innerHTML = `
        <p>一般生命保険料控除: ${lifeDeduction.toLocaleString()}円</p>
        <p>個人年金保険料控除: ${pensionDeduction.toLocaleString()}円</p>
        <p>介護医療保険料控除: ${nursingDeduction.toLocaleString()}円</p>
        <p class="insurance-total">合計: ${totalDeduction.toLocaleString()}円</p>
    `;

    return totalDeduction;
}

// 医療費控除の計算と表示を更新
function updateMedicalDeductionDisplay(medicalExpenses, totalIncome) {
    const minimumExpenses = Math.max(totalIncome * 0.05, 100000);
    const deduction = Math.max(0, medicalExpenses - minimumExpenses);
    const finalDeduction = Math.min(2000000, deduction);

    document.getElementById('medical-breakdown').innerHTML = `
        <p>支払医療費: ${medicalExpenses.toLocaleString()}円</p>
        <p>差引額（${Math.floor(totalIncome * 0.05).toLocaleString()}円または10万円の多い方）: ${minimumExpenses.toLocaleString()}円</p>
        <p>控除額: ${finalDeduction.toLocaleString()}円</p>
    `;

    return finalDeduction;
}

// 寄付金控除の計算と表示を更新
function updateDonationDeductionDisplay(donation, totalIncome) {
    const maxDeduction = totalIncome * 0.4;
    const deductibleAmount = Math.max(0, donation - 2000);
    const finalDeduction = Math.min(maxDeduction, deductibleAmount);

    document.getElementById('donation-breakdown').innerHTML = `
        <p>寄付金額: ${donation.toLocaleString()}円</p>
        <p>基礎控除額: 2,000円</p>
        <p>控除対象額: ${deductibleAmount.toLocaleString()}円</p>
        <p>所得制限による上限額: ${maxDeduction.toLocaleString()}円</p>
        <p>控除額: ${finalDeduction.toLocaleString()}円</p>
    `;

    return finalDeduction;
}

// 新旧の保険料控除を計算する関数
function calculateInsuranceDeduction(newInsurance, oldInsurance) {
    const newDeduction = calculateSingleInsuranceDeduction(newInsurance);
    const oldDeduction = calculateOldInsuranceDeduction(oldInsurance);
    
    // 新旧の合計額（上限5万円）
    return Math.min(50000, newDeduction + oldDeduction);
}

// 新保険料控除額を計算する関数
function calculateSingleInsuranceDeduction(amount) {
    if (amount <= 20000) {
        return amount;
    } else if (amount <= 40000) {
        return amount * 0.5 + 10000;
    } else {
        return Math.min(40000, amount * 0.25 + 20000);
    }
}

// 旧保険料控除額を計算する関数
function calculateOldInsuranceDeduction(amount) {
    if (amount <= 25000) {
        return amount;
    } else if (amount <= 50000) {
        return amount * 0.5 + 12500;
    } else {
        return Math.min(50000, amount * 0.25 + 25000);
    }
}

// 入力値が変更されたときに所得を再計算する関数
function updateProfits() {
    // 事業所得の計算と表示
    const businessIncome = Number(document.getElementById('business-income').value) || 0;
    const businessExpenses = Number(document.getElementById('business-expenses').value) || 0;
    const businessProfit = Math.max(0, businessIncome - businessExpenses);
    document.getElementById('business-profit').textContent = businessProfit.toLocaleString();

    // 不動産所得の計算と表示
    const realEstateIncome = Number(document.getElementById('real-estate-income').value) || 0;
    const realEstateExpenses = Number(document.getElementById('real-estate-expenses').value) || 0;
    const realEstateProfit = Math.max(0, realEstateIncome - realEstateExpenses);
    document.getElementById('real-estate-profit').textContent = realEstateProfit.toLocaleString();

    // 雑所得の計算と表示
    const miscIncome = Number(document.getElementById('misc-income').value) || 0;
    const miscExpenses = Number(document.getElementById('misc-expenses').value) || 0;
    const miscProfit = Math.max(0, miscIncome - miscExpenses);
    document.getElementById('misc-profit').textContent = miscProfit.toLocaleString();
}

// イベントリスナーの追加
document.addEventListener('DOMContentLoaded', function() {
    // 収入・経費の入力フィールドにイベントリスナーを追加
    const inputIds = [
        'business-income', 'business-expenses',
        'real-estate-income', 'real-estate-expenses',
        'misc-income', 'misc-expenses'
    ];

    inputIds.forEach(id => {
        document.getElementById(id).addEventListener('input', updateProfits);
    });
});

// 基礎控除の説明を更新する関数
function updateBasicDeductionDescription(totalIncome) {
    const descriptionElement = document.getElementById('basic-deduction-description');
    if (!descriptionElement) {
        // 説明表示用の要素がない場合は作成
        const deductionDisplay = document.getElementById('basic-deduction-display').parentElement;
        const description = document.createElement('p');
        description.id = 'basic-deduction-description';
        description.className = 'deduction-description';
        deductionDisplay.appendChild(description);
    }

    let message = '';
    if (totalIncome <= BASIC_DEDUCTION.LIMIT_2400) {
        message = '（所得2400万円以下：48万円）';
    } else if (totalIncome <= BASIC_DEDUCTION.LIMIT_2450) {
        message = '（所得2400万円超2450万円以下：32万円）';
    } else if (totalIncome <= BASIC_DEDUCTION.LIMIT_2500) {
        message = '（所得2450万円超2500万円以下：16万円）';
    } else {
        message = '（所得2500万円超：適用なし）';
    }
    
    document.getElementById('basic-deduction-description').textContent = message;
}

function calculateEarthquakeInsurance(amount) {
    // 地震保険料控除の上限は50,000円
    return Math.min(50000, amount);
} 