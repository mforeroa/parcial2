/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from 'src/club/club.entity';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubSocioController } from './club-socio.controller';

@Module({
  providers: [ClubSocioService],
  imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  controllers: [ClubSocioController]
})
export class ClubSocioModule {}
