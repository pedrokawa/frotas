import { useState } from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <>
    <Stack.Screen options={{ headerShown: false}} />

    <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.titulo}>Bem vindo, Gerência!</Text> 
        <Text style={styles.texto}>O que faremos hoje?</Text>

        <TouchableOpacity style={styles.botao} onPress={() => router.push('/cadastro')}>
            <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoGerencia} onPress={() => router.push('/')}>
            <Text style={styles.botaoTexto}>Relatório</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoGerenciaSair} onPress={() => router.back()}>
            <Text style={styles.botaoTexto}>Sair</Text>
        </TouchableOpacity>
    </ScrollView>


   </>   
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
  botaoGerencia: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: '10%',
    width: '60%',
    alignSelf: 'center'
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }, 
  inputPin: {
    borderWidth: 2,
    borderColor: '#e67e22',
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    padding: 10,
    width: '60%',
    marginBottom: 10,
    letterSpacing: 10, // Afasta as bolinhas da senha
  },
  textoErro: {
    color: '#e11d48',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  botaoModal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoCancelar: {
    backgroundColor: '#eee',
  },
  textoCancelar: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo preto com 50% de transparência
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra no Android
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  botaoSucesso: {
    backgroundColor: '#e67e22', // Mantive a cor primária do seu app
  },
  botaoErro: {
    backgroundColor: '#e11d48', // Vermelho para erro
  },
  botaoTextoModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoGerenciaSair: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: '10%',
    width: '60%',
    alignSelf: 'center'
  },
});