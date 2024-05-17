/* eslint-disable prettier/prettier */
import { SocioEntity } from "src/socio/socio.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    nombre: string;
    
    @Column()
    fechaFundacion: Date;
    
    @Column()
    image: string;
    
    @Column()
    description: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    @JoinTable()
    socios: SocioEntity [];

   
}