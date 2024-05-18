/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
 let service: ClubService;
 let repository: Repository<ClubEntity>;
 let clubsList: ClubEntity[];

 beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [...TypeOrmTestingConfig()],
    providers: [ClubService],
  }).compile();

  service = module.get<ClubService>(ClubService);
  repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));//para tener acceso al repositorio 
 await seedDatabase();
});

 const seedDatabase = async () => {
  repository.clear();//borra datos repo
  clubsList = []; //inicializa arreglo
  for(let i = 0; i < 5; i++){//inserta 5 museos
      const club: ClubEntity = await repository.save({//datos aleatorios con faker
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past(),
      image: faker.image.url(),
      description: faker.string.alpha(30)})
      clubsList.push(club);
  }
}
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 it('findAll should return all clubs', async () => {
  const clubs: ClubEntity[] = await service.findAll();
  expect(clubs).not.toBeNull();
  expect(clubs).toHaveLength(clubsList.length);
});

it('findOne should return a club by id', async () => {
  const storedClub: ClubEntity = clubsList[0];//primer museo de la lista
  const club: ClubEntity = await service.findOne(storedClub.id);//encontrar el museo por id
  expect(club).not.toBeNull();//que no sea nulo
  expect(club.nombre).toEqual(storedClub.nombre)//que tenga los mismos atributos
  expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
  expect(club.image).toEqual(storedClub.image)
  expect(club.description).toEqual(storedClub.description)
});

it('findOne should throw an exception for an invalid club', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
});

it('create should return a new club', async () => {
  const club: ClubEntity = {
    id: "",
    nombre: faker.company.name(),
    fechaFundacion: faker.date.past(),
    image: faker.image.url(),
    description: faker.string.alpha(10),
    socios: []
  }

  const newClub: ClubEntity = await service.create(club);//se crea el nuevo museo con la entidad creada
  expect(newClub).not.toBeNull();

  const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
  expect(storedClub).not.toBeNull();
  expect(storedClub.nombre).toEqual(newClub.nombre)
  expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
  expect(storedClub.image).toEqual(newClub.image)
  expect(storedClub.description).toEqual(newClub.description)
});

it('create should throw an exception for and invalid description',async()=>{
  const club: ClubEntity = {
    id: "",
    nombre: faker.company.name(),
    fechaFundacion: faker.date.past(),
    image: faker.image.url(),
    description: faker.string.alpha(101),
    socios: []
  }
  await expect(() => service.create(club)).rejects.toHaveProperty("message", "The club description must have less than a 100 characters")
})

it('update should modify a club', async () => {
  const club: ClubEntity = clubsList[0];//primer mueso en la lista
  club.nombre = "New name";//actualiza datos
  club.description = "New description";
   const updatedClub: ClubEntity = await service.update(club.id, club);//llama al metodo update y lo actualiza
  expect(updatedClub).not.toBeNull();//se espera que no retorne nulo
   const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })//se busca el museo
  expect(storedClub).not.toBeNull();//se revisa que exista
  expect(storedClub.nombre).toEqual(club.nombre)//se revisa que se haya actualizado la info
  expect(storedClub.description).toEqual(club.description)
});

it('update should throw an exception for an invalid club', async () => {
  let club: ClubEntity = clubsList[0];//se toma el primer museo de la lista
  club = {
    ...club, nombre: "New name", description: "New description"
  }
  await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")//que reciba excepcion si el museo que intenta actualizar no existe
});

it('update should throw an exception for an invalid club description', async () => {
  let club: ClubEntity = clubsList[0]; // Get the first club from the list
  club={
    ...club, description: faker.string.alpha(101) // Set the description to have over 100 characters
  }
  await expect(() => service.update(club.id, club)).rejects.toHaveProperty("message", "The description must have less than a 100 characters");
});

it('delete should remove a club', async () => {
  const club: ClubEntity = clubsList[0];//primer museo de la lista
  await service.delete(club.id);//por lo que es un metodo asincronico

  const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })//buscar museo eliminado
  expect(deletedClub).toBeNull();//esperar que efectivamentre se haya eliminado
});

it('delete should throw an exception for an invalid club', async () => {
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
});

});
