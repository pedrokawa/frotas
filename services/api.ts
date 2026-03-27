const BASE_URL = 'http://172.17.1.189:3000';

export const api = {
    registraAbastec: async (dados: {
        placa: string;
        marca?: string;
        modelo?: string;
        km: string;
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
    }
}