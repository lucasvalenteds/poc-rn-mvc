import React from 'react';
import * as TestingHooks from '@testing-library/react-hooks';
import * as TestingReact from '@testing-library/react-native';
import Axios, { AxiosInstance } from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { Car, useCarController, CarViewDefault, CarController } from './Car';

const defaultCar: Car = {
  uuid: '',
  timestamp: '',
};

const f250: Car = {
  uuid: '7b6d5534-7b6c-11ea-9483-13b1c3d959e4',
  timestamp: new Date(2017, 1, 2).toString(),
};

const ranger: Car = {
  uuid: '3fc0a7c2-7b74-11ea-832b-63278c2519c9',
  timestamp: new Date(2020, 11, 2).toString(),
};

describe('Controller', () => {
  const httpClient: AxiosInstance = Axios.create();
  const mockAdapter = new AxiosMockAdapter(httpClient);

  test('Fetching new car on first render', async () => {
    mockAdapter.onGet('/uuid').reply(200, { uuid: f250.uuid });
    const controller = TestingHooks.renderHook(() => {
      return useCarController(httpClient);
    });

    expect(controller.result.current.model.lastCar).toStrictEqual(defaultCar);

    await TestingHooks.act(async () => {});

    expect(controller.result.current.model.lastCar).toStrictEqual({
      uuid: f250.uuid,
      timestamp: expect.any(String),
    });
  });

  test('Persisting last car before update it with a new one', async () => {
    mockAdapter
      .onGet('/uuid')
      .reply(200, { uuid: f250.uuid })
      .onGet('/uuid')
      .reply(200, { uuid: ranger.uuid });

    const controller = TestingHooks.renderHook(() => {
      return useCarController(httpClient);
    });

    expect(controller.result.current.model.lastCar).toStrictEqual(defaultCar);

    await TestingHooks.act(async () => {});
    await TestingHooks.act(async () => {});

    expect(controller.result.current.model.lastCar).toStrictEqual({
      uuid: ranger.uuid,
      timestamp: expect.any(String),
    });
    expect(controller.result.current.model.cars).toHaveLength(1);
  });
});

describe('View', () => {
  test('Showing last car found', async () => {
    const controller: CarController = {
      refresh: jest.fn(),
      model: {
        lastCar: f250,
        cars: [],
      },
    };
    const node = TestingReact.render(
      <CarViewDefault controller={controller} />,
    );

    const carUuid = await node.findByTestId('car-lastcar-uuid');
    const carTimestamp = await node.findByTestId('car-lastcar-timestamp');

    expect(carUuid.children).toStrictEqual([f250.uuid]);
    expect(carTimestamp.children).toStrictEqual([f250.timestamp]);
  });

  test('Showing list of known cars', async () => {
    const controller: CarController = {
      refresh: jest.fn(),
      model: {
        lastCar: f250,
        cars: [f250, ranger],
      },
    };
    const node = TestingReact.render(
      <CarViewDefault controller={controller} />,
    );

    const list = await node.findByTestId('car-cars');

    expect(list.getProp('data')).toStrictEqual([f250, ranger]);
  });

  test('Pressing update button triggers refresh', async () => {
    const refreshFn = jest.fn();
    const controller: CarController = {
      refresh: refreshFn,
      model: {
        lastCar: f250,
        cars: [f250, ranger],
      },
    };
    const node = TestingReact.render(
      <CarViewDefault controller={controller} />,
    );

    const button = await node.findByTestId('car-update');

    TestingReact.fireEvent.press(button);

    expect(refreshFn).toHaveBeenCalledTimes(1);
  });
});
