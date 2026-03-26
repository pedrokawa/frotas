import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function Abastecer() {
  const [placa, setPlaca] = useState('');
  const [litros, setLitros] = useState('');
  const [posto, setPosto] = useState('');
  const [preco, setPreco] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [nome, setNome] = useState('');
  const [km, setKm] = useState('');

  const [image, setImage] = useState<string | null>(null);

  const router = useRouter();

  const totalLitro = litros && preco ? (parseFloat(litros) * parseFloat(preco)).toFixed(2) : '';

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
        style={styles.input}
        placeholder='Ex: ABC-1234'
        value={placa}
        onChangeText={setPlaca}
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

    <Text style={styles.label}>KM do veículo</Text>
        <TextInput
        style={styles.input}
        placeholder='KM'
        value={km}
        keyboardType='numeric'
        // editable={false}
        onChangeText={setKm}
        />

      <Text style={styles.label}>Operador</Text>
      <TextInput
        style={styles.input}
        placeholder='Nome do operador'
        value={nome}
        onChangeText={setNome}
      />

    <View style={styles.linha}>
      <View style={styles.metade}>
      <Text style={styles.label}>Litros</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: 50'
        keyboardType='numeric'
        value={litros}
        onChangeText={setLitros}
      />
      </View>  
      
      <View style={styles.metade}>
      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
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
        style={styles.input}
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
        onPress={() => Alert.alert('Sucesso!', 'Abastecimento registrado!')}
      >
        <Text style={styles.botaoTexto}>Confirmar</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: '#4f46e5',
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
    color: '#4f46e5',
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
    borderColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
   },
   botaoFotoTexto: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600',
   },
   preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
   },
});