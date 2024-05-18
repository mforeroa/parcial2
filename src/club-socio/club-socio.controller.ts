/* eslint-disable prettier/prettier */ 
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SocioDto } from '../socio/socio.dto';
import { SocioEntity } from '../socio/socio.entity';
import { ClubSocioService } from './club-socio.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/members/:memberId')//ruta
    async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
        return await this.clubSocioService.addMemberToClub(clubId, socioId);
    }
 
    @Get(':clubId/members/:memberId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
        return await this.clubSocioService.findMemberFromClub(clubId, socioId);
    }
 
    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string){
        return await this.clubSocioService.findMembersFromClub(clubId);
    }
 
    @Put(':clubId/members')
    async updateMembersFromClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string){
        const socios = plainToInstance(SocioEntity, sociosDto)
        return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }
 
    @Delete(':clubId/members/:socioId')
     @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
        return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
    }
}
