import { DataSource } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';

export const customerSeed = async (dataSource: DataSource) => {
  const customerRepository = dataSource.getRepository(Customer);

  const existingCustomers = await customerRepository.count();
  if (existingCustomers > 0) {
    console.log('Ya existen clientes en la base de datos. Omitiendo seed.');
    return;
  }

  const CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440000';
  const customer: Partial<Customer> = {
    id: CUSTOMER_ID,
    name: 'Jimmy Page',
    email: 'jimmy.page@example.com',
    phone: '3012909829',
    address: 'Calle 123 #45-67, Medellín, Colombia',
  };

  await customerRepository.save(customer);

  console.log('Seed de customer completado con éxito.');
};
