import { DataSource } from 'typeorm';
import config from '../utils/config';

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      try {
        const dataSource = new DataSource({
          type: 'mysql',
          host: config.database.host,
          port: config.database.port,
          username: config.database.username,
          password: config.database.password,
          database: config.database.name,
          entities: [__dirname + '/entities/*.entity{.ts,.js}'],
          synchronize: true,
        });
        console.log('Connected to DB');
        return dataSource.initialize();
      } catch (error) {
        console.error('Error connecting to the database:', error);
        return {
          module: 'DatabaseModule',
        };
      }
    },
  },
];
