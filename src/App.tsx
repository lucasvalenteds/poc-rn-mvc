import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Axios, { AxiosInstance } from 'axios';
import { CarViewDefault, CarControllerDefault } from './Car';

const App: React.FC = (): React.ReactElement => {
  const httpClient: AxiosInstance = Axios.create({
    baseURL: 'https://httpbin.org/',
  });

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <CarViewDefault controller={CarControllerDefault(httpClient)} />
      </SafeAreaView>
    </>
  );
};

export default App;
