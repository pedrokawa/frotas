import { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { api } from '@/services/api';
import AccordionVeiculo from '@/components/accordionVeic';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

export default function Gerencia() {
  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const exportarExcel = async () => {
    try {
        const dados = await api.listarAbastec();

        const linhas = dados.map((item: any) => ({
            'Data': new Date(item.createdAt).toLocaleDateString('pt-BR'),
            'Placa': item.placa,
            'Marca': item.marca,
            'Modelo': item.modelo,
            'Litros': item.litros,
            'Valor': item.preco,
            'Total': item.total,
            'KM': item.km,
            'Horimetro': item.horimetro
        }));

        const ws = XLSX.utils.json_to_sheet(linhas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Abastecimentos');

        const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx'});
        const uri = FileSystem.cacheDirectory + 'abastecimentos.xlsx';

        await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
        })
        
        await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar abastecimentos',
            UTI: 'com.microsoft.excel.xlsx',
        });
    } catch (error){
        console.log('Erro ao exportar:', error)
    }
  }

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

        <TouchableOpacity style={styles.botaoExportar} onPress={exportarExcel}>
            <Text style={styles.botaoExportarTexto}> Exportar dados</Text>
        </TouchableOpacity>
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
  botaoExportar: {
    backgroundColor: '#e67e22',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  botaoExportarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});