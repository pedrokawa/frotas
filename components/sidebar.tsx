import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const LARGURA = Dimensions.get('window').width * 0.72;

const menus = [
  { icon: '🚛', label: 'Frotas' },
  { icon: '🛣️', label: 'Rodovia' },
  { icon: '📄', label: 'Documentos' },
  { icon: '📋', label: 'Cadastro' },
  { icon: '👥', label: 'RH' },
];

type Props = {
  visivel: boolean;
  aoFechar: () => void;
};

export default function Sidebar({ visivel, aoFechar }: Props) {
  const translateX = useRef(new Animated.Value(-LARGURA)).current;
  const opacidade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visivel) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacidade, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -LARGURA,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacidade, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visivel]);

  if (!visivel && translateX === new Animated.Value(-LARGURA)) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visivel ? 'auto' : 'none'}>
      {/* Fundo escuro */}
      <Animated.View style={[styles.overlay, { opacity: opacidade }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={aoFechar} />
      </Animated.View>

      {/* Painel lateral */}
      <Animated.View style={[styles.painel, { transform: [{ translateX }] }]}>
        {/* <Text style={styles.titulo}>Menu</Text> */}

        {menus.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => {
              console.log('Navegando para:', item.label);
              aoFechar();
            }}
          >
            <Text style={styles.icone}>{item.icon}</Text>
            <Text style={styles.itemTexto}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  painel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: LARGURA,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 32,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icone: {
    fontSize: 22,
    marginRight: 16,
  },
  itemTexto: {
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
});