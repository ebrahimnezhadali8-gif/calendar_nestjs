import { IsNotEmpty, Matches } from "class-validator";

export class ConflictEventDto {
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date: string;
}