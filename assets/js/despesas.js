//=====================================================
// Despesas
//=====================================================

let modalDespesa;

//=====================================================
// Inicialização
//=====================================================
function configurarDespesas(){
    modalDespesa = new bootstrap.Modal(
        document.getElementById("modalDespesa")
    );
    document.getElementById("btnSalvarDespesa").addEventListener("click",salvarDespesa);
    document.getElementById("tipoDespesa").addEventListener("change", alterarCamposDespesa);
}


//=====================================================
// Abrir modal
//=====================================================

function abrirDespesa(idViagem){
    document.getElementById("idDespesa").value = "";
    document.getElementById("formDespesa").reset();
    document.getElementById("viagemId").value = idViagem;
    document.getElementById("dataDespesa").value = hoje();
    document.getElementById("btnSalvarDespesa").innerHTML = `
        💾 Salvar
    `;
    // document.getElementById("viagemId").value = idViagem;
    // document.getElementById("dataDespesa").value = hoje();
    // document.getElementById("valorDespesa").value="";
    // document.getElementById("descricaoDespesa").value="";
    modalDespesa.show();
    alterarCamposDespesa();
}


//=====================================================
// Alterar campos
//=====================================================

function alterarCamposDespesa(){
    let tipo =
    document.getElementById("tipoDespesa").value;
    let combustivel =
    document.getElementById("camposCombustivel");
    if(tipo=="Combustível"){
        combustivel.style.display="block";
    }
    else{
        combustivel.style.display="none";
    }
}


//=====================================================
// Salvar
//=====================================================

function salvarDespesa(){
    let id = document.getElementById("idDespesa").value;
    let despesa = {
        viagemId: Number(document.getElementById("viagemId").value),
        tipo: document.getElementById("tipoDespesa").value,
        data: document.getElementById("dataDespesa").value,
        descricao: document.getElementById("descricaoDespesa").value || "",
        valor: Number(document.getElementById("valorDespesa").value) || 0,
        km: Number(document.getElementById("kmDespesa").value || 0),
        litros: Number(document.getElementById("litrosDespesa").value || 0),
        posto: document.getElementById("postoDespesa").value || "",
        criadoEm: new Date().toISOString()
    };

    if (id == "") {
        salvar("despesas", despesa, function () {
            modalDespesa.hide();
            listarViagens();
        });
    } else {
        despesa.id = Number(id);
        atualizar("despesas", despesa, function () {
            modalDespesa.hide();
            listarViagens();
        });
    }
}    

//=====================================================
// Excluir Despesa
//=====================================================

function excluirDespesa(id){
    if(!confirm("Deseja excluir esta despesa?")){
        return;
    }
    excluir("despesas", Number(id), function(){
        listarViagens();
    });
}

//=====================================================
// Buscar despesas de uma viagem
//=====================================================
function buscarDespesasViagem(idViagem, callback){
    listar("despesas", function(despesas){
        let resultado = despesas.filter(function(d){
            return d.viagemId == idViagem;
        });
        callback(resultado);
    });
}

document.getElementById("modalDespesa").addEventListener("hidden.bs.modal", function(){
    document.activeElement.blur();
});

//=====================================================
// Calcula resumo financeiro da viagem
//=====================================================
function calcularResumo(idViagem, callback){
    buscarDespesasViagem(idViagem, function(despesas){
        let resumo = {
            combustivel:0,
            pedagio:0,
            hospedagem:0,
            refeicao:0,
            cafe:0,
            bebida:0,
            outros:0,
            total:0
        };
        despesas.forEach(function(d){
            let valor = Number(d.valor) || 0;
            resumo.total += valor;
            switch(d.tipo){
                case "Combustível":
                    resumo.combustivel += valor;
                    break;
                case "Pedágio":
                    resumo.pedagio += valor;
                    break;
                case "Hospedagem":
                    resumo.hospedagem += valor;
                    break;
                case "Refeição":
                    resumo.refeicao += valor;
                    break;
                case "Café":
                    resumo.cafe += valor;
                    break;
                case "Bebida":
                    resumo.bebida += valor;
                    break;
                case "Outros":
                    resumo.outros += valor;
                    break;
            }
        });
        callback(resumo);
    });
}

//=====================================================
// Calcula informações do veículo
//=====================================================
function calcularVeiculo(idViagem, callback){
    buscar("viagens", idViagem, function(viagem){
        buscarDespesasViagem(idViagem, function(despesas){
            let dados = {
                kmInicial : Number(viagem.kmInicial || 0),
                kmFinal : Number(viagem.kmFinal || 0),
                kmAtual : Number(viagem.kmInicial || 0),
                kmRodados : 0,
                litros : 0,
                combustivel : 0
            };
            despesas.forEach(function(d){
                if(d.tipo == "Combustível"){
                    // Soma litros
                    dados.litros += Number(d.litros || 0);
                    // Soma gasto combustível
                    dados.combustivel += Number(d.valor || 0);
                    // Descobre o maior KM lançado
                    if(Number(d.km) > dados.kmAtual){
                        dados.kmAtual = Number(d.km);
                    }
                }
            });
            // Se informou KM Final, ele prevalece
            if(dados.kmFinal > 0){
                dados.kmAtual = dados.kmFinal;
            }
            dados.kmRodados =
                dados.kmAtual - dados.kmInicial;
            callback(dados);
        });
    });
}

//=====================================================
// Editar despesa
//=====================================================

function editarDespesa(id){
    buscar("despesas", id, function(d){
        document.getElementById("idDespesa").value = d.id;
        document.getElementById("viagemId").value = d.viagemId;
        document.getElementById("tipoDespesa").value = d.tipo;
        document.getElementById("dataDespesa").value = d.data;
        document.getElementById("descricaoDespesa").value = d.descricao;
        document.getElementById("valorDespesa").value = d.valor;
        document.getElementById("kmDespesa").value = d.km;
        document.getElementById("litrosDespesa").value = d.litros;
        document.getElementById("postoDespesa").value = d.posto;
        document.getElementById("btnSalvarDespesa").innerHTML = `
            ✅ Atualizar
        `;
        modalDespesa.show();
    });
}

document.addEventListener("click", function(e){
    // Editar
    if(e.target.closest(".btnEditarDespesa")){
        editarDespesa(
            e.target.closest(".btnEditarDespesa").dataset.id
        );
    }
    // Excluir
    if(e.target.closest(".btnExcluirDespesa")){
        excluirDespesa(
            e.target.closest(".btnExcluirDespesa").dataset.id
        );
    }
});


//=====================================================
// Calcula consumo entre abastecimentos
//=====================================================

function calcularConsumos(despesas){
    let ultimoKm = 0;
    despesas.sort(function(a,b){
        return new Date(a.data) - new Date(b.data);
    });
    despesas.forEach(function(d){
        d.media = null;
        if(d.tipo != "Combustível")
            return;
        if(ultimoKm == 0){
            ultimoKm = Number(d.km);
            return;
        }
        let distancia =
            Number(d.km) - ultimoKm;
        if(Number(d.litros) > 0){
            d.media = distancia / Number(d.litros);
        }
        ultimoKm = Number(d.km);
    });
}