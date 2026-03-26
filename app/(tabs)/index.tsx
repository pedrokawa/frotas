import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '@/components/sidebar';
import { useRouter } from 'expo-router';

export default function Home() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.menuBotao}
        onPress={() => setSidebarAberta(true)}
      >
        <View style={styles.linha} />
        <View style={styles.linha} />
        <View style={styles.linha} />
      </TouchableOpacity> */}

      <Text style={styles.titulo}>Bem vindo, ASFALTOPAV!</Text> 
      <Text style={styles.texto}>O que faremos hoje?</Text>

      <TouchableOpacity style={styles.botao} onPress={() => router.push('/abastecer')}>
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
  texto: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  botao: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: '50%',
    width: '60%',
    alignSelf: 'center'
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});