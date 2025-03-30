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
                       transferIncome + 
                       temporaryIncome;

    // 所得の内訳を表示
    document.getElementById('total-salary').textContent = salary.toLocaleString();
    document.getElementById('employment-income').textContent = employmentIncome.toLocaleString();
    document.getElementById('business-profit').textContent = businessProfit.toLocaleString();
    document.getElementById('real-estate-profit').textContent = realEstateProfit.toLocaleString();
    document.getElementById('misc-profit').textContent = miscProfit.toLocaleString();
    
    // 控除の取得
    const basicDeduction = 480000; // 基礎控除
    const socialInsurance = Number(document.getElementById('social-insurance').value) || 0;
    const smallBusiness = Number(document.getElementById('small-business').value) || 0;
    const lifeInsurance = calculateLifeInsurance(); // 生命保険料控除の計算を更新
    const earthquakeInsurance = Number(document.getElementById('earthquake-insurance').value) || 0;
    const dependent = Number(document.getElementById('dependent').value) || 0;
    const widowSingleParent = Number(document.getElementById('widow-single-parent').value) || 0;
    const studentDisability = Number(document.getElementById('student-disability').value) || 0;
    const casualtyLoss = Number(document.getElementById('casualty-loss').value) || 0;
    const medical = Number(document.getElementById('medical').value) || 0;
    const donation = Number(document.getElementById('donation').value) || 0;

    // 控除総額の計算
    const totalDeduction = basicDeduction + 
                         socialInsurance + 
                         smallBusiness + 
                         lifeInsurance + 
                         earthquakeInsurance + 
                         dependent + 
                         widowSingleParent + 
                         studentDisability + 
                         casualtyLoss + 
                         medical + 
                         donation;

    // 課税所得金額の計算
    const taxableIncome = Math.max(0, totalIncome - totalDeduction);

    // 所得税額の計算（累進課税）
    let incomeTax = calculateIncomeTax(taxableIncome);

    // 復興特別所得税の計算（所得税額の2.1%）
    const specialTax = Math.floor(incomeTax * 0.021);

    // 合計税額
    const totalTax = incomeTax + specialTax;

    // 結果の表示を更新
    document.getElementById('total-income').textContent = totalIncome.toLocaleString();
    document.getElementById('total-deductions-display').textContent = totalDeduction.toLocaleString();
    document.getElementById('basic-deduction-display').textContent = basicDeduction.toLocaleString();
    document.getElementById('social-insurance-display').textContent = socialInsurance.toLocaleString();
    document.getElementById('small-business-display').textContent = smallBusiness.toLocaleString();
    document.getElementById('life-insurance-display').textContent = lifeInsurance.toLocaleString();
    document.getElementById('earthquake-insurance-display').textContent = earthquakeInsurance.toLocaleString();
    document.getElementById('dependent-display').textContent = dependent.toLocaleString();
    document.getElementById('widow-single-parent-display').textContent = widowSingleParent.toLocaleString();
    document.getElementById('student-disability-display').textContent = studentDisability.toLocaleString();
    document.getElementById('casualty-loss-display').textContent = casualtyLoss.toLocaleString();
    document.getElementById('medical-display').textContent = medical.toLocaleString();
    document.getElementById('donation-display').textContent = donation.toLocaleString();
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

// 生命保険料控除を計算する関数
function calculateLifeInsurance() {
    // 各保険料の取得
    const newLifeInsurance = Number(document.getElementById('new-life-insurance').value) || 0;
    const oldLifeInsurance = Number(document.getElementById('old-life-insurance').value) || 0;
    const newPensionInsurance = Number(document.getElementById('new-pension-insurance').value) || 0;
    const oldPensionInsurance = Number(document.getElementById('old-pension-insurance').value) || 0;
    const nursingInsurance = Number(document.getElementById('nursing-insurance').value) || 0;

    // 一般生命保険料控除額の計算（新旧合計）
    const lifeInsuranceDeduction = calculateInsuranceDeduction(newLifeInsurance, oldLifeInsurance);

    // 個人年金保険料控除額の計算（新旧合計）
    const pensionInsuranceDeduction = calculateInsuranceDeduction(newPensionInsurance, oldPensionInsurance);

    // 介護医療保険料控除額の計算
    const nursingInsuranceDeduction = calculateSingleInsuranceDeduction(nursingInsurance);

    // 合計控除額（上限12万円）
    const totalDeduction = Math.min(120000, lifeInsuranceDeduction + pensionInsuranceDeduction + nursingInsuranceDeduction);

    // 結果を表示
    document.getElementById('life-insurance-total').textContent = totalDeduction.toLocaleString();

    return totalDeduction;
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