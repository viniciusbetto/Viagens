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

