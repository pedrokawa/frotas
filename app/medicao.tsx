import * as ImagePicker from "expo-image-picker";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "@/services/api";
import { uploadCloudinary } from "@/services/cloudinary";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Medicao() {
  const [rodovia, setRodovia] = useState("");
  const [sentido, setSentido] = useState("");
  const [kmIni, setKmIni] = useState("");
  const [kmFim, setKmFim] = useState("");
  const [extensao, setExtensao] = useState("");
  const [largura, setLargura] = useState("");
  const [faixa, setFaixa] = useState("");
  const [area, setArea] = useState("");
  const [nome, setNome] = useState("");
  const [obs, setObs] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);

  const [data, setData] = useState("");

  //modal
  const [modal, setModal] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(true);
  const [messageModal, setMessageModal] = useState("");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, []),
  );

  const maskData = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    if (cleaned.length > 4) {
      cleaned = cleaned.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, "$1/$2/$3");
    } else if (cleaned.length > 2) {
      cleaned = cleaned.replace(/^(\d{2})(\d{0,2}).*/, "$1/$2");
    }
    setData(cleaned);
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão negada.",
        "Precisamos do acesso a sua galeria de fotos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const novasFotos = result.assets.map((asset) => asset.uri);
      setFotos((prevFotos) => [...prevFotos, ...novasFotos]);
    }
  };

  const tirarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão negada.", "Habilite o acesso a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotos((prevFotos) => [...prevFotos, result.assets[0].uri]);
    }
  };

  const removeFoto = (indexRemove: number) => {
    setFotos((prevFotos) =>
      prevFotos.filter((_, index) => index !== indexRemove),
    );
  };

  const handleConvertNumber = (valor: string) => {
    if (!valor) return 0;

    return parseFloat(valor.replace(",", ".")) || 0;
  };

  useEffect(() => {
    const numKmini = handleConvertNumber(kmIni);
    const numKmfim = handleConvertNumber(kmFim);
    const numLarg = handleConvertNumber(largura);

    if (numKmini > 0 && numKmfim > 0) {
      const resultExt = Math.abs(numKmfim - numKmini);
      setExtensao(resultExt.toFixed(2).replace(".", ","));

      if (numLarg > 0) {
        const resultArea = resultExt * numLarg;
        setArea(resultArea.toFixed(2).replace(".", ","));
      } else {
        setArea("");
      }
    } else {
      setExtensao("");
      setArea("");
    }
  }, [kmIni, kmFim, largura]);

  const enviaMedicao = async () => {
    if (
      !data ||
      !nome ||
      !rodovia ||
      !sentido ||
      !kmIni ||
      !kmFim ||
      !extensao ||
      !largura ||
      !faixa ||
      !area
    ) {
      setModalSucesso(false);
      setMessageModal("Por favor, preencha todos os campos!");
      setModal(true);
      return;
    }

    try {
      const linksFotos = await Promise.all(
        fotos.map(async (uri) => await uploadCloudinary(uri, "medicao_upload")),
      );

      await api.registraMedicao({
        dataMedicao: data,
        apontador: nome,
        rodovia,
        sentido,
        kmIni: parseFloat(kmIni),
        kmFim: parseFloat(kmFim),
        extensao: parseFloat(extensao),
        largura: parseFloat(largura),
        faixa,
        areaTotal: parseFloat(area),
        observacoes: obs,
        foto: linksFotos,
      });

      setModalSucesso(true);
      setMessageModal("Medição registrada com sucesso.");
      setModal(true);
    } catch (error) {
      setModalSucesso(false);
      setMessageModal("Não foi possível regristar a medição.");
      setModal(true);
      console.error("Erro ao registrar medição:", error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#f0f4ff" }}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        // extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.label}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Medição</Text>

        <View style={styles.linha}>
          <View style={styles.metade}>
            <Text style={styles.label}>Data da Medição</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={data}
              keyboardType="numeric"
              editable
              onChangeText={maskData}
            />
          </View>

          <View style={styles.metade}>
            <Text style={styles.label}>Apontador</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              editable
              onChangeText={setNome}
            />
          </View>
        </View>

        <View style={styles.linha}>
          <View style={styles.metade}>
            <Text style={styles.label}>Rodovia</Text>
            <TextInput
              style={styles.input}
              placeholder="Rodovia"
              value={rodovia}
              editable
              onChangeText={setRodovia}
            />
          </View>

          <View style={styles.metade}>
            <Text style={styles.label}>Sentido</Text>
            <TextInput
              style={styles.input}
              placeholder="S/N DIR ESQ"
              value={sentido}
              editable
              onChangeText={setSentido}
            />
          </View>
        </View>

        <View style={styles.linha}>
          <View style={styles.metade}>
            <Text style={styles.label}>Km Inicial</Text>
            <TextInput
              style={styles.input}
              placeholder="100.000"
              value={kmIni}
              keyboardType="numeric"
              editable
              onChangeText={setKmIni}
            />
          </View>

          <View style={styles.metade}>
            <Text style={styles.label}>Km Final</Text>
            <TextInput
              style={styles.input}
              placeholder="200.000"
              value={kmFim}
              keyboardType="numeric"
              editable
              onChangeText={setKmFim}
            />
          </View>
        </View>

        <View style={styles.linha}>
          <View style={styles.metade}>
            <Text style={styles.label}>Extensão (m²)</Text>
            <TextInput
              style={styles.inputDesabilitado}
              placeholder="100.000"
              value={extensao}
              editable={false}
            />
          </View>

          <View style={styles.metade}>
            <Text style={styles.label}>Largura</Text>
            <TextInput
              style={styles.input}
              placeholder="2,50"
              value={largura}
              editable
              keyboardType="numeric"
              onChangeText={setLargura}
            />
          </View>
        </View>

        <View style={styles.linha}>
          <View style={styles.metade}>
            <Text style={styles.label}>Faixa</Text>
            <TextInput
              style={styles.input}
              placeholder="1/2/3 ACOST"
              value={faixa}
              editable
              onChangeText={setFaixa}
            />
          </View>

          <View style={styles.metade}>
            <Text style={styles.label}>Área Total (m²)</Text>
            <TextInput
              style={styles.inputDesabilitado}
              placeholder="2.000"
              value={area}
              editable={false}
              // onChangeText={setArea}
            />
          </View>
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={styles.input}
          placeholder="Usina/Espessura/Camada"
          value={obs}
          editable
          onChangeText={setObs}
        />

        <Text style={styles.label}>Fotos da Obra</Text>
        <View style={styles.linha}>
          <View style={styles.metade}>
            <TouchableOpacity style={styles.botaoFoto} onPress={tirarFoto}>
              <Text style={styles.botaoFotoTexto}>Câmera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metade}>
            <TouchableOpacity style={styles.botaoFoto} onPress={openGallery}>
              <Text style={styles.botaoFotoTexto}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>

        {fotos.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {fotos.map((uri, index) => (
              <View key={index} style={styles.fotoContainer}>
                <Image source={{ uri }} style={styles.fotoPreview}></Image>
                <TouchableOpacity
                  style={styles.botaoRemoverFoto}
                  onPress={() => removeFoto(index)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.botao} onPress={enviaMedicao}>
          <Text style={styles.botaoTexto}>Confirmar</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalSucesso ? "Sucesso!" : "Ops..."}
            </Text>

            <Text style={styles.modalText}>{messageModal}</Text>

            <TouchableOpacity
              style={[
                styles.botaoModal,
                modalSucesso ? styles.botaoSucesso : styles.botaoErro,
              ]}
              onPress={() => {
                setModal(false);
                if (modalSucesso) router.back();
              }}
            >
              <Text style={styles.botaoTextoModal}>OK</Text>
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
    backgroundColor: "#f0f4ff",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputDesabilitado: {
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333333",
  },
  botao: {
    backgroundColor: "#e67e22",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoVoltar: {
    marginBottom: 16,
  },
  botaoVoltarTexto: {
    fontSize: 16,
    color: "#e67e22",
    fontWeight: "600",
  },
  linha: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  metade: {
    flex: 1,
  },
  fotoContainer: {
    position: "relative",
    marginRight: 12,
    marginTop: 8,
  },
  fotoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  botaoRemoverFoto: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#e11d48",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  botaoFoto: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e67e22",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  botaoFotoTexto: {
    color: "#e67e22",
    fontSize: 16,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo preto com 50% de transparência
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra no Android
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  botaoModal: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  botaoSucesso: {
    backgroundColor: "#e67e22",
  },
  botaoErro: {
    backgroundColor: "#e11d48",
  },
  botaoTextoModal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  tabAtivo: {
    backgroundColor: "#e67e22",
  },
  tabTexto: {
    fontSize: 10,
    fontWeight: "600",
    color: "#888",
    textAlign: "center",
  },
  tabTextoAtivo: {
    color: "#fff",
  },
});
