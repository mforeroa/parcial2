/* eslint-disable prettier/prettier */
import {Contains, IsNotEmpty, IsString} from 'class-validator';
export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombreUsuario: string;

    @Contains('@')
    @IsNotEmpty()
    @IsString()
    readonly correo: string;

    @IsNotEmpty()
    readonly fechaNacimineto: Date;


}
