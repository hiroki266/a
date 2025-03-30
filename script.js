function calculateTax() {
    // 収入の取得
    const salary = Number(document.getElementById('salary').value) || 0;
    
    // その他の収入の取得
    const businessIncome = Number(document.getElementById('business-income').value) || 0;
    const realEstateIncome = Number(document.getElementById('real-estate-income').value) || 0;
    const dividendIncome = Number(document.getElementById('dividend-income').value) || 0;
    const miscIncome = Number(document.getElementById('misc-income').value) || 0;
    const transferIncome = Number(document.getElementById('transfer-income').value) || 0;
    const temporaryIncome = Number(document.getElementById('temporary-income').value) || 0;

    // 給与所得の計算
    const employmentIncome = calculateEmploymentIncome(salary);

    // その他の収入の合計
    const otherIncome = businessIncome + realEstateIncome + dividendIncome + 
                       miscIncome + transferIncome + temporaryIncome;

    // 控除の取得
    const basicDeduction = 480000; // 基礎控除
    const socialInsurance = Number(document.getElementById('social-insurance').value) || 0;
    const lifeInsurance = Number(document.getElementById('life-insurance').value) || 0;

    // 総所得金額の計算
    const totalIncome = employmentIncome + otherIncome;

    // 控除総額の計算
    const totalDeduction = basicDeduction + socialInsurance + lifeInsurance;

    // 課税所得金額の計算
    const taxableIncome = Math.max(0, totalIncome - totalDeduction);

    // 所得税額の計算（累進課税）
    let incomeTax = calculateIncomeTax(taxableIncome);

    // 復興特別所得税の計算（所得税額の2.1%）
    const specialTax = Math.floor(incomeTax * 0.021);

    // 合計税額
    const totalTax = incomeTax + specialTax;

    // 結果の表示を更新
    document.getElementById('total-salary').textContent = salary.toLocaleString();
    document.getElementById('employment-income').textContent = employmentIncome.toLocaleString();
    document.getElementById('business-income-display').textContent = businessIncome.toLocaleString();
    document.getElementById('real-estate-income-display').textContent = realEstateIncome.toLocaleString();
    document.getElementById('dividend-income-display').textContent = dividendIncome.toLocaleString();
    document.getElementById('misc-income-display').textContent = miscIncome.toLocaleString();
    document.getElementById('transfer-income-display').textContent = transferIncome.toLocaleString();
    document.getElementById('temporary-income-display').textContent = temporaryIncome.toLocaleString();
    document.getElementById('total-income').textContent = totalIncome.toLocaleString();
    document.getElementById('total-deduction').textContent = totalDeduction.toLocaleString();
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