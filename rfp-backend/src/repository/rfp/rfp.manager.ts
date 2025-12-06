import { RfpDocument } from '../../database/rfp.schema';

export const IRfpRepositoryManagerToken = 'IRfpRepositoryManager';

export interface IRfpRepositoryManager {
  create(data: Partial<RfpDocument>): Promise<RfpDocument>;
  findAll(): Promise<RfpDocument[]>;
  findOne(filter: Record<string, any>): Promise<RfpDocument | null>;
}
