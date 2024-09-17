import React, { useRef, useState, useEffect } from 'react';
import { View, Text, BackHandler, StyleSheet ,Button, TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress'; // Progress bar for loading

const Index = () => {
  const webviewRef = useRef(null); // Reference to WebView
  const [canGoBack, setCanGoBack] = useState(false); // State to track if we can go back
  const [hasError, setHasError] = useState(false); // State to track if there is a connection error
  const [currentUrl, setCurrentUrl] = useState('https://easyloadvtu.com.ng'); // State to track the current URL
  const [progress, setProgress] = useState(0); // State for progress

  // Handle the hardware back button press on Android
  useEffect(() => {
    const handleBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true; // Prevent default behavior (exit app)
      }
      return false; // Allow default behavior (exit app)
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [canGoBack]);

  // Function to reload the WebView
  const handleReload = () => {
    setHasError(false); // Reset error state
    if (webviewRef.current) {
      webviewRef.current.reload(); // Reload the WebView with the same URL
    }
  };

  return (
    <View style={{ flex: 1 }}>
 
 <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>

      {hasError ? (
        // Display custom error message and retry button
        <View style={styles.errorContainer}>
          <MaterialIcons name="wifi-off" size={74} color="red" />
          <Text style={styles.errorText}>You are not connected to the internet!</Text>
  
    <TouchableOpacity style={styles.button} onPress={handleReload}>
      <Text style={styles.buttonText}>Retry</Text>
    </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Show progress bar at the top */}
          {progress < 1 && <Progress.Bar progress={progress} width={null} color="#555" height={3} />}

          <WebView
            ref={webviewRef} // Reference to the WebView
            source={{ uri: currentUrl }} // Track the current URL
            onLoadStart={() => setProgress(0)} // Reset progress to 0 when loading starts
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)} // Update progress as the page loads
            onLoadEnd={() => setProgress(1)} // Set progress to 1 when loading is complete
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack); // Track navigation state
              setCurrentUrl(navState.url); // Update the current URL
            }}
            onError={() => setHasError(true)} // Handle error by showing custom message
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'grey',
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: '#555',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;
