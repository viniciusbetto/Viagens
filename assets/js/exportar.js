//=====================================================
// EXPORTAÇÃO JSON
//=====================================================
async function exportarJSON() {
    try {
        const viagens = await obterTabela("viagens");
        const despesas = await obterTabela("despesas");
        const backup = {
            aplicativo: "MotoTrip",
            versao: 1,
            exportadoEm: new Date().toISOString(),
            banco: "MotoTripDB",
            dados: {
                viagens,
                despesas
            }
        };
        const json = JSON.stringify(backup, null, 4);
        const blob = new Blob(
            [json],
            { type: "application/json" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const hoje = new Date().toISOString().substring(0,10);
        a.href = url;
        a.download = `MotoTrip_Backup_${hoje}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    catch(err){
        console.error(err);
        alert("Erro ao exportar backup.");
    }
}

//=====================================================
// Lê qualquer ObjectStore
//=====================================================

function obterTabela(nome){
    return new Promise(function(resolve,reject){
        const tx = db.transaction([nome],"readonly");
        const store = tx.objectStore(nome);
        const req = store.getAll();
        req.onsuccess = function(){
            resolve(req.result);
        };
        req.onerror = function(){
            reject(req.error);
        };
    });
}

//=====================================================
// EXPORTAR CSV - VIAGENS
//=====================================================
async function exportarCSVViagens(){
    try{
        const viagens = await obterTabela("viagens");
        const hoje = new Date().toISOString().substring(0,10);
        baixarCSV(
            converterCSV(viagens),
            `MotoTrip_Viagens_${hoje}.csv`
        );
    }
    catch(err){
        console.error(err);
        alert("Erro ao exportar viagens.");
    }
}

//=====================================================
// EXPORTAR CSV - DESPESAS
//=====================================================
async function exportarCSVDespesas(){
    try{
        const despesas = await obterTabela("despesas");
        const hoje = new Date().toISOString().substring(0,10);
        baixarCSV(
            converterCSV(despesas),
            `MotoTrip_Despesas_${hoje}.csv`
        );
    }
    catch(err){
        console.error(err);
        alert("Erro ao exportar despesas.");
    }
}

//=====================================================
// Converte Array para CSV
//=====================================================

function converterCSV(dados){
    if(!dados || dados.length==0){
        return "";
    }
    const colunas = Object.keys(dados[0]);
    const linhas = [];
    linhas.push(colunas.join(";"));
    dados.forEach(function(item){
        const linha = colunas.map(function(coluna){
            let valor = item[coluna];
            if(valor===null || valor===undefined){
                valor="";
            }
            valor = String(valor)
                .replace(/"/g,'""')
                .replace(/\r/g," ")
                .replace(/\n/g," ");
            return `"${valor}"`;
        });
        linhas.push(linha.join(";"));
    });
    return linhas.join("\r\n");
}

//=====================================================
// Download CSV
//=====================================================

function baixarCSV(texto,nomeArquivo){
    const blob = new Blob(
        ["\uFEFF"+texto],
        {
            type:"text/csv;charset=utf-8;"
        }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
}