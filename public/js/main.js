
document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });

    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', toggleDropdown);
    });

    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', closeModal);
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event);
        }
    });

    const vooForm = document.querySelector('.voo-form');
    if (vooForm) {
        vooForm.addEventListener('submit', validateVooForm);
    }
});

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = this.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    tooltip.style.opacity = '1';
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        document.body.removeChild(tooltip);
    });
}

function toggleDropdown() {
    const dropdown = this.nextElementSibling;
    dropdown.classList.toggle('show');
}

function openModal() {
    const modalId = this.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = this.closest('.modal') || this.target;
    modal.style.display = 'none';
}

function validateVooForm(event) {
    const form = event.target;
    const origem = form.querySelector('#idAeroportoOrigem').value;
    const destino = form.querySelector('#idAeroportoDestino').value;
    const partida = form.querySelector('#data_hora_partida').value;
    const chegada = form.querySelector('#data_hora_chegada').value;
    
    if (origem === destino) {
        event.preventDefault();
        alert('O aeroporto de origem e destino não podem ser o mesmo.');
        return false;
    }
    
    if (new Date(chegada) <= new Date(partida)) {
        event.preventDefault();
        alert('A data e hora de chegada deve ser posterior à data e hora de partida.');
        return false;
    }
    
    return true;
}

function confirmarExclusao(idVoo) {
    const modal = document.getElementById('modal-exclusao');
    const formExcluir = document.getElementById('form-excluir');
    
    formExcluir.action = `/voos/${idVoo}/excluir`;
    
    modal.style.display = 'flex';
    
    document.getElementById('btn-cancelar').onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
