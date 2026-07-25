// ===============================================
// Banco IndexedDB
// ===============================================

const DB_NAME = "MotoTripDB";
const DB_VERSION = 1;

let db = null;

//=====================================================
// Abre o banco
//=====================================================

function abrirBanco() {
    let request = indexedDB.open("MotoTripDB", 1);
    request.onupgradeneeded = function (e) {
        db = e.target.result;
        // -----------------------------
        // Tabela Viagens
        // -----------------------------
        // -----------------------------
        // Estrutura:
        // viagens
        //
        // id
        // nome
        // destino
        // dataInicio
        // kmInicial
        // observacoes
        // criadoEm
        //
        // -----------------------------        
        if (!db.objectStoreNames.contains("viagens")) {
            db.createObjectStore("viagens", {
                keyPath: "id",
                autoIncrement: true
            });
        }
        // -----------------------------
        // Tabela Despesas
        // -----------------------------
        // -----------------------------
        // Estrutura:
        // despesas
        //
        // id
        // viagemId
        // tipo
        // data
        // descricao
        // valor
        // km
        // litros
        // posto
        // cidade
        // observacoes
        //
        // -----------------------------
        if (!db.objectStoreNames.contains("despesas")) {
            db.createObjectStore("despesas", {
                keyPath: "id",
                autoIncrement: true
            });
        }
    };

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log("Banco aberto.");
        // alert("IndexedDB: " + (window.indexedDB ? "SIM" : "NÃO"));
        listarViagens();
    };

    request.onerror = function () {
        alert("Erro ao abrir o banco.");
    };

}

//=====================================================
// Salvar registro
//=====================================================

function salvar(tabela, dados, callback = null) {
    let transacao = db.transaction([tabela], "readwrite");
    let store = transacao.objectStore(tabela);
    let request = store.add(dados);
    request.onsuccess = function () {
        console.log("Registro salvo.");
        if (callback)
            callback();
    };
    request.onerror = function (e) {
        console.log(e);
        alert("Erro ao salvar");

    };
}

//=====================================================
// Listar registros
//=====================================================

function listar(tabela, callback) {
    let transacao = db.transaction([tabela], "readonly");
    let store = transacao.objectStore(tabela);
    let request = store.getAll();
    request.onsuccess = function () {
        callback(request.result);
    };
}

//=====================================================
// Atualizar
//=====================================================

function atualizar(tabela, dados, callback = null) {
    let transacao = db.transaction([tabela], "readwrite");
    let store = transacao.objectStore(tabela);
    let request = store.put(dados);
    request.onsuccess = function () {
        if (callback)
            callback();
    };
}

//=====================================================
// Excluir
//=====================================================

function excluir(tabela, id, callback = null) {
    let transacao = db.transaction([tabela], "readwrite");
    let store = transacao.objectStore(tabela);
    let request = store.delete(id);
    request.onsuccess = function () {
        if (callback)
            callback();

    };
}

//=====================================================
// Buscar por ID
//=====================================================

function buscar(tabela, id, callback) {
    let transacao = db.transaction([tabela], "readonly");
    let store = transacao.objectStore(tabela);
    let request = store.get(Number(id));
    request.onsuccess = function () {
        callback(request.result);
    };
}