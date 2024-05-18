/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
 let service: SocioService;
 let repository: Repository<SocioEntity>;
 let sociosList: SocioEntity[];

 beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [...TypeOrmTestingConfig()],
    providers: [SocioService],
  }).compile();

  service = module.get<SocioService>(SocioService);
  repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));//para tener acceso al repositorio 
 await seedDatabase();
});

 const seedDatabase = async () => {
  repository.clear();//borra datos repo
  sociosList = []; //inicializa arreglo
  for(let i = 0; i < 5; i++){//inserta 5 museos
      const socio: SocioEntity = await repository.save({//datos aleatorios con faker
        nombreUsuario: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimineto: faker.date.past()})
        sociosList.push(socio);
  }
}
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 it('findAll should return all socios', async () => {
  const socios: SocioEntity[] = await service.findAll();
  expect(socios).not.toBeNull();
  expect(socios).toHaveLength(sociosList.length);
});

it('findOne should return a socio by id', async () => {
  const storedSocio: SocioEntity = sociosList[0];//primer museo de la lista
  const socio: SocioEntity = await service.findOne(storedSocio.id);//encontrar el museo por id
  expect(socio).not.toBeNull();//que no sea nulo
  expect(socio.nombreUsuario).toEqual(storedSocio.nombreUsuario)//que tenga los mismos atributos
  expect(socio.correo).toEqual(storedSocio.correo)
  expect(socio.fechaNacimineto).toEqual(storedSocio.fechaNacimineto)
});

it('findOne should throw an exception for an invalid socio', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
});

it('create should return a new socio', async () => {
  const socio: SocioEntity = {
    id: "",
    nombreUsuario: faker.internet.userName(),
    correo: faker.internet.email(),
    fechaNacimineto: faker.date.past(),
    clubs: []
  }

  const newSocio: SocioEntity = await service.create(socio);//se crea el nuevo museo con la entidad creada
  expect(newSocio).not.toBeNull();

  const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombreUsuario).toEqual(newSocio.nombreUsuario)
  expect(storedSocio.correo).toEqual(newSocio.correo)
  expect(storedSocio.fechaNacimineto).toEqual(newSocio.fechaNacimineto)
});

it('create should throw an exception for an invalid email',async()=>{
  const socio: SocioEntity = {
    id: "",
    nombreUsuario: faker.internet.userName(),
    correo: faker.string.alpha(),
    fechaNacimineto: faker.date.past(),
    clubs: []
  }
  await expect(() => service.create(socio)).rejects.toHaveProperty("message", "Invalid email format")
})

it('update should modify a socio', async () => {
  const socio: SocioEntity = sociosList[0];//primer mueso en la lista
  socio.nombreUsuario = "newUserName";//actualiza datos
  socio.correo = faker.internet.email();
   const updatedSocio: SocioEntity = await service.update(socio.id, socio);//llama al metodo update y lo actualiza
  expect(updatedSocio).not.toBeNull();//se espera que no retorne nulo
   const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })//se busca el museo
  expect(storedSocio).not.toBeNull();//se revisa que exista
  expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario)//se revisa que se haya actualizado la info
  expect(storedSocio.correo).toEqual(socio.correo)
});

it('update should throw an exception for an invalid socio', async () => {
  let socio: SocioEntity = sociosList[0];//se toma el primer museo de la lista
  socio = {
    ...socio, nombreUsuario: "newUserName", correo: faker.internet.email()
  }
  await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "The socio with the given id was not found")//que reciba excepcion si el museo que intenta actualizar no existe
});

it('update should throw an exception for an invalid socio email', async () => {
  let socio: SocioEntity = sociosList[0]; // Get the first socio from the list
  socio={
    ...socio, correo: faker.string.alpha() // Set the description to have over 100 characters
  }
  await expect(() => service.update(socio.id, socio)).rejects.toHaveProperty("message", "Invalid email format");
});

it('delete should remove a socio', async () => {
  const socio: SocioEntity = sociosList[0];//primer museo de la lista
  await service.delete(socio.id);//por lo que es un metodo asincronico

  const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })//buscar museo eliminado
  expect(deletedSocio).toBeNull();//esperar que efectivamentre se haya eliminado
});

it('delete should throw an exception for an invalid socio', async () => {
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
});

});
