/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from "class-validator";

export class GenerationRequest{
    @IsString()
    document: string;
}