/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect} from 'react';
import type {Node} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  ToastAndroid
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import rudderClient,{ RUDDER_LOG_LEVEL } from '@rudderstack/rudder-sdk-react-native';
import clevertap from "@rudderstack/rudder-integration-clevertap-react-native";
import { firebase } from '@react-native-firebase/messaging';

const CleverTap = require('clevertap-react-native');

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {

  const isDarkMode = useColorScheme() === 'dark';
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const DATA_Plane_URL="";
  const fcmToken = "";

  const config = {
    dataPlaneUrl : "https://clevertapvhcnymhkt.dataplane.rudderstack.com",
    logLevel: RUDDER_LOG_LEVEL.DEBUG,
    trackAppLifecycleEvents: true,
    withFactories: [clevertap]
  };
  rudderClient.setup("1s2Bb1CNYnswR7nAuj8yl94vsy9", config);

 useEffect(() => {
    this.checkPermission();
    CleverTap.recordEvent('Page Loaded');

    CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event) => {
        _handleCleverTapEvent(CleverTap.CleverTapPushNotificationClicked, event);
    });

    firebase.messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      console.log('handleFirebaseEvent', remoteMessage.data);
    });
        
  }, []);

checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
    } else {
        //this.requestPermission();
    }
  }

  getFcmToken = async () => {
     const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      CleverTap.setPushToken(fcmToken, CleverTap.FCM);
      CleverTap.createNotificationChannel("112233","CleverTap","This is a test channel",5,true);
       //await this.CleverTap.setPushTokenAsString(fcmToken, CleverTap.FCM);
    } else {
      //this.showAlert('Failed', 'No token received');
    }
  }

  function _handleCleverTapEvent(eventName, event) {
    console.log('handleCleverTapEvent', eventName, event);
    ToastAndroid.show('${eventName} called!', ToastAndroid.SHORT);
    }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section>
          <Button
              // Some properties given to Button
                title="Push Custom Events"
                onPress={() => 
                  rudderClient.track("Checked Out", {
                        Clicked_Rush_delivery_Button: true,
                        total_value: 2000,
                        revenue: 2000,
                          })
                        }
                        ></Button>
            </Section>
            <Section> 
            <Button
              // Some properties given to Button
                title="Push Order Place Event"
                onPress={() => 
                  rudderClient.track("Order Completed", {
                        checkout_id: "12345",
                        order_id: "1234",
                        affiliation: "Apple Store",
                        'Payment mode': "Credit Card",
                        total: 20,
                        revenue: 15.0,
                        shipping: 22,
                        tax: 1,
                        discount: 1.5,
                        coupon: "Games",
                        currency: "USD",
                        products: [
                            {
                              product_id: "123",
                              sku: "G-32",
                              name: "Monopoly",
                              price: 14,
                              quantity: 1,
                              category: "Games",
                              url: "https://www.website.com/product/path",
                              image_url: "https://www.website.com/product/path.jpg",
                            },
                            {
                                product_id: "345",
                                sku: "F-32",
                                name: "UNO",
                                price: 3.45,
                                quantity: 2,
                                category: "Games",
                            },
                            {
                                product_id: "125",
                                sku: "S-32",
                                name: "Ludo",
                                price: 14,
                                quantity: 7,
                                category: "Games",
                                brand: "Ludo King",
                              },
                              ],
                            })
                          }
                        ></Button>
            </Section>
            <Section> 
            <Button
              // Some properties given to Button
                title="Push Identity"
                onPress={() => 
                  rudderClient.identify("userid", {
                                name: "Name Surname",
                                email: "parth@clevertap.com",
                                phone: "+919869357572",
                                gender: "M",
                                avatar: "link to image",
                                title: "Owner",
                                organization: "Company",
                                city: "Tokyo",
                                region: "ABC",
                                country: "JP",
                                zip: "100-0001",
                                Flagged: false,
                                Residence: "Shibuya",
                                "MSG-email": true
                              })
                          } 
                        ></Button>
            </Section>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
