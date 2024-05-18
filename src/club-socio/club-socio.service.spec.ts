/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;//repo dueña
  let socioRepository: Repository<SocioEntity>;//repo atributo asociado
  let club: ClubEntity;//entidad dueño
  let sociosList : SocioEntity[];//lista atributos

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));//para tener acceso al repositorios
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();//limpiar bases de datos
    clubRepository.clear();

    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          nombreUsuario: faker.internet.userName(),
          correo: faker.internet.email(),
          fechaNacimineto: faker.date.past()
        })
        sociosList.push(socio);
    }//generar socios

    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past(),
      image: faker.image.url(),
      description: faker.string.alpha(30),
      socios: sociosList
    })//crear museo de la asociacion
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //probar metodo add
  it('addMemberToClub should add an socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past()
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past(),
      image: faker.image.url(),
      description: faker.string.alpha(30)
    })

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);//usar el servicio
    
    expect(result.socios.length).toBe(1);//revisar que se haya añadido
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimineto).toStrictEqual(newSocio.fechaNacimineto)
  });

  it('addMemberToClub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past(),
      image: faker.image.url(),
      description: faker.string.alpha(30)
    })

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past()
    });

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  //Probar encontrar socio en museo
  it('findMemberFromClub should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id, )
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario)//que tenga los mismos atributos
    expect(storedSocio.correo).toEqual(socio.correo)
    expect(storedSocio.fechaNacimineto).toEqual(socio.fechaNacimineto)
  });

  it('findMemberFromClub should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('findMemberFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0]; 
    await expect(()=> service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('findMemberFromClub should throw an exception for an socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past()
    });

    await expect(()=> service.findMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
  });

  //probar encontrar obras por museo
  it('findMembersFromClub should return socios by club', async ()=>{
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5)
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });
  
  //probar asociar lista de socios a un museo
  it('updateMembersFromClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past()
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);//nueva lista solo tiene 1 socio
    expect(updatedClub.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario);
    expect(updatedClub.socios[0].correo).toBe(newSocio.correo);
    expect(updatedClub.socios[0].fechaNacimineto).toBe(newSocio.fechaNacimineto);
  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past()
    });

    await expect(()=> service.updateMembersFromClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('updateMembersFromClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";

    await expect(()=> service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  //probar eliminar obra de arte de un museo
  it('deleteMemberFromClub should remove an socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteMemberFromClub(club.id, socio.id);//probar servicio

    // const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    // const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

    await expect(()=> service.findMemberFromClub(club.id, socio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
    //expect(deletedSocio).toBeUndefined();

  });

  it('deleteMemberFromClub should thrown an exception for an invalid socio', async () => {
    await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('deleteSocioToClub should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(()=> service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('deleteSocioToClub should thrown an exception for an non asocciated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past()
    });

    await expect(()=> service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
  }); 

});
