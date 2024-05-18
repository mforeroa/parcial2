/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class ClubSocioService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
    
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) {}

    async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> { //agregar la obra de arte a la lista de obras de arte del museo.
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});//verificar que la obra de arte con el id dado exista
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
      
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})//verificar que el museo exista
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
    
        //agregar la obra de arte a la lista de obras de arte del museo 
        //crea una nueva lista que contiene todos los elementos de la lista club.socios original, junto con la nueva obra de arte (socio) que se va a agregar.
        club.socios = [...club.socios, socio];//...  desempaquetar todos los elementos de la lista
        return await this.clubRepository.save(club);//actualizar
      }

    async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {// retornar la lista de obras de arte asociadas a el museo con el id dado por parámetro 
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});//verificar que exista
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
    
        return club.socios;//retornar socios
    }
    
    async findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity> {//retornar la obra de arte con el id pasado por parámetro, únicamente si esta se encuentra asociada con el museo con el id dado.
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
   
        const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);//busca en la lista de socios de club el socio
   
        if (!clubSocio)//revisa si existe
          throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)
   
        return clubSocio;
    }
    
    async updateMembersFromClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity> {//reemplazar la lista de obras de arte asociadas al museo con el id dado con la lista de obras de arte dadas por parámetro
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
    
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)//revisar que el museo exista
    
        for (let i = 0; i < socios.length; i++) {//revisar que existan todos los socios de la lista
          const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}});//sacar el socio de la base de datos
          if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)//revisar que exista
        }
    
        club.socios = socios;//asignar socios al museo
        return await this.clubRepository.save(club);//actualizar museo
      }
    
    async deleteMemberFromClub(clubId: string, socioId: string){//eliminar la obra de arte con el id dado de la lista de obras de arte del museo con el id dado
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});//revisar que existan
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);//revisar que la obra este entre el museo
    
        if (!clubSocio)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)
 
        club.socios = club.socios.filter(e => e.id !== socioId);//filtrar los socios diferentes al creado
        await this.clubRepository.save(club);//reasignar socios filtrados
    }  
}
