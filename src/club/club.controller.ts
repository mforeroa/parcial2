/* eslint-disable prettier/prettier */ 
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubService } from './club.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubDto } from './club.dto';
import { ClubEntity } from './club.entity';
import { plainToInstance } from 'class-transformer';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    @Get()
    async findAll() {
      return await this.clubService.findAll();
    }

    @Get(':clubId')
    async findOne(@Param('clubId') clubId: string) {//parámetro que viene en la URL de la petición se extrae y se convierte en una variable de TypeScript.
      return await this.clubService.findOne(clubId);
    }

    @Post()//método HTTP para agregar un recurso a la colección de recursos
    async create(@Body() clubDto: ClubDto) {
      const club: ClubEntity = plainToInstance(ClubEntity, clubDto);//convertir el Dto a Entity.
      return await this.clubService.create(club);
    }

    @Put(':clubId')
    async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
      const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
      return await this.clubService.update(clubId, club);
    }

    @Delete(':clubId')
    @HttpCode(204)
    async delete(@Param('clubId') clubId: string) {
      return await this.clubService.delete(clubId);
    }
}
