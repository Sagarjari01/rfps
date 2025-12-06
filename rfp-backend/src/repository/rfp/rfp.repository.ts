import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { Rfp, RfpDocument } from '../../database/rfp.schema';
import { IRfpRepositoryManager } from './rfp.manager';

@Injectable()
export class RfpRepository extends BaseRepository<RfpDocument> implements IRfpRepositoryManager {
  constructor(@InjectModel(Rfp.name) private rfpModel: Model<RfpDocument>) {
    super(rfpModel);
  }
}

