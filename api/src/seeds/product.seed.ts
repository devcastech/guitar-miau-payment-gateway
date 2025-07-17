import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';

export const productSeed = async (dataSource: DataSource) => {
  const productRepository = dataSource.getRepository(Product);

  const existingProducts = await productRepository.count();
  if (existingProducts > 0) {
    console.log('Ya existen productos en la base de datos. Omitiendo seed.');
    return;
  }

  const products: Partial<Product>[] = [
    {
      name: 'Fender Stratocaster',
      description:
        'Guitarra eléctrica Fender Stratocaster American Professional II, color Sunburst',
      price: 3000000,
      stock: 100,
      image:
        'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Gibson Les Paul Standard',
      description:
        'Guitarra eléctrica Gibson Les Paul Standard, acabado Heritage Cherry Sunburst',
      price: 5000000,
      stock: 120,
      image:
        'https://images.unsplash.com/photo-1550985616-10810253b84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Taylor 214ce',
      description:
        'Guitarra acústica Taylor 214ce, tapa de abeto, fondo y aros de koa',
      price: 1200000,
      stock: 200,
      image:
        'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Ibanez RG550',
      description:
        'Guitarra eléctrica Ibanez RG550 Genesis Collection, color Desert Sun Yellow',
      price: 2000000,
      stock: 60,
      image:
        'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
    {
      name: 'Martin D-28',
      description:
        'Guitarra acústica Martin D-28, tapa de abeto sitka, fondo y aros de palisandro',
      price: 1600000,
      stock: 100,
      image:
        'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
  ];

  for (const product of products) {
    await productRepository.save(product);
  }

  console.log('Seed de productos completado con éxito.');
};
