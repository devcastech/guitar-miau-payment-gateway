import { DataSource } from 'typeorm';
import { config } from '../config/ormconfig';
import { productSeed } from './product.seed';
import { customerSeed } from './customer.seed';

const runSeeds = async () => {
  console.log('SEED_MODE: Iniciando proceso de seeds...');

  const dataSource = new DataSource(config);

  try {
    await dataSource.initialize();
    console.log('SEED_MODE: Conexión a la base de datos establecida');

    await productSeed(dataSource);
    await customerSeed(dataSource);

    console.log('SEED_MODE: Proceso de seeds completado exitosamente');
  } catch (error) {
    console.error('SEED_MODE: Error durante el proceso de seeds:', error);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('SEED_MODE: Conexión a la base de datos cerrada');
    }
  }
};

runSeeds();

