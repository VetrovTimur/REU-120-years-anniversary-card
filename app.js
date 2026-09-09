// ============================================
//   ВАЛИДАЦИЯ ДАННЫХ (МГНОВЕННАЯ)
// ============================================

// ===== РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ =====
const VALIDATORS = {
    name: /^[А-Яа-яЁё\s\-]{2,50}$/,
    date: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19[0-9]{2}|20[0-2][0-9])$/,
    passportSeries: /^\d{4}$/,
    passportNumber: /^\d{6}$/,
    departmentCode: /^\d{3}-\d{3}$/,
    phone: /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$|^\+7\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/,
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    address: /^.{5,200}$/,
    text: /^.{2,500}$/
};

// ===== ВАЛИДАЦИЯ ПОЛЯ =====
function validateField(input) {
    const type = input.dataset.type;
    const value = input.value.trim();
    const errorSpan = input.parentElement.querySelector('.field-error');

    if (!errorSpan) return true;

    if (input.dataset.required === 'true' && value === '') {
        errorSpan.textContent = 'Это поле обязательно для заполнения';
        errorSpan.classList.add('visible');
        input.classList.remove('valid');
        input.classList.add('error');
        return false;
    }

    if (input.dataset.required !== 'true' && value === '') {
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
        input.classList.remove('error', 'valid');
        return true;
    }

    let isValid = true;
    let errorMsg = '';

    switch (type) {
        case 'name':
            if (!VALIDATORS.name.test(value)) {
                isValid = false;
                errorMsg = 'Только русские буквы (2-50 символов)';
            }
            break;
        case 'date': {
            if (!VALIDATORS.date.test(value)) {
                isValid = false;
                errorMsg = 'Формат: ДД.ММ.ГГГГ (например, 15.05.1990)';
            } else {
                const parts = value.split('.');
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                const date = new Date(year, month, day);
                if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
                    isValid = false;
                    errorMsg = 'Некорректная дата';
                } else if (date > new Date()) {
                    isValid = false;
                    errorMsg = 'Дата не может быть в будущем';
                } else if (year < 1900) {
                    isValid = false;
                    errorMsg = 'Год не ранее 1900';
                }
            }
            break;
        }
        case 'passportSeries':
            if (!VALIDATORS.passportSeries.test(value)) {
                isValid = false;
                errorMsg = '4 цифры (например, 4512)';
            }
            break;
        case 'passportNumber':
            if (!VALIDATORS.passportNumber.test(value)) {
                isValid = false;
                errorMsg = '6 цифр (например, 123456)';
            }
            break;
        case 'departmentCode':
            if (!VALIDATORS.departmentCode.test(value)) {
                isValid = false;
                errorMsg = 'Формат: 000-000 (например, 123-456)';
            }
            break;
        case 'phone':
            if (!VALIDATORS.phone.test(value)) {
                isValid = false;
                errorMsg = 'Формат: +7 (XXX) XXX-XX-XX';
            }
            break;
        case 'email':
            if (!VALIDATORS.email.test(value)) {
                isValid = false;
                errorMsg = 'Введите корректный email';
            }
            break;
        case 'address':
            if (value.length < 5) {
                isValid = false;
                errorMsg = 'Минимум 5 символов';
            }
            break;
        default:
            if (input.dataset.required === 'true' && value.length < 2) {
                isValid = false;
                errorMsg = 'Минимум 2 символа';
            }
            break;
    }

    if (isValid) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
        input.classList.remove('error');
        input.classList.add('valid');
    } else {
        errorSpan.textContent = errorMsg;
        errorSpan.classList.add('visible');
        input.classList.remove('valid');
        input.classList.add('error');
    }

    return isValid;
}

// ===== ВАЛИДАЦИЯ ВСЕХ ПОЛЕЙ В ШАГЕ =====
function validateStep(stepNumber) {
    const stepContent = document.querySelector(`.step-content[data-step="${stepNumber}"]`);
    if (!stepContent) return true;

    const inputs = stepContent.querySelectorAll('input[data-required="true"]');
    let allValid = true;

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            const errorSpan = input.closest('.application-form__checkbox-label')?.querySelector('.field-error');
            if (errorSpan) {
                if (input.checked) {
                    errorSpan.textContent = '';
                    errorSpan.classList.remove('visible');
                } else {
                    errorSpan.textContent = 'Необходимо дать согласие';
                    errorSpan.classList.add('visible');
                    allValid = false;
                }
            }
            return;
        }
        if (!validateField(input)) {
            allValid = false;
        }
    });

    return allValid;
}

// ===== ОЧИСТКА ОШИБОК =====
function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    document.querySelectorAll('.form-field__input').forEach(el => {
        el.classList.remove('error', 'valid');
    });
}

// ============================================
//   ЛЁГКАЯ ЗАЩИТА ОТ ОТЛАДКИ (ИСПРАВЛЕННАЯ)
// ============================================

(function() {
    let warned = false;

    // Ждём 3 секунды перед активацией защиты
    setTimeout(function() {
        // Блокировка правой кнопки (без alert, просто preventDefault)
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // Блокировка клавиш (без alert, просто preventDefault)
        document.addEventListener('keydown', function(e) {
            const blockedKeys = [
                'F12',
                'F11',
                'F10',
                'F9',
                'F8',
                'F7',
                'F6',
                'F5'
            ];
            if (blockedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                return;
            }
            if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                return;
            }
        });

        // Проверка на открытую консоль (с задержкой и порогом)
        let consoleCheckInterval = setInterval(function() {
            try {
                // Проверяем только если окно достаточно большое (не мобилка)
                if (window.innerWidth > 600 && window.innerHeight > 400) {
                    const heightDiff = window.outerHeight - window.innerHeight;
                    const widthDiff = window.outerWidth - window.innerWidth;
                    
                    // Более строгий порог
                    if (heightDiff > 300 || widthDiff > 300) {
                        if (!warned) {
                            warned = true;
                            // Показываем только 1 раз
                            alert('⚠️ Обнаружены открытые инструменты разработчика. Пожалуйста, закройте их для корректной работы.');
                            // Можно также показать уведомление на странице
                            showWarningNotification();
                        }
                    } else {
                        // Если консоль закрыли — сбрасываем флаг
                        if (heightDiff < 200 && widthDiff < 200) {
                            warned = false;
                            hideWarningNotification();
                        }
                    }
                }
            } catch(e) {
                // Игнорируем ошибки
            }
        }, 2000); // Проверяем каждые 2 секунды (не каждую секунду)

        // Если страница загружена в iframe — тоже предупреждение (но без блокировки)
        try {
            if (window.top !== window.self) {
                console.warn('⚠️ Страница открыта во фрейме. Некоторые функции могут быть ограничены.');
            }
        } catch(e) {
            // ignore
        }

    }, 3000); // Ждём 3 секунды перед активацией защиты

    // ===== ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ (НЕНАВЯЗЧИВОЕ) =====
    function showWarningNotification() {
        // Проверяем, есть ли уже такое уведомление
        if (document.getElementById('devtools-warning')) return;

        const notification = document.createElement('div');
        notification.id = 'devtools-warning';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            animation: slideIn 0.5s ease;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        notification.innerHTML = `
            <span style="font-size:20px;">⚠️</span>
            <div>
                <strong>Инструменты разработчика</strong>
                <p style="margin:4px 0 0 0;font-size:13px;color:#856404;">
                    Закройте консоль для корректной работы формы.
                </p>
            </div>
            <button onclick="this.parentElement.remove()" style="
                background:none;
                border:none;
                font-size:18px;
                cursor:pointer;
                color:#856404;
                padding:0 4px;
            ">×</button>
        `;

        // Добавляем анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);
    }

    function hideWarningNotification() {
        const notification = document.getElementById('devtools-warning');
        if (notification) {
            notification.remove();
        }
    }

})();

// ============================================
//   ОСНОВНАЯ ЛОГИКА
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    let applications = JSON.parse(localStorage.getItem('applications')) || [];

    const stepItems = document.querySelectorAll('.step-indicator__item');
    const stepContents = document.querySelectorAll('.step-content');
    const stepRights = document.querySelectorAll('.step-right');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exportBtn = document.getElementById('exportExcelBtn');
    const clearBtn = document.getElementById('clearDataBtn');
    const tableBody = document.getElementById('dataTableBody');
    const recordsCount = document.getElementById('recordsCount');
    const successList = document.getElementById('successList');

    function goToStep(stepNumber) {
        stepItems.forEach(item => {
            const itemStep = parseInt(item.dataset.step);
            item.classList.toggle('active', itemStep === stepNumber);
        });

        if (stepNumber === 5) {
            document.querySelector('.step-indicator').style.display = 'none';
        } else {
            document.querySelector('.step-indicator').style.display = 'flex';
        }

        stepContents.forEach(content => {
            const contentStep = parseInt(content.dataset.step);
            if (contentStep === stepNumber) {
                content.classList.add('active');
                content.style.display = 'flex';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
            }
        });

        stepRights.forEach(right => {
            const rightStep = parseInt(right.dataset.step);
            if (rightStep === stepNumber) {
                right.classList.add('active');
                right.style.display = 'flex';
            } else {
                right.classList.remove('active');
                right.style.display = 'none';
            }
        });

        const rightBlock = document.querySelector('.application__formRight');
        if (stepNumber === 5) {
            rightBlock.style.display = 'none';
        } else {
            rightBlock.style.display = 'flex';
        }

        clearErrors();
    }

    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (step <= 4) {
                const prevStep = step - 1;
                if (prevStep >= 1 && !validateStep(prevStep)) {
                    alert('⚠️ Пожалуйста, заполните все поля на предыдущем шаге.');
                    return;
                }
                goToStep(step);
            }
        });
    });

    document.querySelectorAll('.application__btn[data-next]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStep = parseInt(this.closest('.step-content').dataset.step);

            if (!validateStep(currentStep)) {
                alert('⚠️ Исправьте ошибки в заполнении полей.');
                return;
            }

            goToStep(parseInt(this.dataset.next));
        });
    });

    // ===== МГНОВЕННАЯ ВАЛИДАЦИЯ =====
    document.querySelectorAll('.form-field__input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                const errorSpan = this.parentElement.querySelector('.field-error');
                if (errorSpan) {
                    errorSpan.textContent = '';
                    errorSpan.classList.remove('visible');
                }
                this.classList.remove('error');
            }
        });

        input.addEventListener('blur', function() {
            if (this.dataset.required === 'true' || this.value.trim() !== '') {
                validateField(this);
            }
        });

        input.addEventListener('input', function() {
            if (this.dataset.required === 'true' && this.value.trim() !== '') {
                const errorSpan = this.parentElement.querySelector('.field-error');
                if (errorSpan && errorSpan.textContent === '') {
                    const type = this.dataset.type;
                    let isValid = true;
                    if (type) {
                        const value = this.value.trim();
                        switch (type) {
                            case 'name':
                                isValid = VALIDATORS.name.test(value);
                                break;
                            case 'date':
                                isValid = VALIDATORS.date.test(value);
                                break;
                            case 'passportSeries':
                                isValid = VALIDATORS.passportSeries.test(value);
                                break;
                            case 'passportNumber':
                                isValid = VALIDATORS.passportNumber.test(value);
                                break;
                            case 'departmentCode':
                                isValid = VALIDATORS.departmentCode.test(value);
                                break;
                            case 'phone':
                                isValid = VALIDATORS.phone.test(value);
                                break;
                            case 'email':
                                isValid = VALIDATORS.email.test(value);
                                break;
                            case 'address':
                                isValid = value.length >= 5;
                                break;
                            default:
                                isValid = value.length >= 2;
                                break;
                        }
                    } else {
                        isValid = this.value.trim().length >= 2;
                    }
                    if (isValid) {
                        this.classList.add('valid');
                        this.classList.remove('error');
                    } else {
                        this.classList.remove('valid');
                    }
                }
            }
        });
    });

    document.querySelectorAll('.application-form__checkbox-input[data-required="true"]').forEach(cb => {
        cb.addEventListener('change', function() {
            const errorSpan = this.closest('.application-form__checkbox-label')?.querySelector('.field-error');
            if (errorSpan) {
                if (this.checked) {
                    errorSpan.textContent = '';
                    errorSpan.classList.remove('visible');
                } else {
                    errorSpan.textContent = 'Необходимо дать согласие';
                    errorSpan.classList.add('visible');
                }
            }
        });
    });

    function collectFormData() {
        const fields = document.querySelectorAll('[data-field]');
        const data = {};
        fields.forEach(input => {
            const key = input.dataset.field;
            if (input.type === 'checkbox') {
                data[key] = input.checked ? 'Да' : 'Нет';
            } else {
                data[key] = input.value || '';
            }
        });

        const designRadio = document.querySelector('input[name="cardDesign"]:checked');
        data.cardDesign = designRadio ? designRadio.value : 'Не выбран';

        const deliveryRadio = document.querySelector('input[name="deliveryMethod"]:checked');
        data.deliveryMethod = deliveryRadio ? deliveryRadio.value : 'Не выбран';

        const rightConsent = document.querySelector('input[name="rightConsent"]');
        data.rightConsent = rightConsent ? (rightConsent.checked ? 'Да' : 'Нет') : 'Нет';

        const rightSalary = document.querySelector('input[name="rightSalary"]');
        data.rightSalary = rightSalary ? (rightSalary.checked ? 'Да' : 'Нет') : 'Нет';

        data.applicationDate = new Date().toLocaleString('ru-RU');
        data.fullName = `${data.lastName || ''} ${data.firstName || ''} ${data.middleName || ''}`.trim();

        return data;
    }

    function addApplication(data) {
        applications.push(data);
        localStorage.setItem('applications', JSON.stringify(applications));
        renderTable();
        updateSuccessInfo(data);
    }

    function updateSuccessInfo(data) {
        successList.innerHTML = `
            <li><span class="application-success__info-label">ФИО</span><span class="application-success__info-value">${data.fullName || '—'}</span></li>
            <li><span class="application-success__info-label">Дизайн</span><span class="application-success__info-value">${data.cardDesign || '—'}</span></li>
            <li><span class="application-success__info-label">Получение</span><span class="application-success__info-value">${data.deliveryMethod || '—'}</span></li>
            <li><span class="application-success__info-label">Телефон</span><span class="application-success__info-value">${data.phone || '—'}</span></li>
        `;
    }

    function renderTable() {
        if (applications.length === 0) {
            tableBody.innerHTML = `<tr class="empty-row"><td colspan="8">Нет данных. Отправьте первую заявку.</td></tr>`;
            recordsCount.textContent = 'Всего: 0 записей';
            return;
        }

        let html = '';
        applications.forEach((app, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${app.fullName || '—'}</strong></td>
                    <td>${app.birthDate || '—'}</td>
                    <td>${app.phone || '—'}</td>
                    <td>${app.email || '—'}</td>
                    <td>${app.cardDesign || '—'}</td>
                    <td>${app.deliveryMethod || '—'}</td>
                    <td style="font-size:12px;color:#5e6b7a;">${app.applicationDate || '—'}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
        recordsCount.textContent = `Всего: ${applications.length} записей`;
    }

    function exportToExcel(triggerDownload = true) {
        if (applications.length === 0) {
            if (triggerDownload) alert('Нет данных для экспорта.');
            return;
        }

        const exportData = applications.map((app, index) => ({
            '№': index + 1,
            'Фамилия': app.lastName || '',
            'Имя': app.firstName || '',
            'Отчество': app.middleName || '',
            'ФИО': app.fullName || '',
            'Дата рождения': app.birthDate || '',
            'Место рождения': app.birthPlace || '',
            'Серия паспорта': app.passportSeries || '',
            'Номер паспорта': app.passportNumber || '',
            'Кем выдан': app.issuedBy || '',
            'Дата выдачи': app.issueDate || '',
            'Код подразделения': app.departmentCode || '',
            'Адрес регистрации': app.registrationAddress || '',
            'Адрес проживания': app.residentialAddress || '',
            'Телефон': app.phone || '',
            'Email': app.email || '',
            'Дизайн карты': app.cardDesign || '',
            'Способ получения': app.deliveryMethod || '',
            'Согласие на обработку ПД': app.consent1 || 'Нет',
            'Согласие на передачу банку': app.consent2 || 'Нет',
            'Зарплатный проект': app.salaryConsent || 'Нет',
            'Дата заявки': app.applicationDate || ''
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        ws['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: 18 }));
        XLSX.utils.book_append_sheet(wb, ws, 'Заявки');

        if (triggerDownload) {
            XLSX.writeFile(wb, `Заявки_РЭУ_${new Date().toISOString().slice(0,10)}.xlsx`);
        } else {
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Заявки_РЭУ_${new Date().toISOString().slice(0,10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    }

    function clearAllData() {
        if (applications.length === 0) {
            alert('Нет данных для очистки.');
            return;
        }
        if (confirm('Удалить все сохранённые заявки?')) {
            applications = [];
            localStorage.setItem('applications', JSON.stringify(applications));
            renderTable();
        }
    }

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        let allValid = true;
        let firstErrorStep = 1;
        for (let i = 1; i <= 4; i++) {
            if (!validateStep(i)) {
                allValid = false;
                if (firstErrorStep === 1) firstErrorStep = i;
            }
        }

        if (!allValid) {
            alert('⚠️ Исправьте все ошибки в форме.');
            goToStep(firstErrorStep);
            return;
        }

        const data = collectFormData();
        addApplication(data);

        setTimeout(() => {
            exportToExcel(true);
        }, 500);

        goToStep(5);
    });

    resetBtn.addEventListener('click', function() {
        goToStep(1);
        document.querySelector('.application__formRight').style.display = 'flex';
        document.querySelector('.step-indicator').style.display = 'flex';

        document.querySelectorAll('input[data-field]').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.classList.remove('error', 'valid');
        });
        document.querySelector('input[name="cardDesign"][value="История и традиции РЭУ"]').checked = true;
        document.querySelector('input[name="deliveryMethod"][value="В РЭУ (коллективная выдача)"]').checked = true;
        clearErrors();
    });

    exportBtn.addEventListener('click', function() {
        exportToExcel(true);
    });

    clearBtn.addEventListener('click', clearAllData);

    // ===== АВТОЗАПОЛНЕНИЕ АДРЕСА =====
    const sameAddressCheckbox = document.getElementById('sameAddress');
    const regAddressInput = document.querySelector('.step-content[data-step="3"] .form-field--full input[data-field="registrationAddress"]');
    const liveAddressInput = document.querySelector('.step-content[data-step="3"] .form-field--full input[data-field="residentialAddress"]');

    if (sameAddressCheckbox && regAddressInput && liveAddressInput) {
        sameAddressCheckbox.addEventListener('change', function() {
            if (this.checked) {
                liveAddressInput.value = regAddressInput.value;
                liveAddressInput.disabled = true;
                liveAddressInput.style.background = '#f5f7fa';
                if (regAddressInput.value.trim() !== '') {
                    liveAddressInput.classList.add('valid');
                }
            } else {
                liveAddressInput.value = '';
                liveAddressInput.disabled = false;
                liveAddressInput.style.background = '#fafcfe';
                liveAddressInput.classList.remove('valid');
            }
        });
        regAddressInput.addEventListener('input', function() {
            if (sameAddressCheckbox.checked) {
                liveAddressInput.value = this.value;
                if (this.value.trim() !== '') {
                    liveAddressInput.classList.add('valid');
                } else {
                    liveAddressInput.classList.remove('valid');
                }
            }
        });
    }

    goToStep(1);
    renderTable();

    window.addEventListener('beforeunload', function() {
        localStorage.setItem('applications', JSON.stringify(applications));
    });
});