import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { api } from '@/services/api';
import AccordionVeiculo from '@/components/accordionVeic';

export default function Gerencia() {
  const { user } = useLocalSearchParams();
  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarRelatorio = async () => {
      try {
        const dados = await api.buscaUltimoAbastec();
        setRelatorio(dados);
      } catch (error) {
        console.log('Erro ao carregar relatório:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarRelatorio();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Olá, gerência!</Text>
        <Text style={styles.subtitulo}>Relatório de abastecimentos</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#e67e22" style={{ marginTop: 40 }} />
        ) : (
          relatorio.map((item: any) => (
            <AccordionVeiculo
              key={item.placa}
              placa={item.placa}
              marca={item.marca}
              modelo={item.modelo}
              ultimoAbastecimento={item.ultimoAbast}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4ff',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
  },
});