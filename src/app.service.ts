import * as dotenv from 'dotenv';
dotenv.config();

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Model, Promise } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  @Cron(process.env.CRON_FETCH_REWARD_DATA)
  private logReward(): Promise<RewardDocument> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          'https://api.flexpool.io/v2/pool/dailyRewardPerGigahashSec?coin=eth',
        )
        .subscribe({
          next: ({ data: { result: reward } }) => {
            const rewardLog = new this.rewardModel({
              amount: reward / 10000000000000000000,
              date: new Date(),
            });
            rewardLog.save().then(resolve, reject);
          },
          error: reject,
        });
    });
  }

  async getRewardChart(): Promise<any> {
    const rewards = await this.rewardModel.find({}).sort({ date: 1 });

    return {
      values: rewards.map((reward) => reward.amount),
      dates: rewards.map((reward) =>
        moment(reward.date).format('YYYY-MM-DD HH:mm:ss'),
      ),
    };
  }
}
