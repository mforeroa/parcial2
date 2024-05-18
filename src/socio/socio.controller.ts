/* eslint-disable prettier/prettier */ 
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioService } from './socio.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(private readonly socioService: SocioService) {}

    @Get()
    async findAll() {
      return await this.socioService.findAll();
    }

    @Get(':socioId')
    async findOne(@Param('socioId') socioId: string) {//parámetro que viene en la URL de la petición se extrae y se convierte en una variable de TypeScript.
      return await this.socioService.findOne(socioId);
    }

    @Post()//método HTTP para agregar un recurso a la colección de recursos
    async create(@Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);//convertir el Dto a Entity.
      return await this.socioService.create(socio);
    }

    @Put(':socioId')
    async update(@Param('socioId') socioId: string, @Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.update(socioId, socio);
    }

    @Delete(':socioId')
    @HttpCode(204)
    async delete(@Param('socioId') socioId: string) {
      return await this.socioService.delete(socioId);
    }
}
