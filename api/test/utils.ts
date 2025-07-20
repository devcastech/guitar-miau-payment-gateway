import { getRepositoryToken } from '@nestjs/typeorm';

export const getMockManager = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});
export const getMockRepository = (mockManager) => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  manager: {
    transaction: jest
      .fn()
      .mockImplementation((callback: (manager: any) => Promise<any>) =>
        callback(mockManager),
      ),
  },
});

export const getModule = (service, entitie, mockRepository) => ({
  providers: [
    service,
    {
      provide: getRepositoryToken(entitie),
      useValue: mockRepository,
    },
  ],
});