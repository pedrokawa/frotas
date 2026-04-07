import {  View, 
          Text,
          TextInput, 
          TouchableOpacity, 
          StyleSheet, 
          Alert, 
          ScrollView, 
          Image, 
          Modal } from 'react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { api } from '@/services/api';

export default function Abastecer() {
  const [placa, setPlaca] = useState('');
  const [litros, setLitros] = useState('');
  const [posto, setPosto] = useState('');
  const [preco, setPreco] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [nome, setNome] = useState('');
  const [km, setKm] = useState('');
  const [horimetro, setHorimetro] = useState('');
  const [placaValida, setPlacaValida] = useState(false);

  const [tipoMedi, setTipoMedi] = useState<'km' | 'horimetro'>('km');

  const [image, setImage] = useState<string | null>(null);

  //modal
  const [modal, setModal] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(true);
  const [messageModal, setMessageModal] = useState('');
  const [placaModal, setPlacaModal] = useState(false)
  const router = useRouter();

  const placaRef = useRef<TextInput>(null);

  //busca veiculo
  const buscaVeiculo = async(placa: string) => {
    if (! placa || placa.length < 7) {
      setPlacaValida(false);
      setPlacaModal(true);
      return;
    }

    try {
      const veiculo = await api.buscaVeiculo(placa);
      setMarca(veiculo.marca);
      setModelo(veiculo.modelo);
      setPlacaValida(true);
    } catch (error) {
      setMarca('');
      setModelo('');
      setPlacaValida(false);
      setPlacaModal(true);
    }
  }
  
  const litrosFormatados = litros.replace(',', '.');
  const precoFormatado = preco.replace(',', '.');

  const litrosNum = parseFloat(litrosFormatados) || 0;
  const precoNum = parseFloat(precoFormatado) || 0;
  
  const totalCalculado = litrosNum * precoNum;
  const totalLitro = litrosNum && precoNum ? totalCalculado.toFixed(4) : '';

  const tirarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if(!permission.granted){
        Alert.alert('Permissão negada.', 'Habilite o acesso a câmera.');
        return
    }

    const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
    });

    if (!result.canceled){
        setImage(result.assets[0].uri)
    }
  }
  
  const enviaAbastec = async () => {

    if (!placa || !nome || !litros || !preco || !posto ) {
      setModalSucesso(false);
      setMessageModal('Por favor, preencha todos os campos!')
      setModal(true);
      return;
    }

    if (!placaValida) {
      setPlacaModal(true);
      return;
    }

    try {
      await api.registraAbastec({
      placa,
      marca,
      modelo,
      km: km || '0',
      horimetro: horimetro || '0',
      operador: nome,

      litros: litrosNum,
      preco: precoNum,
      total: parseFloat(totalLitro),
      posto,
      foto: image || null,
      });

      setModalSucesso(true);
      setMessageModal('Abastecimento registrado com sucesso.');
      setModal(true);

    } catch (error) {
      setModalSucesso(false);
      setMessageModal('Não foi possível regristar abastecimento.');
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
      
      <Text style={styles.titulo}>Abastecimento</Text>

      <Text style={styles.label}>Placa do veículo</Text>
      <TextInput
        ref={placaRef}
        style={styles.input}
        placeholder='Ex: ABC-1234'
        value={placa}
        onChangeText={(text) => {
          setPlaca(text);
          setPlacaValida(false);
          setMarca('');
          setModelo('');
        }}
        onEndEditing={(e) => buscaVeiculo(e.nativeEvent.text)}
        autoCapitalize='characters'
      />

        <View style={styles.linha}>
            <View style={styles.metade}>
                <Text style={styles.label}>Marca</Text>
                <TextInput
                style={[styles.input, styles.inputDesabilitado]}
                placeholder='Auto preenchido'
                value={marca}
                editable={false}
                onChangeText={setMarca}
                />
            </View>

            <View style={styles.metade}>
                <Text style={styles.label}>Modelo</Text>
                <TextInput
                style={[styles.input, styles.inputDesabilitado]}
                placeholder='Auto preenchido'
                value={modelo}
                editable={false}
                onChangeText={setModelo}
                />
            </View>
        </View>

        <Text style={styles.label}>Medição</Text>
        <View style={styles.tabs}>
          <TouchableOpacity 
          style={[styles.tab, tipoMedi === 'km' && styles.tabAtivo]}
          onPress={() => {
            setTipoMedi('km');
            setHorimetro('');
            }}>
            <Text style={[styles.tabTexto, tipoMedi === 'km' && styles.tabTextoAtivo]}>
              KM
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
          style={[styles.tab, tipoMedi === 'horimetro' && styles.tabAtivo]}
          onPress={() => {
            setTipoMedi('horimetro');
            setKm('');
            }}>
            <Text style={[styles.tabTexto, tipoMedi === 'horimetro' && styles.tabTextoAtivo]}>
              Horímetro
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>
          {tipoMedi === 'km' ? 'KM do veículo' : 'Horímetro (horas)'}
        </Text>

        <TextInput 
        style={[styles.input, !placaValida && styles.inputDesabilitado]}
        placeholder={tipoMedi === 'km' ? 'Ex: 55000' : 'Ex: 1250'}
        value={tipoMedi === 'km' ? km : horimetro}
        keyboardType='numeric'
        editable={placaValida}
        onChangeText={tipoMedi === 'km' ? setKm : setHorimetro} />

      <Text style={styles.label}>Operador</Text>
      <TextInput
        style={[styles.input, !placaValida && styles.inputDesabilitado]}
        editable={placaValida}
        placeholder='Nome do operador'
        value={nome}
        onChangeText={setNome}
      />

    <View style={styles.linha}>
      <View style={styles.metade}>
      <Text style={styles.label}>Litros</Text>
      <TextInput
        style={[styles.input, !placaValida && styles.inputDesabilitado]}
        editable={placaValida}
        placeholder='Ex: 50'
        keyboardType='numeric'
        value={litros}
        onChangeText={setLitros}
      />
      </View>  
      
      <View style={styles.metade}>
      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={[styles.input, !placaValida && styles.inputDesabilitado]}
        editable={placaValida}
        placeholder='Preço/litro'
        keyboardType='numeric'
        value={preco}
        onChangeText={setPreco}
      />
      </View>
    </View>

      <Text style={styles.label}>Total</Text>
      <TextInput
        style={[styles.input, styles.inputDesabilitado]}
        placeholder='Total'
        value={totalLitro ? `R$ ${totalLitro}` : ''}
        editable={false}
        // value={total}
        // onChangeText={setTotal}
      />    

      <Text style={styles.label}>Posto</Text>
      <TextInput
        style={[styles.input, !placaValida && styles.inputDesabilitado]}
        editable={placaValida}
        placeholder='Ex: Posto Shell Centro'
        value={posto}
        onChangeText={setPosto}
      />

      <Text style={styles.label}>Foto do painel</Text>
      <TouchableOpacity style={styles.botaoFoto} onPress={tirarFoto}>
        <Text style={styles.botaoFotoTexto}>
            {image ? 'Trocar foto' : 'Tirar foto'}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
        source={{uri: image}}
        style={styles.preview}>
        </Image>
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={enviaAbastec}
      >
        <Text style={styles.botaoTexto}>Confirmar</Text>
      </TouchableOpacity>
    </ScrollView>

    <Modal 
    animationType='fade'
    transparent={true}
    visible={placaModal}
    onRequestClose={() => setPlacaModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            Placa não encontrada.
          </Text>
          <Text style={styles.modalText}>
            Verifique a placa e tente novamente.
          </Text>

          <TouchableOpacity 
          style={[styles.botaoModal, styles.botaoErro]}
          onPress={() => {
            setPlacaModal(false);
            setPlaca('');
            setTimeout(() => placaRef.current?.focus(), 100);
          }}>
            <Text style={styles.botaoTextoModal}>Tentar novamente.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#e9e9e9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabAtivo: {
    backgroundColor: '#e67e22',
  },
  tabTexto: {
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  tabTextoAtivo: {
    color: '#fff',
  },  
});