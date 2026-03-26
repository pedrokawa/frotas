import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '@/components/sidebar';

export default function Home() {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <View style={styles.container}>
      Botão sanduíche
      {/* <TouchableOpacity
        style={styles.menuBotao}
        onPress={() => setSidebarAberta(true)}
      >
        <View style={styles.linha} />
        <View style={styles.linha} />
        <View style={styles.linha} />
      </TouchableOpacity> */}

      <Text style={styles.titulo}>Bem vindo, ASFALTOPAV! {'\n'} O que faremos hoje?</Text>

      <TouchableOpacity style={styles.botao} onPress={() => Alert.alert('Sucesso!', 'Clicado')}>
          <Text style={styles.botaoTexto}>Abastecer</Text>
      </TouchableOpacity>

      {/* Sidebar */}
      {/* <Sidebar
        visivel={sidebarAberta}
        aoFechar={() => setSidebarAberta(false)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  menuBotao: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
    gap: 5,
    padding: 4,
  },
  linha: {
    width: 26,
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  titulo: {
    marginTop: 140,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  botao: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});