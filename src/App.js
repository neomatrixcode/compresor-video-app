import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, StatusBar, FlatList,
  View, Text, ImageBackground, ActivityIndicator,
  TouchableOpacity, Modal, StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Video from 'react-native-video';
import moment from "moment";


import UploadButton from './UploadButton';
import { getVideosApi, uploadNext } from './redux-store';

function App () {
  const dispatch = useDispatch();
  const [currentVideo, setVideo] = useState(null);
  const videoList = useSelector(state => state.app.videoList);
  const queue = useSelector(state => state.app.queue);

  useEffect(() => {
    dispatch(getVideosApi());
    dispatch(uploadNext(true));
  }, []);

  const renderItem = ({ item }) => {
    const isUploading = (queue || []).find(x => x.uuid === item.uuid);
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => setVideo(item)}>
        { isUploading ? <Text>Video Uploading <ActivityIndicator size="small" color="black"/></Text> : null}
        <ImageBackground
          source={{ uri: `data:image/gif;base64,${item.thumbnail}` }}
          style={styles.imageStyle}
          poster={item.thumbnail}
        />

        {item.file? (
        <>
        <Text style={{color:"green"}}>width: {item.file.size.width} pixels</Text>
        <Text style={{color:"green"}}>height: {item.file.size.height} pixels</Text>
        <Text style={{color:"green"}}>duration: {moment.utc(item.file.duration*1000).format('HH:mm:ss')}</Text>
        </>
     ) : (
     <>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        </>
     )}

     {item.stats? (
        <>
        <Text style={{color:"green"}}>filename: {item.stats.filename}</Text>
        <Text style={{color:"green"}}>filename: {item.stats.path}</Text>
        <Text style={{color:"green"}}>size: {((item.stats.size/1024)/1024).toFixed(2)} MB</Text>
        <Text style={{color:"green"}}>lastModified: {(Date(item.stats.lastModified * 1000).toString())}</Text>
        </>
     ) : (
     <>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        <Text style={{color:"green"}}> </Text>
        </>
     )}

      </TouchableOpacity>
    )
  };


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <UploadButton />

        <FlatList
          data={videoList || []}
          renderItem={renderItem}
          keyExtractor={item => item.uuid}
        />
      </SafeAreaView>

      {
      currentVideo ? (
        <Modal visible onDismiss={() => setVideo(null)} transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Video
                source={{ uri: currentVideo.external_path || currentVideo.local_path }}
                style={styles.videoStyle}
                resizeMode="cover"
              />
              <TouchableOpacity onPress={() => setVideo(null)}><Text>Close</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null
    }
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'white',
    padding: 10
    // borderRadius: 20,
  },
  itemContainer: {
    marginVertical: 10,
    display: 'flex',
    alignItems: 'center'
  },
  imageStyle: {
    width: '100%',
    height: 200
  },
  videoStyle: {
    width: 300,
    height: 300
  }
});

export default App;
