import {  View, 
          Text,
          TextInput, 
          TouchableOpacity, 
          StyleSheet, 
          Alert, 
          ScrollView, 
          Image, 
          Modal } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { api } from '@/services/api';

export default function Cadastrar() {

  const [placa, setPlaca] = useState('');
  const [codigoFrota, setCodigoFrota] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anoFabricacao, setAnoFabricacao] = useState('');
  const [anoModelo, setAnoModelo] = useState('');
  const [chassi, setChassi] = useState('');
  const [renavam, setRenavam] = useState('');
  const [cor, setCor] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [status, setStatus] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  //modal
  const [modal, setModal] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(true);
  const [messageModal, setMessageModal] = useState('');
  
  const router = useRouter();

  const cadastraVeic = async () => {
    if (!placa || 
        !codigoFrota || 
        !marca || 
        !modelo || 
        !anoFabricacao || 
        !anoModelo ||
        !renavam ||
        !cor ||
        !combustivel ||
        !kmAtual ||
        !status
      ) {
      setModalSucesso(false);
      setMessageModal('Por favor, preencha todos os campos!')
      setModal(true);
      return;
    }

    try {
      await api.cadastraVeic({
        placa,
        codigoFrota,
        marca,
        modelo,
        anoFabricacao: parseInt(anoFabricacao),
        anoModelo: parseInt(anoModelo),
        chassi,
        renavam,
        cor,
        combustivel,
        kmAtual: parseInt(kmAtual),
        status,
        observacoes
      });

      setModalSucesso(true);
      setMessageModal('Veículo cadastrado com sucesso.');
      setModal(true);

    } catch (error) {
      setModalSucesso(false);
      setMessageModal('Não foi possível cadastrar veículo.');
      setModal(true);
    } 
  }


  return (
    <>
    <Stack.Screen options={{ headerShown: false}} />

    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
        <Text style={styles.label}>Voltar</Text>
      </TouchableOpacity>
      
      <Text style={styles.titulo}>Cadastro de veículos</Text>

      <Text style={styles.label}>Placa do veículo</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: ABC-1234'
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize='characters'
      />

      <Text style={styles.label}>Marca</Text>
      <TextInput
          style={styles.input}
          placeholder='Marca'
          value={marca}
          // editable={false}
          onChangeText={setMarca}
      />
      
      <Text style={styles.label}>Modelo</Text>
      <TextInput
          style={styles.input}
          placeholder='Modelo'
          value={modelo}
          onChangeText={setModelo}
      />


      <Text style={styles.label}> Cod. Frota</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: FIAT/SIENA FIRE FLEX'
        value={codigoFrota}
        onChangeText={setCodigoFrota}
      />

      <Text style={styles.label}> Ano Fabricação</Text>
      <TextInput
        style={styles.input}
        placeholder='Ano Fabricação'
        keyboardType='numeric'
        value={anoFabricacao}
        onChangeText={setAnoFabricacao}
      />

      <Text style={styles.label}> Ano Modelo</Text>
      <TextInput
        style={styles.input}
        placeholder='Ano Modelo'
        keyboardType='numeric'
        value={anoModelo}
        onChangeText={setAnoModelo}
      />

      <Text style={styles.label}> Renavam</Text>
      <TextInput
        style={styles.input}
        placeholder='Renavam'
        value={renavam}
        onChangeText={setRenavam}
      />

      <Text style={styles.label}> Cor</Text>
      <TextInput
        style={styles.input}
        placeholder='Cor'
        value={cor}
        onChangeText={setCor}
      />

      <Text style={styles.label}> Combustível</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: GASOLINA/ALCOOL/DIESEL/FLEX'
        value={combustivel}
        onChangeText={setCombustivel}
      />

      <Text style={styles.label}> KM Atual</Text>
      <TextInput
        style={styles.input}
        placeholder='KM Atual'
        value={kmAtual}
        onChangeText={setKmAtual}
      />

      <Text style={styles.label}> Status</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: ATIVO/INATIVO'
        value={status}
        onChangeText={setStatus}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastraVeic}
      >
        <Text style={styles.botaoTexto}>Cadastrar veículo</Text>
      </TouchableOpacity>
    </ScrollView>
    
    <Modal 
      animationType='fade'
      transparent={true}
      visible={modal}
      onRequestClose={() => setModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalSucesso ? 'Sucesso!' : 'Ops...'}  
            </Text>  

            <Text style={styles.modalText}>
              {messageModal}
            </Text>

            <TouchableOpacity 
            style={[styles.botaoModal, modalSucesso ? 
                   styles.botaoSucesso : styles.botaoErro]}
            onPress={() => {
              setModal(false);
              if (modalSucesso) router.back();
            }}>
              <Text style={styles.botaoTextoModal}>
                OK
              </Text>
            </TouchableOpacity>
          </View>      
        </View>
      
    </Modal>
    
    
    </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 80
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botao: {
    backgroundColor: '#e67e22',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoVoltar: {
    marginBottom: 16,
  },
  botaoVoltarTexto: {
    fontSize: 16,
    color: '#e67e22',
    fontWeight: '600',
  },
  linha: {
   flexDirection: 'row',
   gap: 12,
   marginBottom: 8,
  },
  metade: {
   flex: 1,
  },
  inputDesabilitado: {
   backgroundColor: '#e9e9e9',
   color: '#999',
  },
  botaoFoto: {
   backgroundColor: '#fff',
   borderWidth: 1,
   borderColor: '#e67e22',
   borderRadius: 12,
   paddingVertical: 14,
   alignItems: 'center',
   marginBottom: 10,
  },
  botaoFotoTexto: {
   color: '#e67e22',
   fontSize: 16,
   fontWeight: '600',
  },
  preview: {
   width: '100%',
   height: 200,
   borderRadius: 12,
   marginBottom: 20,
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
  botaoModal: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  botaoSucesso: {
    backgroundColor: '#e67e22',
  },
  botaoErro: {
    backgroundColor: '#e11d48', 
  },
  botaoTextoModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});