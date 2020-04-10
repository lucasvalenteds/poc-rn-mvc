import React from 'react';
import * as TestingHooks from '@testing-library/react-hooks';
import Axios, { AxiosInstance } from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { Car, useCarController } from './Car';

const defaultCar: Car = {
  uuid: '',
  timestamp: '',
};

const f250: Car = {
  uuid: '7b6d5534-7b6c-11ea-9483-13b1c3d959e4',
  timestamp: new Date(2017, 1, 2).toString(),
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
    await TestingHooks.act(async () => {});

    expect(controller.result.current.model.lastCar).toStrictEqual({
      uuid: f250.uuid,
      timestamp: expect.any(String),
    });
  });
});

describe('View', () => {
  test.todo('Showing last car found');
  test.todo('Showing list of known cars');
});
