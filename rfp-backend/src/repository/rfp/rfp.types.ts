import { RfpDocument } from '../../database/rfp.schema';

export interface IRfpRepository {
  create(data: Partial<RfpDocument>): Promise<RfpDocument>;
  findAll(): Promise<RfpDocument[]>;
  findOne(filter: any): Promise<RfpDocument | null>;
}


