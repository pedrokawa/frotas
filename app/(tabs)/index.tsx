import { useState } from 'react';
import { Alert, TextInput, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import Sidebar from '@/components/sidebar';
import { useRouter } from 'expo-router';

export default function Home() {
  const [modalPin, setModalPin] = useState(false);
  const [senhaPin, setSenhaPin] = useState('');
  const [erroPin, setErroPin] = useState('');

  const SENHA_GERENCIA = '1406';
  const router = useRouter();

  const validatePass = () => {
    if(senhaPin === SENHA_GERENCIA) {
      setErroPin('');
      setSenhaPin('');
      setModalPin(false);
      router.push('/gerencia');
    }else{
      setErroPin('PIN incorreto. Tente novamente.');
      setSenhaPin('');
    }
  }

  return (
    <>
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

      <TouchableOpacity style={styles.botaoGerencia} onPress={() => setModalPin(true)}>
          <Text style={styles.botaoTexto}>Gerencia</Text>
      </TouchableOpacity>

      {/* Sidebar */}
      {/* <Sidebar
        visivel={sidebarAberta}
        aoFechar={() => setSidebarAberta(false)}
      /> */}
    </View>

    <Modal
        animationType="fade"
        transparent={true}
        visible={modalPin}
        onRequestClose={() => {
          setModalPin(false);
          setErroPin('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Acesso Restrito</Text>
            <Text style={styles.modalText}>Digite o PIN:</Text>

            {/* <TextInput
              style={styles.inputUser}
              // keyboardType="numeric"
              secureTextEntry={true} // <-- Esconde os números com "bolinhas"
              maxLength={4} // Limita a 4 números
              value={senhaPin}
              onChangeText={setSenhaPin}
              autoFocus={true} // Já abre o teclado sozinho
            /> */}

            <TextInput
              style={styles.inputPin}
              keyboardType="numeric"
              secureTextEntry={true} // <-- Esconde os números com "bolinhas"
              maxLength={4} // Limita a 4 números
              value={senhaPin}
              onChangeText={setSenhaPin}
              autoFocus={true} // Já abre o teclado sozinho
            />

            {/* Mostra a mensagem de erro em vermelho se ela errar */}
            {erroPin ? <Text style={styles.textoErro}>{erroPin}</Text> : null}

            <View style={styles.linhaBotoes}>
              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoCancelar]} 
                onPress={() => {
                  setModalPin(false);
                  setErroPin('');
                }}
              >
                <Text style={styles.textoCancelar}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoSucesso]} 
                onPress={validatePass}
              >
                <Text style={styles.botaoTextoModal}>Entrar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
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
  // inputUser: {
  //   borderWidth: 2,
  //   borderColor: '#e67e22',
  //   borderRadius: 10,
  //   fontSize: 24,
  //   textAlign: 'center',
  //   padding: 10,
  //   width: '100%',
  //   marginBottom: 10,
  //   letterSpacing: 10, // Afasta as bolinhas da senha
  // },
  inputPin: {
    borderWidth: 2,
    borderColor: '#e67e22',
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    padding: 10,
    width: '100%',
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
});