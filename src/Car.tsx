import React, { useEffect, useState } from 'react';
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

export function useCarController(httpClient: AxiosInstance): CarController {
  const [cars, setCards] = useState<Car[]>([]);
  const [lastCar, setLastCar] = useState<Car>({
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
}

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
        <Button testID={'car-update'} title={'Update'} onPress={refresh} />
      </View>
      <View style={style.lastCar}>
        <Text testID={'car-lastcar-uuid'} style={style.lastCarId}>
          {model.lastCar.uuid}
        </Text>
        <Text testID={'car-lastcar-timestamp'} style={style.lastCarTimestamp}>
          {model.lastCar.timestamp}
        </Text>
      </View>
      <FlatList
        testID={'car-cars'}
        data={model.cars}
        keyExtractor={(props) => props.uuid}
        renderItem={(props): React.ReactElement => (
          <Text style={style.lastCarId}>{props.item.uuid}</Text>
        )}
      />
    </View>
  );
};
