import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Abastecimento = {
  createdAt: string;
  litros: number;
  preco: number;
  total: number;
  combustivel?: string;
  km: string;
  horimetro: string;
} | null;

type Props = {
  placa: string;
  marca: string;
  modelo: string;
  ultimoAbastecimento: Abastecimento;
};

export default function AccordionVeiculo({ placa, marca, modelo, ultimoAbastecimento }: Props) {
  const [aberto, setAberto] = useState(false);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setAberto(!aberto)}>
        <View>
          <Text style={styles.placa}>{placa}</Text>
          <Text style={styles.veiculo}>{marca} / {modelo}</Text>
        </View>
        <Text style={styles.seta}>{aberto ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {aberto && (
        <View style={styles.corpo}>
          {ultimoAbastecimento ? (
            <>
              <View style={styles.linha}>
                <Text style={styles.chave}>Último abastecimento</Text>
                <Text style={styles.valor}>{formatarData(ultimoAbastecimento.createdAt)}</Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.chave}>Litros</Text>
                <Text style={styles.valor}>{ultimoAbastecimento.litros} L</Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.chave}>Preço/litro</Text>
                <Text style={styles.valor}>R$ {ultimoAbastecimento.preco.toFixed(2)}</Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.chave}>Total</Text>
                <Text style={styles.valor}>R$ {ultimoAbastecimento.total.toFixed(2)}</Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.chave}>KM</Text>
                <Text style={styles.valor}>{ultimoAbastecimento.km}</Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.chave}>Horímetro</Text>
                <Text style={styles.valor}>{ultimoAbastecimento.horimetro}h</Text>
              </View>
            </>
          ) : (
            <Text style={styles.semDados}>Nenhum abastecimento registrado.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  placa: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  veiculo: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  seta: {
    fontSize: 14,
    color: '#e67e22',
  },
  corpo: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chave: {
    fontSize: 14,
    color: '#555',
  },
  valor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  semDados: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 8,
  },
});