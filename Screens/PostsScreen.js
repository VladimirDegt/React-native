import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  useFonts,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { selectEmail, selectLogin } from '../redux/selectors';
import { getDataFromFirestore } from '../utils/db';

export const PostsScreen = () => {
  const [getPosts, setGetPosts] = useState('');
  const navigation = useNavigation();

  const login = useSelector(selectLogin);
  const email = useSelector(selectEmail);

  useEffect(() => {
    const fetchData = async () => {
      const posts = await getDataFromFirestore();
      setGetPosts(posts);
    };

    fetchData();
  }, []);

  let [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLocation = (e, location) => {
    navigation.navigate('Map', { location });
  };

  const handleCommentAdd = (e, id) => {
    navigation.navigate('Comments', { id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerUser}>
        <Image
          source={require('../assets/PhotoUser.jpg')}
          style={styles.photoUser}
        />
        <View style={styles.user}>
          <Text style={styles.nameUser}>{login}</Text>
          <Text style={styles.emailUser}>{email}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.containerPost}>
        {getPosts &&
          getPosts.map(({ id, location, nameLocation, photo, comments }) => {
            return (
              <>
                <View style={styles.photo} key={id}>
                  <Image
                    source={{ uri: photo }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
                <Text style={styles.nameLocation}>{nameLocation?.name}</Text>
                <View style={styles.containerDetails}>
                  <View style={styles.containerDetailsRow}>
                    <View style={styles.containerComments}>
                      <TouchableOpacity
                        style={styles.containerIconComment}
                        onPress={e => handleCommentAdd(e, id)}
                      >
                        <FontAwesome
                          name="comment-o"
                          size={24}
                          color={comments.length > 0 ? 'red' : '#BDBDBD'}
                        />
                      </TouchableOpacity>
                      <Text style={styles.textComment}>{comments.length}</Text>
                    </View>
                    <View style={styles.containerLocation}>
                      <TouchableOpacity
                        style={styles.iconLocation}
                        onPress={e => handleLocation(e, location)}
                      >
                        <EvilIcons name="location" size={24} color="#BDBDBD" />
                      </TouchableOpacity>
                      <Text style={styles.textLocation}>
                        {nameLocation?.region}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    backgroundColor: '#FFFFFF',
  },
  containerUser: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  photoUser: {
    borderRadius: 16,
    width: 60,
    height: 60,
  },
  user: {
    flex: 1,
    alignItems: 'flex-start',
  },
  nameUser: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold',
    color: '#212121',
  },
  emailUser: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
    color: '#212121',
  },
  containerPost: {
    alignItems: 'flex-start',
    gap: 8,
  },
  photo: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nameLocation: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    color: '#212121',
  },
  containerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  containerComments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  containerIconComment: {
    width: 24,
    height: 24,
    color: 'red',
  },
  textComment: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#BDBDBD',
  },
  containerLocation: {
    flexDirection: 'row',
  },
  textLocation: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#212121',
  },
});
