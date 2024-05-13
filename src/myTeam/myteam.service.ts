import { GiveBonusDto } from './dto/giveBonus.Dto';
import { GiveRaiseDto } from './dto/giveRaise.Dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MyteamService {
  constructor(private prisma: PrismaService) {}

  async getHiredData(userId: string) {
    const hiredData = [];
    const userData = await this.prisma.user.findMany({
      where: {
        client: userId,
      },
    });

    for (const user of userData) {
      const hourlyRate = user.hourlyRate || 0;
      const workingHoursPerDay = 8;
      const workingDaysPerMonth = 22;
      const monthlyPayment =
        hourlyRate * workingHoursPerDay * workingDaysPerMonth;

      const bonusData = await this.prisma.giveBonus.findMany({
        where: {
          userId: user.userId,
        },
      });

      let totalBonus = 0;
      bonusData.forEach((entry) => {
        totalBonus += entry.bonusAmount;
      });

      const raiseData = await this.prisma.giveRaise.findMany({
        where: {
          userId: user.userId,
        },
      });

      const vettingResultData = await this.prisma.vettingResults.findMany({
        where: {
          userId: user.userId,
        },
      });

      const weeklySummaries = await this.prisma.weeklySummaries.findMany({
        where: {
          userId: user.userId,
        },
      });

      const educationDetails = await this.prisma.educationDetails.findMany({
        where: {
          userId: user.userId,
        },
      });

      const experienceDetails = await this.prisma.experienceDetails.findMany({
        where: {
          userId: user.userId,
        },
      });

      hiredData.push({
        userData: user,
        monthlySalary: monthlyPayment,
        bonusHistory: bonusData,
        raiseHistory: raiseData,
        totalBonusGiven: totalBonus,
        vettingResult: vettingResultData,
        weeklySummaries: weeklySummaries,
        educationDetails: educationDetails,
        experienceDetails: experienceDetails,
      });
    }
    return hiredData;
  }

  async getRecommendationData() {
    const recommendationData = [];
    const userData = await this.prisma.user.findMany({
      where: {
        currentStatus: 'openToWork',
      },
    });

    for (const user of userData) {
      const hourlyRate = user.hourlyRate || 0;
      const workingHoursPerDay = 8;
      const workingDaysPerMonth = 22;
      const monthlyPayment =
        hourlyRate * workingHoursPerDay * workingDaysPerMonth;

      const vettingResultData = await this.prisma.vettingResults.findMany({
        where: {
          userId: user.userId,
        },
      });

      const educationDetails = await this.prisma.educationDetails.findMany({
        where: {
          userId: user.userId,
        },
      });

      const experienceDetails = await this.prisma.experienceDetails.findMany({
        where: {
          userId: user.userId,
        },
      });

      recommendationData.push({
        userData: user,
        monthlyPayment: monthlyPayment,
        vettingResult: vettingResultData,
        educationDetails: educationDetails,
        experienceDetails: experienceDetails,
      });
    }
    return recommendationData;
  }

  async giveBonusData(giveBonusDto: GiveBonusDto, userId: string) {
    const bonusData = await this.prisma.giveBonus.create({
      data: {
        userId: userId,
        bonusAmount: Number(giveBonusDto.bonusAmount),
        date: new Date(),
      },
    });
    return bonusData;
  }

  async giveRaiseData(giveRaiseDto: GiveRaiseDto, userId: string) {
    const raiseData = await this.prisma.giveRaise.create({
      data: {
        userId: userId,
        raiseAmount: giveRaiseDto.raiseAmount,
        effectiveOn: new Date(giveRaiseDto.effectiveOn),
        currentRate: giveRaiseDto.currentRate,
        afterRaiseRate: giveRaiseDto.afterRaiseRate,
        messageRegardingRaise: giveRaiseDto.messageRegardingRaise,
        sentOnDate: new Date(),
      },
    });
    return raiseData;
  }

  async getBonusData(userId: string) {
    if (userId) {
      const bonusData = await this.prisma.giveBonus.findMany({
        where: {
          userId: userId,
        },
      });
      return bonusData;
    }
  }

  async getRaiseData(userId: string) {
    if (userId) {
      const raiseData = await this.prisma.giveRaise.findMany({
        where: {
          userId: userId,
        },
      });
      return raiseData;
    }
  }
}
