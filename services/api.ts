const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {
    registraAbastec: async (dados: {
        placa: string;
        marca?: string;
        modelo?: string;
        km?: string;
        horimetro?: string;
        operador: string;
        litros: number;
        preco: number;
        total: number;
        posto: string;
        foto?: string | null;
    }) => {
        const resp = await fetch(`${BASE_URL}/api/abastecimento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resp.ok) throw new Error('Erro ao registrar abastecimento.');
        return resp.json();
    },   

    listarAbastec: async () => {
        const response = await fetch(`${BASE_URL}/api/abastecimento`);
        if (!response.ok) throw new Error('Erro ao buscar abastecimentos.');
        return response.json();
    },

    buscaVeiculo: async (placa: string) => {
        const response = await fetch(`${BASE_URL}/api/veiculos/${placa}`);
        if (!response.ok) throw new Error('Veículo não encontrado.');
        return response.json();
    },

    cadastraVeic: async (dados: {
        placa: string;
        codigoFrota: string;
        marca?: string;
        modelo?: string;
        anoFabricacao: number;
        anoModelo: number;
        chassi: string;
        renavam: string;
        cor: string;
        combustivel: string;
        kmAtual: number;
        status: string;
        observacoes: string
    }) => {
        const resp = await fetch(`${BASE_URL}/api/veiculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resp.ok) throw new Error('Erro ao cadastrar.');
        return resp.json();
    }, 

    login: async (user: string, password: string) => {
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, password}),
        });

        if (!response.ok) throw new Error('Usuário ou senha incorretos.');
        return response.json();
    },

    buscaUltimoAbastec: async () => {
        const response = await fetch(`${BASE_URL}/api/relatorio/abastecimento`);

        if (!response.ok) throw new Error('Erro ao buscar relatório.');
        return response.json();
    }


}