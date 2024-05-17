/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity> //la instancia que generamos nos permitirá acceder a la tabla de la entidad en la base de datos
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubs"] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["clubs"] } );
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
   
        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (!socio.correo.includes('@'))
            throw new BusinessLogicException("Invalid email format", BusinessError.PRECONDITION_FAILED);
        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});//verificar que museo exista
        if (!persistedSocio)//verificar si si encontro el museo  
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
        else if(!socio.correo.includes('@'))
            throw new BusinessLogicException("Invalid email format", BusinessError.PRECONDITION_FAILED);
        
        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.socioRepository.remove(socio);
    }
}
