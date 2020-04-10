import React, { useEffect } from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AxiosInstance } from 'axios';

export interface Car {
  uuid: string;
  timestamp: string;
}

export interface CarModel {
  lastCar: Car;
  cars: Car[];
}

export interface CarController {
  model: CarModel;
  refresh(): Promise<void>;
}

export interface CarView {
  controller: CarController;
}

export const CarControllerDefault = (
  httpClient: AxiosInstance,
): CarController => {
  const [cars, setCards] = React.useState<Car[]>([]);
  const [lastCar, setLastCar] = React.useState<Car>({
    uuid: '',
    timestamp: '',
  });

  const refresh = async (): Promise<void> => {
    const response = await httpClient.get('/uuid');
    setCards((previous) => [...previous, lastCar]);
    setLastCar({
      uuid: response.data.uuid,
      timestamp: new Date().toString(),
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    refresh,
    model: {
      cars,
      lastCar,
    },
  };
};

export const CarViewDefault: React.FC<CarView> = (
  props,
): React.ReactElement => {
  const { model, refresh } = props.controller;

  const style = StyleSheet.create({
    container: {
      padding: 16,
    },
    button: {
      width: Dimensions.get('screen').width / 2,
    },
    lastCar: {
      marginTop: 16,
      marginBottom: 16,
    },
    lastCarId: {
      fontSize: 16,
    },
    lastCarTimestamp: {
      fontSize: 14,
    },
  });

  return (
    <View style={style.container}>
      <View style={style.button}>
        <Button title={'Update'} onPress={refresh} />
      </View>
      <View style={style.lastCar}>
        <Text style={style.lastCarId}>{model.lastCar.uuid}</Text>
        <Text style={style.lastCarTimestamp}>{model.lastCar.timestamp}</Text>
      </View>
      <FlatList
        data={model.cars}
        keyExtractor={(props) => props.uuid}
        renderItem={(props): React.ReactElement => (
          <Text style={style.lastCarId}>{props.item.uuid}</Text>
        )}
      />
    </View>
  );
};
