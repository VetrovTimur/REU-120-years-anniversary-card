
document.addEventListener('DOMContentLoaded', function() {
    const stepItems = document.querySelectorAll('.step-indicator__item');
    const stepContents = document.querySelectorAll('.step-content');
    const stepRights = document.querySelectorAll('.step-right');

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
    }

    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (step <= 4) goToStep(step);
        });
    });

    document.querySelectorAll('.application__btn[data-next]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const nextStep = parseInt(this.dataset.next);
            goToStep(nextStep);
        });
    });

    document.querySelector('.application__btn:not([data-next])')?.addEventListener('click', function(e) {
        e.preventDefault();
        goToStep(5);
    });

    document.querySelector('.application-success__btn')?.addEventListener('click', function() {
        goToStep(1);
        document.querySelector('.application__formRight').style.display = 'flex';
        document.querySelector('.step-indicator').style.display = 'flex';
    });

    goToStep(1);

    // Автозаполнение адреса
    const sameAddressCheckbox = document.getElementById('sameAddress');
    const regAddressInput = document.querySelector('.step-content[data-step="3"] .form-field--full input[placeholder="Город, улица, дом, квартира"]');
    const liveAddressInput = document.querySelector('.step-content[data-step="3"] .form-field--full input[placeholder="Заполнится автоматически"]');

    if (sameAddressCheckbox && regAddressInput && liveAddressInput) {
        sameAddressCheckbox.addEventListener('change', function() {
            if (this.checked) {
                liveAddressInput.value = regAddressInput.value;
                liveAddressInput.disabled = true;
                liveAddressInput.style.background = '#f5f7fa';
            } else {
                liveAddressInput.value = '';
                liveAddressInput.disabled = false;
                liveAddressInput.style.background = '#fafcfe';
            }
        });
        regAddressInput.addEventListener('input', function() {
            if (sameAddressCheckbox.checked) {
                liveAddressInput.value = this.value;
            }
        });
    }
});
   