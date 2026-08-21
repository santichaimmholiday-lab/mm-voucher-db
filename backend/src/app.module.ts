import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
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
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

import { JwtModule } from '@nestjs/jwt';
import { PermissionsModule } from './permissions/permissions.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_FOR_DEV',
      signOptions: { expiresIn: '4h' },
    }),
    PrismaModule, 
    MasterLocatypesModule, 
    SettingsModule,
    PermissionsModule,
    DashboardModule
  ],
  controllers: [
    MasterLocationsController,
    CustomersController,
    VouchersController,
    AuthController,
    AppController,
    UsersController
  ],
  providers: [
    MasterLocationsService,
    CustomersService,
    VouchersService,
    AuthService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
