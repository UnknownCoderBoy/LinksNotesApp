import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Keyboard,
  Linking,
} from 'react-native';
import { firebase } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const [linksData, setlinksData] = useState([]);
  const linksDataRef = firebase.firestore().collection('linksData');
  const [addTitle, setAddTitle] = useState();
  const [addUrl, setAddUrl] = useState();
  const [addHover, setAddHover] = useState('');

  // fetch or read the data from firestore
  useEffect(() => {
    linksDataRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
      const linksData = [];
      querySnapshot.forEach((doc) => {
        const { title, url } = doc.data();
        linksData.push({
          id: doc.id,
          title,
          url,
        });
      });
      setlinksData(linksData);
      //console.log(users)
    });
  }, []);

  urlPatternValidation = (URL) => {
    const regex = new RegExp('((http|https)://).*');
    return regex.test(URL);
  };

  // delete a todo from firestore db
  const deletelinksData = (id) => {
    linksDataRef
      .doc(id)
      .delete()
      .then(() => {
        // show a successful alert
        alert('Deleted successfully');
      })
      .catch((error) => {
        // show an error alert
        alert(error);
      });
  };

  // add a todo
  const addlinksData = async () => {
    // check if we have a todo.
    if (addTitle && addTitle.length > 0 && addUrl && addUrl.length > 0) {
      if (urlPatternValidation(addUrl)) {
        // get the timestamp
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const url = 'https://api.shrtco.de/v2/shorten?url=' + addUrl;
        const response = await fetch(url);
        const datas = await response.json();
        if (datas.ok === true) {
          const data = {
            title: addTitle,
            url: datas.result.full_short_link,
            createdAt: timestamp,
          };
          linksDataRef
            .add(data)
            .then(() => {
              // release todo state
              setAddUrl('');
              setAddTitle('');
              // release keyboard
              Keyboard.dismiss();
            })
            .catch((error) => {
              // show an alert in case of error
              alert(error);
            });
        } else {
          alert(datas.disallowed_reason);
          Keyboard.dismiss();
        }
      } else {
        alert('Invalid Url');
        Keyboard.dismiss();
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.textHeadingContainer}>
        <Text style={styles.textHeading}>Links Notes</Text>
        <Text style={styles.textHeadingTag}>{'Play : ' + addHover}</Text>
      </View>
      <FlatList
        style={{}}
        data={linksData}
        numColumns={1}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                Linking.openURL(item.url);
              }}
              onMouseEnter={() => {
                setAddHover(item.title);
              }}
              onMouseLeave={() => {
                setAddHover('');
              }}>
              <Button
                title="Del"
                onPress={() => {
                  deletelinksData(item.id);
                }}></Button>
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>{item.title}</Text>
                <Text style={styles.itemUrl}>{item.url}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Title"
          placeholderTextColor="#aaaaaa"
          onChangeText={(title) => setAddTitle(title)}
          value={addTitle}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Url"
          placeholderTextColor="#aaaaaa"
          onChangeText={(url) => setAddUrl(url)}
          value={addUrl}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.formContainer}>
        <Button title="Add Url" onPress={addlinksData}></Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeadingContainer: {
    paddingVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  textHeading: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  textHeadingTag: {
    fontSize: 15,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 45,
    flex: 1,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemUrl: {
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
});

export default Home;
