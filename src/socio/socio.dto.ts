/* eslint-disable prettier/prettier */
import {Contains, IsDate, IsNotEmpty, IsString} from 'class-validator';
export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombreUsuario: string;

    @Contains('@')
    @IsNotEmpty()
    @IsString()
    readonly correo: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechaNacimineto: Date;


}
