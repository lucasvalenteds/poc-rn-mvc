import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Axios from 'axios';
import { CarViewDefault, useCarController } from './Car';

const App: React.FC = (): React.ReactElement => {
  const controller = useCarController(
    Axios.create({
      baseURL: 'https://httpbin.org/',
    }),
  );

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <CarViewDefault controller={controller} />
      </SafeAreaView>
    </>
  );
};

export default App;
