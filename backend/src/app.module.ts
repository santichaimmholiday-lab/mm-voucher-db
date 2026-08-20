import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { MasterLocatypesModule } from './master-locatypes/master-locatypes.module';

import { MasterLocationsController } from './master-locations/master-locations.controller';
import { MasterLocationsService } from './master-locations/master-locations.service';

import { CustomersController } from './customers/customers.controller';
import { CustomersService } from './customers/customers.service';

import { VouchersController } from './vouchers/vouchers.controller';
import { VouchersService } from './vouchers/vouchers.service';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SettingsModule } from './settings/settings.module';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_FOR_DEV',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule, 
    MasterLocatypesModule, 
    SettingsModule
  ],
  controllers: [
    MasterLocationsController,
    CustomersController,
    VouchersController,
    AuthController
  ],
  providers: [
    MasterLocationsService,
    CustomersService,
    VouchersService,
    AuthService
  ],
})
export class AppModule {}
