import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProposalDocument = Proposal & Document;

@Schema({ timestamps: true })
export class Proposal {
  @Prop({ required: true })
  rfpId: string;

  @Prop({ required: true })
  vendorName: string;

  @Prop()
  rawEmailBody: string;

  @Prop()
  price: number;

  @Prop()
  deliveryDate: string;

  @Prop()
  warranty: string;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);


