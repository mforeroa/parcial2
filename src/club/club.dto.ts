/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl, MaxLength} from 'class-validator';
export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsNotEmpty()
    readonly fechaFundacion: Date;

    @IsUrl()//validar que sea una URL.
    @IsNotEmpty()
    readonly image: string;

    @IsString()//validar que sea una cadena de caracteres
    @IsNotEmpty()//validar que no esté vacío
    @MaxLength(101)
    readonly description: string;
   
}
