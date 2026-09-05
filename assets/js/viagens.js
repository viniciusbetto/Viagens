//=====================================================
// Modal Bootstrap
//=====================================================

let modal = null;

//=====================================================
// Inicialização
//=====================================================

function configurarInterface() {
    modal = new bootstrap.Modal(
        document.getElementById("modalViagem")
    );
    document.getElementById("btnNovaViagem").addEventListener("click", abrirModal);
    document.getElementById("btnSalvarViagem").addEventListener("click", salvarViagem);
    document.getElementById("dataInicio").value = hoje();
    document.getElementById("btnExportarJSON").addEventListener("click", function(e){
        e.preventDefault();
        exportarJSON();
    });    
    document.getElementById("btnExportarCSVViagens").addEventListener("click", function(e){
            e.preventDefault();
            exportarCSVViagens();
    });
    document.getElementById("btnExportarCSVDespesas").addEventListener("click", function(e){
            e.preventDefault();
            exportarCSVDespesas();
    });
    document.getElementById("btnImportarJSON").addEventListener("click", function(e){
        e.preventDefault();
        importarJSON();
    });    

}

//=====================================================
// Abre Modal
//=====================================================

function abrirModal() {
    limparFormulario();
    document.getElementById("id").value = "";
    document.getElementById("dataInicio").value = hoje();
    document.getElementById("btnSalvarViagem").innerHTML = `
        💾 Salvar
    `;
    modal.show();
}

//=====================================================
// Fecha Modal
//=====================================================

function fecharModal() {
    modal.hide();
    document.activeElement.blur();
}

//=====================================================
// Limpa formulário
//=====================================================

function limparFormulario() {
    document.getElementById("formViagem").reset();
    document.getElementById("id").value = "";
}

//=====================================================
// Salvar ou Atualizar
//=====================================================

function salvarViagem() {
    let id = document.getElementById("id").value;
    let viagem = {
        nome: document.getElementById("nome").value.trim(),
        destino: document.getElementById("destino").value.trim(),
        dataInicio: document.getElementById("dataInicio").value,
        kmFinal: Number(document.getElementById("kmFinal").value || 0),
        kmInicial: Number(document.getElementById("kmInicial").value),
        observacoes: document.getElementById("observacoes").value.trim(),
        criadoEm: new Date().toISOString()
    };

    if (viagem.nome == "") {
        alert("Informe o nome da viagem.");
        document.getElementById("nome").focus();
        return;
    }

    // NOVA VIAGEM

    if (id == "") {
        salvar("viagens", viagem, function () {
            fecharModal();
            listarViagens();
        });
        return;
    }

    // EDIÇÃO
    viagem.id = Number(id);
    atualizar("viagens", viagem, function () {
        fecharModal();
        listarViagens();
    });
}

//=====================================================
// Lista viagens
//=====================================================

function listarViagens() {
    listar("viagens", function (viagens) {
        let html = "";
        if (viagens.length == 0) {
            html = `
                <div class="sem-viagens">
                    📁 <h5>Nenhuma viagem cadastrada</h5>
                    <p>
                        Clique em Nova Viagem.
                    </p>
                </div>
            `;
        }
        else {
            viagens.forEach(function (viagem) {
                html += montarCard(viagem);
            });
        }
        document.getElementById("listaViagens").innerHTML = html;
        viagens.forEach(function(v){
            montarListaDespesas(v.id);
            atualizarResumo(v.id);
            atualizarResumoCard(v.id);
        });
        configurarBotoes();
    });
}

//=====================================================
// Monta card da viagem
//=====================================================

function montarCard(viagem) {
    return `
    <div class="card viagem-card shadow-sm mb-3">
        <div class="card-body">
            <!-- Cabeçalho da viagem -->
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">
                        🌎 ${viagem.nome}
                    </h5>
                    <div class="text-muted">
                        📍
                        ${viagem.destino || "Destino não informado"}
                    </div>
                    <div class="text-muted">
                        📅
                        ${dataBR(viagem.dataInicio)}
                    </div>

                    <small class="text-muted">
                        💰
                        Total Gasto
                    </small>
                    <strong
                        class="text-success"
                        id="totalCard${viagem.id}">
                        R$ 0,00
                    </strong>
                    <br>
                    🛣️
                    <strong
                        id="kmResumo${viagem.id}">
                        0
                    </strong>
                    <strong
                        id="mediaResumo${viagem.id}">
                        --
                    </strong>
                </div>

                <button
                    class="btn btn-outline-primary btnAbrir"
                    data-id="${viagem.id}"
                    data-bs-toggle="collapse"
                    data-bs-target="#viagem${viagem.id}">
                        ⇓
                </button>
            </div>
            <hr>
            <!-- Total -->

            <!--
            <div class="row mt-3 text-center">
                <div class="col-12 col-sm-6 col-md-4 resumo-box">
                    <small class="text-muted">
                        Total Gasto
                    </small>
                    <br>
                    <strong
                        class="text-success"
                        id="totalCard${viagem.id}">
                        R$ 0,00
                    </strong>
                </div>
                <div class="col-12 col-sm-6 col-md-4 resumo-box">
                    <small class="text-muted">
                        KM
                    </small>
                    <br>
                    <strong
                        id="kmResumo${viagem.id}">
                        0
                    </strong>
                </div>
                <div class="col-12 col-sm-6 col-md-4 resumo-box">
                    <small class="text-muted">
                        Média
                    </small>
                    <br>
                    <strong
                        id="mediaResumo${viagem.id}">
                        --
                    </strong>
                </div>
            </div>
            -->

            <!-- Área expansível -->
            <div
                class="collapse mt-3"
                id="viagem${viagem.id}">
                <hr>
                <h6>
                    Resumo da viagem
                </h6>
                <div class="row text-center mt-3">
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="resumo-box">
                            ⛽
                            <br>
                            Combustível
                            <br>
                            <strong id="combustivel${viagem.id}">
                                R$ 0,00
                            </strong>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="resumo-box">
                            🏨
                            <br>
                            Hospedagem
                            <br>
                            <strong id="hospedagem${viagem.id}">
                                R$ 0,00
                            </strong>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="resumo-box">
                            🍽
                            <br>
                            Alimentação
                            <br>
                            <strong id="refeicao${viagem.id}">
                                R$ 0,00
                            </strong>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="resumo-box">
                            🛣
                            <br>
                            Pedágios
                            <br>
                            <strong id="pedagio${viagem.id}">
                                R$ 0,00
                            </strong>
                        </div>
                    </div>     
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="resumo-box">
                            ☕
                            <br>
                            Cafés
                            <br>
                            <strong id="cafe${viagem.id}">
                                R$ 0,00
                            </strong>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="resumo-box">
                            🛒
                            <br>
                            Outros
                            <br>
                            <strong id="outros${viagem.id}">
                                R$ 0,00
                            </strong>
                        </div>
                    </div>                                                       
                </div>
                <div class="mt-3">
                    <h6>
                        Despesas
                    </h6>
                    <div id="listaDespesas${viagem.id}">
                        <p class="text-muted text-center">
                            Carregando...
                        </p>
                    </div>
                </div>        
                <div class="mt-4 text-center">
                    <button
                        class="btn btn-primary btnNovaDespesa"
                        data-id="${viagem.id}">
                        <b>+</b>
                        Nova Despesa
                    </button>
                </div>
            </div>
            <div class="mt-3 d-flex gap-2">
                <button
                    class="btn btn-warning btnEditar"
                    data-id="${viagem.id}">
                    ✏️
                </button>
                <button
                    class="btn btn-danger btnExcluir"
                    data-id="${viagem.id}">
                    🗑️
                </button>
            </div>
        </div>
    </div>
    `;
}

//=====================================================
// Eventos dos Cards
//=====================================================

function configurarBotoes() {
    document.querySelectorAll(".btnNovaDespesa").forEach(function(botao){
        botao.onclick=function(){
            abrirDespesa(this.dataset.id);
        };
    });

    document.querySelectorAll(".btnEditar").forEach(function (botao) {
        botao.onclick = function () {
            editarViagem(this.dataset.id);
        };

    });

    document.querySelectorAll(".btnExcluir").forEach(function (botao) {
        botao.onclick = function () {
            excluirViagem(this.dataset.id);
        };
    });
}

//=====================================================

function editarViagem(id) {
    buscar("viagens", Number(id), function (viagem) {
        document.getElementById("id").value = viagem.id;
        document.getElementById("nome").value = viagem.nome;
        document.getElementById("destino").value = viagem.destino;
        document.getElementById("dataInicio").value = viagem.dataInicio;
        document.getElementById("kmInicial").value = viagem.kmInicial;
        document.getElementById("kmFinal").value = viagem.kmFinal || "";
        document.getElementById("observacoes").value = viagem.observacoes;
        document.getElementById("btnSalvarViagem").innerHTML = `
            ✔️
            Atualizar
        `;
        modal.show();
    });
}

//=====================================================

function excluirViagem(id){
    if(!confirm("Deseja excluir esta viagem ?")){
        return;
    }
    excluir("viagens", Number(id), function(){
        listarViagens();
    });
}

//=====================================================
// Controle da seta do card
//=====================================================
document.addEventListener("shown.bs.collapse", function(e){
    let botao = document.querySelector(
        `[data-bs-target="#${e.target.id}"]`
    );
    if(botao){
        botao.innerHTML = '⇑';
    }
});

document.addEventListener("hidden.bs.collapse", function(e){
    let botao = document.querySelector(
        `[data-bs-target="#${e.target.id}"]`
    );
    if(botao){
        botao.innerHTML = '⇓';
    }
});

//=====================================================
// Monta lista de despesas
//=====================================================
function montarListaDespesas(id){
    buscarDespesasViagem(id,function(despesas){
        let html="";
        if(despesas.length==0){
            html=`
            <p class="text-muted text-center">
                Nenhuma despesa cadastrada.
            </p>
            `;
        }else{
            calcularConsumos(despesas);
            despesas.forEach(function(d){
                html += `
                <div class="linha-despesa">
                    <div class="despesa-cabecalho">
                        <div>
                            <div class="despesa-titulo">
                                ${iconeDespesa(d.tipo)} ${d.tipo}
                            </div>
                            <div class="despesa-data">
                                ${dataBR(d.data)}
                            </div>
                        </div>
                        <div class="despesa-valor">
                            ${moeda(d.valor)}
                        </div>
                    </div>
                `;

                //=========================================
                // COMBUSTÍVEL
                //=========================================
                if(d.tipo=="Combustível"){
                    if(d.posto){
                        html += `
                        <div class="despesa-detalhe">
                            🌎
                            ${d.posto}
                        </div>`;
                    }
                    if(Number(d.km)>0){
                        html += `
                        <div class="despesa-detalhe">
                            🛤️
                            KM ${Number(d.km).toLocaleString("pt-BR")}
                        </div>`;
                    }
                    if(Number(d.litros)>0){
                        html += `
                        <div class="despesa-detalhe">
                            ⛽
                            ${Number(d.litros).toFixed(2)} litros
                        </div>`;
                    }
                    if(d.media){
                        html += `
                            <div class="despesa-detalhe">
                                ➗
                                Média
                                ${d.media.toFixed(1).replace(".", ",")} km/L
                            </div>
                        `;
                    }
                }
                else{
                    if(d.descricao){
                        html += `
                        <div class="despesa-detalhe">
                            ${d.descricao}
                        </div>`;
                    }
                }
                html += `
                    <div class="acoes-despesa">
                        <button
                            class="btn btn-outline-warning btn-sm btnEditarDespesa"
                            data-viagem-id="${d.viagemId}"
                            data-data-hora="${d.dataHora}">
                            ✏️
                        </button>
                        <button
                            class="btn btn-outline-danger btn-sm btnExcluirDespesa"
                            data-viagem-id="${d.viagemId}"
                            data-data-hora="${d.dataHora}">
                            🗑️
                        </button>
                    </div>
                </div>
                `;
            });            
        }
        document.getElementById("listaDespesas"+id).innerHTML = html;
    });
}
//=====================================================
// Atualiza resumo visual
//=====================================================

function atualizarResumo(id){
    calcularResumo(id,function(r){
        document.getElementById("combustivel"+id).innerHTML = moeda(r.combustivel);
        document.getElementById("hospedagem"+id).innerHTML = moeda(r.hospedagem);
        document.getElementById("refeicao"+id).innerHTML = moeda(r.refeicao);
        document.getElementById("pedagio"+id).innerHTML = moeda(r.pedagio);
        document.getElementById("cafe"+id).innerHTML = moeda(r.cafe);
        document.getElementById("outros"+id).innerHTML = moeda(r.outros);
        document.getElementById("totalCard"+id).innerHTML = moeda(r.total);
        // document.getElementById("valorTotal"+id).innerHTML = moeda(r.total)
    });
}

//=====================================================
// Atualiza resumo do cabeçalho
//=====================================================

function atualizarResumoCard(id){
    calcularVeiculo(id,function(v){
        document.getElementById("kmResumo"+id).innerHTML =
            Number(v.kmRodados).toLocaleString("pt-BR") + " km";
        let media = "--";
        if(v.litros > 0){
            media = (v.kmRodados / v.litros)
                .toFixed(1)
                .replace(".", ",") + " km/L";
        }
        document.getElementById("mediaResumo"+id).innerHTML = media;
    });

}