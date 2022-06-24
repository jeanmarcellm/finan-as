class Despesa {
    constructor(ano, mes, dia, descricao, valor, tipo) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
            return true
        }
    }
}
class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }

    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        //array de despesas
        let despesas = []
        let id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            // pular indices null
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesasLocalStorage = this.recuperarTodosRegistros()
        if (despesa.ano) {
            despesasLocalStorage = (despesasLocalStorage.filter(d => d.ano == despesa.ano))
        }
        if (despesa.mes) {
            despesasLocalStorage = (despesasLocalStorage.filter(d => d.mes == despesa.mes))
        }
        if (despesa.dia) {
            despesasLocalStorage = (despesasLocalStorage.filter(d => d.dia == despesa.dia))
        }
        if (despesa.tipo) {
            despesasLocalStorage = (despesasLocalStorage.filter(d => d.tipo == despesa.tipo))
        }
        if (despesa.descricao != "Tipo") {
            despesasLocalStorage = (despesasLocalStorage.filter(d => d.descricao == despesa.descricao))
        }
        if (despesa.valor) {
            despesasLocalStorage = (despesasLocalStorage.filter(d => d.valor == despesa.valor))
        }
        return despesasLocalStorage
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}
let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let descricao = document.getElementById('descricao')
    let tipo = document.getElementById('tipo')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, descricao.value, valor.value, tipo.value)

    if (despesa.validarDados()) {
        bd.gravar(despesa)
        sucessoErro('sucesso')
        $('#gravacao').modal('show')
        limpa()
    }
    else {
        sucessoErro('erro')
        $('#gravacao').modal('show')
    }
}
function sucessoErro(se) {
    if (se == 'sucesso') {
        document.getElementById("exampleModalLabel").innerHTML = 'Registro inserido com sucesso'
        document.getElementById("corpo_modal").innerHTML = ' Despesa cadastrada com sucesso!'
        document.getElementById("modal_titulo_div").className = 'modal-header text-success'
        document.getElementById("botao_footer").className = 'btn btn-success'
    }
    else {
        document.getElementById("exampleModalLabel").innerHTML = 'Erro na Gravação'
        document.getElementById("corpo_modal").innerHTML = ' Existem campos obrigatórios que não foram preenchidos'
        document.getElementById("modal_titulo_div").className = 'modal-header text-danger'
        document.getElementById("botao_footer").className = 'btn btn-danger'
    }
}
function limpa() {
    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('valor').value = ''
}
function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    /*
    <tr>
                <td>DATA</td>
                <td>ALIMENTAÇÃO</td>
                <td>Compras do mes</td>
                <td>VALOR</td>
              </tr>
              */

    despesas.forEach(function (d) {
        console.log("valor de d:", d)
        //criar linhas
        let linha = listaDespesas.insertRow()
        //criar as colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        switch (parseInt(d.tipo)) {
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}

