import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { AuthModule } from '../auth/auth.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [AuthModule, CryptoModule]
})
export class StoresModule {}
