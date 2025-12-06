import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RfpDocument = Rfp & Document;

@Schema({ timestamps: true })
export class Rfp {
  @Prop({ required: true })
  userRequest: string;

  @Prop({ type: Object })
  structuredData: any;

  @Prop({ default: 'draft' })
  status: string;
}

export const RfpSchema = SchemaFactory.createForClass(Rfp);


