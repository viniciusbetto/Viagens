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
    // document.getElementById("idDespesa").value = "";
    document.getElementById("formDespesa").reset();
    document.getElementById("viagemId").value = idViagem;
    document.getElementById("dataHoraDespesa").value = "";
    document.getElementById("dataDespesa").value = hoje();
    document.getElementById("btnSalvarDespesa").innerHTML = `
        💾 Salvar
    `;
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

    const viagemId =
        Number(document.getElementById("viagemId").value);

    const dataHoraOriginal =
        document.getElementById("dataHoraDespesa").value;

    const agora =
        new Date().toISOString();

    let despesa = {
        viagemId: viagemId,
        dataHora: dataHoraOriginal || agora,
        tipo: document.getElementById("tipoDespesa").value,
        data: document.getElementById("dataDespesa").value,
        descricao: document.getElementById("descricaoDespesa").value || "",
        valor: Number(document.getElementById("valorDespesa").value) || 0,
        km: Number(document.getElementById("kmDespesa").value || 0),
        litros: Number(document.getElementById("litrosDespesa").value || 0),
        posto: document.getElementById("postoDespesa").value || "",
        criadoEm: dataHoraOriginal || agora
    };

    // NOVA DESPESA
    if(dataHoraOriginal === ""){

        salvar("despesas", despesa, function(){

            modalDespesa.hide();
            listarViagens();

        });

        return;
    }

    // ATUALIZAR DESPESA
    atualizar("despesas", despesa, function(){

        modalDespesa.hide();
        listarViagens();

    });
}

//=====================================================
// Excluir Despesa
//=====================================================

function excluirDespesa(viagemId, dataHora){
    if(!confirm("Deseja excluir esta despesa?")){
        return;
    }
    excluir("despesas", [Number(viagemId), dataHora], function(){
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

    buscar("viagens", Number(idViagem), function(viagem){

        if(!viagem){
            callback({
                kmInicial: 0,
                kmFinal: 0,
                kmAtual: 0,
                kmRodados: 0,
                litros: 0,
                combustivel: 0
            });
            return;
        }

        buscarDespesasViagem(idViagem, function(despesas){

            let dados = {
                kmInicial: Number(viagem.kmInicial || 0),
                kmFinal: Number(viagem.kmFinal || 0),
                kmAtual: Number(viagem.kmInicial || 0),
                kmRodados: 0,
                litros: 0,
                combustivel: 0
            };

            despesas.forEach(function(d){
                if(d.tipo == "Combustível"){
                    dados.litros += Number(d.litros || 0);
                    dados.combustivel += Number(d.valor || 0);
                    if(Number(d.km) > dados.kmAtual){
                        dados.kmAtual = Number(d.km);
                    }
                }
            });

            // Se informou KM Final, ele prevalece
            if(dados.kmFinal > 0){
                dados.kmAtual = dados.kmFinal;
            }
            dados.kmRodados = dados.kmAtual - dados.kmInicial;
            callback(dados);
        });
    });
}

//=====================================================
// Editar despesa
//=====================================================

function editarDespesa(viagemId, dataHora){

    const chave = [
        Number(viagemId),
        dataHora
    ];

    buscar("despesas", chave, function(d){
        if(!d){
            alert("Despesa não encontrada.");
            return;
        }
        document.getElementById("dataHoraDespesa").value = d.dataHora;
        document.getElementById("viagemId").value = d.viagemId;
        document.getElementById("tipoDespesa").value = d.tipo;
        document.getElementById("dataDespesa").value = d.data;
        document.getElementById("descricaoDespesa").value = d.descricao || "";
        document.getElementById("valorDespesa").value = d.valor;
        document.getElementById("kmDespesa").value = d.km || "";
        document.getElementById("litrosDespesa").value = d.litros || "";
        document.getElementById("postoDespesa").value = d.posto || "";

        document.getElementById("btnSalvarDespesa").innerHTML = `
            ✅ Atualizar
        `;
        alterarCamposDespesa();
        modalDespesa.show();
    });
}

document.addEventListener("click", function(e){
    // Editar
    const btnEditar =
        e.target.closest(".btnEditarDespesa");
    if(btnEditar){
        editarDespesa(btnEditar.dataset.viagemId, btnEditar.dataset.dataHora);
        return;
    }
    // Excluir
    const btnExcluir =
        e.target.closest(".btnExcluirDespesa");

    if(btnExcluir){
        excluirDespesa(btnExcluir.dataset.viagemId, btnExcluir.dataset.dataHora);
        return;
    }    
});


//=====================================================
// Calcula consumo entre abastecimentos
//=====================================================

function calcularConsumos(despesas){
    let ultimoKm = 0;
    // despesas.sort(function(a,b){
    //     return new Date(a.data) - new Date(b.data);
    // });
    despesas.sort(function(a,b){
        return new Date(a.dataHora) - new Date(b.dataHora);
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