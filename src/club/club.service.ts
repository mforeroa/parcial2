/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity> //la instancia que generamos nos permitirá acceder a la tabla de la entidad en la base de datos
    ){}

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"] });
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id}, relations: ["socios"] } );
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
        if (club.description.length > 100) {
            throw new BusinessLogicException("The club description must have less than a 100 characters", BusinessError.PRECONDITION_FAILED);
        }
        return await this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});//verificar que museo exista
        if (!persistedClub)//verificar si si encontro el museo  
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        else if(club.description.length > 100)
            throw new BusinessLogicException("The description must have less than a 100 characters", BusinessError.PRECONDITION_FAILED);
        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.clubRepository.remove(club);
    }
}
