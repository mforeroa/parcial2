/* eslint-disable prettier/prettier */
import { ClubEntity } from "../club/club.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    nombreUsuario: string;
    
    @Column()
    correo: string;
    
    @Column()
    fechaNacimineto: Date;

    @ManyToMany(() => ClubEntity, club => club.socios)
    clubs: ClubEntity [];

   
}
