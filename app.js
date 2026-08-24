// ============================================
//   УПРАВЛЕНИЕ ШАГАМИ В ФОРМЕ
// ============================================

// ============================================
//   УПРАВЛЕНИЕ ШАГАМИ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const stepItems = document.querySelectorAll('.step-indicator__item');
    const stepContents = document.querySelectorAll('.step-content');
    const stepRights = document.querySelectorAll('.step-right');

    function goToStep(stepNumber) {
        // Обновляем степпер (скрываем для шага 5)
        stepItems.forEach(item => {
            const itemStep = parseInt(item.dataset.step);
            if (itemStep === stepNumber) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Для шага 5 скрываем степпер
        if (stepNumber === 5) {
            document.querySelector('.step-indicator').style.display = 'none';
        } else {
            document.querySelector('.step-indicator').style.display = 'flex';
        }

        // Обновляем левую часть
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

        // Обновляем правую часть (для шага 5 - скрываем)
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

        // Для шага 5 скрываем правую часть
        if (stepNumber === 5) {
            document.querySelector('.application__formRight').style.display = 'none';
        } else {
            document.querySelector('.application__formRight').style.display = 'flex';
        }
    }

    // Клик по шагам степпера (только до 4)
    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (step <= 4) {
                goToStep(step);
            }
        });
    });

    // Клик по кнопкам "Продолжить"
    document.querySelectorAll('.application__btn[data-next]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const nextStep = parseInt(this.dataset.next);
            goToStep(nextStep);
        });
    });

    // Кнопка "Отправить заявку" - переход на шаг 5
    document.querySelector('.application__btn:not([data-next])')?.addEventListener('click', function(e) {
        e.preventDefault();
        goToStep(5);
    });

    // Кнопка "На главную" - сброс на шаг 1
    document.querySelector('.application-success__btn')?.addEventListener('click', function() {
        goToStep(1);
        // Показать правую часть обратно
        document.querySelector('.application__formRight').style.display = 'flex';
        document.querySelector('.step-indicator').style.display = 'flex';
        // Очистить поля (опционально)
        // Здесь можно добавить сброс формы
    });

    // Инициализация - шаг 1
    goToStep(1);
});

// Автозаполнение адреса проживания
const sameAddressCheckbox = document.getElementById('sameAddress');
const regAddressInput = document.querySelector('.step-content[data-step="3"] .form-field--full input[placeholder="Город, улица, дом, квартира"]');
const liveAddressInput = document.querySelector('.step-content[data-step="3"] .form-field--full input[placeholder="Заполнится автоматически"]');

if (sameAddressCheckbox && regAddressInput && liveAddressInput) {
    sameAddressCheckbox.addEventListener('change', function() {
        if (this.checked) {
            liveAddressInput.value = regAddressInput.value;
            liveAddressInput.disabled = true;
            liveAddressInput.style.background = '#F5F7FA';
        } else {
            liveAddressInput.value = '';
            liveAddressInput.disabled = false;
            liveAddressInput.style.background = '#FAFCFE';
        }
    });

    // Обновляем адрес проживания, если чекбокс включен и меняется адрес регистрации
    regAddressInput.addEventListener('input', function() {
        if (sameAddressCheckbox.checked) {
            liveAddressInput.value = this.value;
        }
    });
}