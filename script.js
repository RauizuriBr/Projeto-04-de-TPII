//Criando a Classe GerenciaEstacionamento com o padrão Singleton
class GerenciaEstacionamento {
    constructor() {
        if (GerenciaEstacionamento.instancia) {
            return GerenciaEstacionamento.instancia;
        }

        this.totalVagas = 10;

        this.veiculos = [];

        GerenciaEstacionamento.instancia = this;
    }

    // Criando o padrão Singleton
    static getInstance() {
        if (!GerenciaEstacionamento.instancia) {
            GerenciaEstacionamento.instancia = new GerenciaEstacionamento();
        }
        return GerenciaEstacionamento.instancia;
    }

    getVagasOcupadas() {
        return this.veiculos.length;
    }

    getVagasDisponiveis() {
        return this.totalVagas - this.getVagasOcupadas();
    }

    placaExiste(placa) {
        return this.veiculos.some((veiculo) => veiculo.placa === placa);
    }

    // Registra a entrada de um veículo.
    // Retorna um objeto { sucesso, mensagem }.
    entrar(placa, modelo) {
        if (!placa || !modelo) {
            return {
                sucesso: false,
                mensagem: "Preencha a placa e o modelo do veículo.",
            };
        }

        if (this.placaExiste(placa)) {
            return {
                sucesso: false,
                mensagem: `A placa ${placa} já está estacionada.`,
            };
        }

        if (this.getVagasDisponiveis() <= 0) {
            return {
                sucesso: false,
                mensagem: "Estacionamento Lotado!",
            };
        }

        this.veiculos.push({ placa, modelo });

        console.log("VEÍCULO ADICIONADO ----------------");
        console.log(`${placa} - ${modelo}`);

        return {
            sucesso: true,
            mensagem: `Veículo ${placa} estacionado com sucesso.`,
        };
    }

    // Registra a saída de um veículo pela placa.
    // Retorna um objeto { sucesso, mensagem }.
    sair(placa) {
        if (!placa) {
            return {
                sucesso: false,
                mensagem: "Informe a placa do veículo para sair.",
            };
        }

        const indice = this.veiculos.findIndex((veiculo) => veiculo.placa === placa);

        if (indice === -1) {
            return {
                sucesso: false,
                mensagem: `Placa ${placa} não encontrada no estacionamento.`,
            };
        }

        const [veiculoRemovido] = this.veiculos.splice(indice, 1);

        console.log("VEÍCULO REMOVIDO ----------------");
        console.log(`${veiculoRemovido.placa} - ${veiculoRemovido.modelo}`);

        return {
            sucesso: true,
            mensagem: `Veículo ${placa} saiu do estacionamento.`,
        };
    }
}

//Integrando com o html:

// Obtém a instância única do gerenciador (Singleton).
const estacionamento = GerenciaEstacionamento.getInstance();

function atualizarInformacoes() {
    document.getElementById("totalVagas").textContent = estacionamento.totalVagas;
    document.getElementById("vagasOcupadas").textContent = estacionamento.getVagasOcupadas();
    document.getElementById("vagasDisponiveis").textContent = estacionamento.getVagasDisponiveis();
}

function atualizarListaVeiculos() {
    const lista = document.getElementById("listaVeiculos");
    lista.innerHTML = "";

    if (estacionamento.veiculos.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Nenhum veículo estacionado.";
        lista.appendChild(item);
        return;
    }

    estacionamento.veiculos.forEach((veiculo) => {
        const item = document.createElement("li");
        item.textContent = `${veiculo.placa} - ${veiculo.modelo}`;
        lista.appendChild(item);
    });
}

function exibirMensagem(texto) {
    document.getElementById("mensagem").textContent = texto;
}

function atualizarTela(mensagem) {
    atualizarInformacoes();
    atualizarListaVeiculos();
    exibirMensagem(mensagem);
}

function entrarVeiculo() {
    const placaInput = document.getElementById("placa");
    const modeloInput = document.getElementById("modelo");

    const placa = placaInput.value.trim().toUpperCase();
    const modelo = modeloInput.value.trim();

    const resultado = estacionamento.entrar(placa, modelo);

    if (resultado.sucesso) {
        placaInput.value = "";
        modeloInput.value = "";
    }

    atualizarTela(resultado.mensagem);
}

function sairVeiculo() {
    const placaInput = document.getElementById("placa");

    const placa = placaInput.value.trim().toUpperCase();

    const resultado = estacionamento.sair(placa);

    atualizarTela(resultado.mensagem);
}

function limparCampos() {
    document.getElementById("placa").value = "";
    document.getElementById("modelo").value = "";
    exibirMensagem("Nenhuma operação realizada.");
}

//Testes:
const estacionamento1 = GerenciaEstacionamento.getInstance();
const estacionamento2 = GerenciaEstacionamento.getInstance();

console.log("Teste Singleton - mesma instância?", estacionamento1 === estacionamento2);

atualizarInformacoes();
atualizarListaVeiculos();