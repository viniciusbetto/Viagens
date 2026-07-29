//=====================================================
// Formata moeda
//=====================================================

function moeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

//=====================================================
// Data de hoje
//=====================================================

function hoje() {
    return new Date().toISOString().split("T")[0];
}

//=====================================================
// Formata Data
//=====================================================
function dataBR(data) {
    if (!data) return "";
    let partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

//=====================================================
// Ícones conforme a Despesa
//=====================================================
function iconeDespesa(tipo){
    switch(tipo){
        case "Combustível":
            return "⛽";
        case "Hospedagem":
            return "🏨";
        case "Pedágio":
            return "🛣";
        case "Refeição":
            return "🍽";
        case "Café":
            return "☕";
        case "Bebida":
            return "🥤";
        default:
            return "🛒";
    }
}


document.addEventListener('input', (event) => {
    const elemento = event.target;
    // Verifica se o elemento é um campo de texto (input ou textarea)
    if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
        if (elemento.hasAttribute('data-maiusculo')) {
            elemento.value = elemento.value.toUpperCase();
        }
        if (elemento.hasAttribute('data-minusculo')) {
            elemento.value = elemento.value.toLowerCase();
        }
        // TELEFONE
        if (elemento.hasAttribute('data-telefone')) {
            elemento.value = mascaraTelefone(elemento.value);
        }
        // VALOR MONETARIO
        if (elemento.hasAttribute('data-valor')) {
            let casas =
                elemento.getAttribute('data-valor');
            // padrão = 2 casas
            casas = casas ? parseInt(casas) : 2;
            elemento.value =
                mascaraValor(elemento.value, casas);
        }
    }
});

// ======================================================
// MASCARA TELEFONE
// ======================================================

function mascaraTelefone(valor) {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    // (11) 99999-9999
    valor = valor.replace(
        /(\d{2})(\d)/,
        '($1) $2'
    );
    valor = valor.replace(
        /(\d)(\d{4})$/,
        '$1-$2'
    );
    return valor;
}

// ======================================================
// MASCARA VALOR
// ======================================================

function mascaraValor(valor, decimais = 2) {
    if (!valor) return '';
    // somente numeros
    valor = valor.replace(/\D/g, '');
    valor = Number(valor);
    valor = valor / Math.pow(10, decimais);
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais
    });
}

