import * as AWS from 'aws-sdk';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DocumentService } from 'src/document/document.service';
import { EremoteLabsDto } from './dto/eremoteLab.dto';
import { FilterDTO } from './dto/filter.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClientdashboardService {
  constructor(
    private prisma: PrismaService,
    private documentService: DocumentService,
  ) {
  }

  async getRaiseHistoryData(userId: string) {
    try {
      const clientVerification = await this.prisma.user.findUnique({
        where: {
          userId: userId,
          userRole: 'client',
        },
      });
      if (clientVerification.userRole == 'client') {
        const userData = await this.prisma.user.findMany({
          where: {
            client: userId,
          },
          select: {
            userId: true,
            designation: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        });
        const raiseDataPromises = userData.map(async (item) => {
          const raiseData = await this.getGiveRaiseData(item.userId);
          return { userData: item, raiseData: raiseData };
        });

        const userDataWithRaiseData = await Promise.all(raiseDataPromises);
        return userDataWithRaiseData;
      } else {
        throw new HttpException('Unable to access', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (err) {
      return err;
    }
  }

  async getBonusHistoryData(userId: string) {
    try {
      const clientVerification = await this.prisma.user.findUnique({
        where: {
          userId: userId,
          userRole: 'client',
        },
      });

      if (clientVerification.userRole == 'client') {
        const userData = await this.prisma.user.findMany({
          where: {
            client: userId,
          },
          select: {
            userId: true,
            designation: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        });
        const bonusDataPromises = userData.map(async (item) => {
          const bonusData = await this.getGiveBonusData(item.userId);
          return { userData: item, bonusData: bonusData };
        });

        const userDataWithBonusData = await Promise.all(bonusDataPromises);
        return userDataWithBonusData;
      } else {
        throw new HttpException('Unable to access', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (err) {
      return err;
    }
  }

  async getGiveRaiseData(userId: string) {
    const data = await this.prisma.giveRaise.findMany({
      where: {
        userId: userId,
      },
      select: {
        raiseAmount: true,
        effectiveOn: true,
      },
    });
    return data;
  }

  async getGiveBonusData(userId: string) {
    const data = await this.prisma.giveBonus.findMany({
      where: {
        userId: userId,
      },
      select: {
        bonusAmount: true,
        date: true,
      },
    });
    return data;
  }

  async getTotalBonusData(userId: string) {
    try {
      const clientVerification = await this.prisma.user.findUnique({
        where: {
          userId: userId,
          userRole: 'client',
        },
      });
      if (clientVerification.userRole == 'client') {
        const userData = await this.prisma.user.findMany({
          where: {
            client: userId,
          },
          select: {
            userId: true,
            designation: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        });

        const bonusDataPromises = userData.map(async (item) => {
          const bonusData = await this.getGiveBonusData(item.userId);
          const totalBonus = bonusData.reduce(
            (acc, bonus) => acc + bonus.bonusAmount,
            0,
          );
          return totalBonus;
        });

        const allBonusData = await Promise.all(bonusDataPromises);
        const totalBonus = allBonusData.reduce((acc, bonus) => acc + bonus, 0);

        return totalBonus;
      } else {
        return 0;
      }
    } catch (err) {
      return err;
    }
  }

  async getClientPaymentData(userId: string) {
    try {
      const clientVerification = await this.prisma.user.findUnique({
        where: {
          userId: userId,
          userRole: 'client',
        },
      });
      if (clientVerification.userRole == 'client') {
        const userData = await this.prisma.user.findMany({
          where: {
            client: userId,
          },
          select: {
            userId: true,
            designation: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        });
        const paymentDataPromises = userData.map(async (item) => {
          const paymentData = await this.getPaymentData(item.userId);
          return { userData: item, paymentData: paymentData };
        });

        const userDataWithPaymentData = await Promise.all(paymentDataPromises);
        return userDataWithPaymentData;
      } else {
        throw new HttpException('Unable to access', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (err) {
      return err;
    }
  }

  async getPaymentData(userId: string) {
    try {
      const paymentData = await this.prisma.payment.findMany({
        where: {
          userId: userId,
        },
      });
      return paymentData;
    } catch (err) {
      return err;
    }
  }

  async getMonthlyPaymentData(userId: string) {
    try {
      const clientVerification = await this.prisma.user.findUnique({
        where: {
          userId: userId,
          userRole: 'client',
        },
      });
      if (clientVerification.userRole == 'client') {
        const userData = await this.prisma.user.findMany({
          where: {
            client: userId,
          },
          select: {
            userId: true,
            designation: true,
            firstName: true,
            lastName: true,
            hourlyRate: true,
            profilePicture: true,
            hiredDate: true,
          },
        });
        const monthlyPayments = userData.map((user) => {
          const hourlyRate = user.hourlyRate || 0; // default to 0 if hourly rate is not provided
          const workingHoursPerDay = 8;
          const workingDaysPerMonth = 22;
          const monthlyPayment =
            hourlyRate * workingHoursPerDay * workingDaysPerMonth;
          return {
            userId: user.userId,
            firstName: user.firstName,
            designation: user.designation,
            profilePicture: user.profilePicture,
            lastName: user.lastName,
            monthlyPayment: monthlyPayment,
            hiredDate: user.hiredDate,
          };
        });

        return monthlyPayments;
      }
    } catch (err) {
      return err;
    }
  }

  async getTotalMonthlyPaymentData(userId: string) {
    try {
      const data = await this.getMonthlyPaymentData(userId);
      let totalMonthlyPayment = 0;

      data.forEach((user: any) => {
        totalMonthlyPayment += user.monthlyPayment;
      });

      return totalMonthlyPayment;
    } catch (err) {
      return err;
    }
  }

  async addERemoteLabData(
    eremoteLabsDto: EremoteLabsDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    try {
      const folderName = `${userId}/eRemoteLab`;
      const addDocument = await this.documentService.addDocuments(
        files,
        userId,
        folderName,
      );

      const eremoteLabData = await this.prisma.eremoteLab.create({
        data: {
          userId: userId,
          projectType: eremoteLabsDto.projectType,
          projectBudget: eremoteLabsDto.projectBudget,
          projectDescription: eremoteLabsDto.projectDescription,
          projectDocument: addDocument[0],
        },
      });
      return eremoteLabData;
    } catch (err) {
      return err;
    }
  }

  async getERemoteLabData(userId: string) {
    try {
      if (userId) {
        const data = await this.prisma.eremoteLab.findUnique({
          where: {
            userId: userId,
          },
        });
        return data;
      } else {
        const data = await this.prisma.eremoteLab.findMany();
        return data;
      }
    } catch (err) {
      return err;
    }
  }

  async getSearchTalentData(userId: string) {
    try {
      const clientVerification = await this.prisma.user.findUnique({
        where: {
          userId: userId,
          userRole: 'client',
        },
      });

      if (clientVerification.userRole == 'client') {
        const userData = await this.prisma.user.findMany({
          where: {
            userRole: 'developer',
          },
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            designation: true,
            hourlyRate: true,
            profilePicture: true,
            techStack: true,
          },
        });

        const monthlyPayments = userData.map((user) => {
          const hourlyRate = user.hourlyRate || 0;
          const workingHoursPerDay = 8;
          const workingDaysPerMonth = 22;
          const monthlyPayment =
            hourlyRate * workingHoursPerDay * workingDaysPerMonth;
          return {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            designation: user.designation,
            profilePicture: user.profilePicture,
            monthlyPayment: monthlyPayment,
            techStack: user.techStack,
          };
        });

        return monthlyPayments;
      }
    } catch (err) {
      return err;
    }
  }

  async filterSearchTalent(
    filterDto: FilterDTO,
    userId: string,
  ): Promise<any[]> {
    const whereClause = this.getQueryParameters(filterDto);

    if (filterDto.considerVettedSkill) {
      whereClause.vettingResults = { some: { userId: userId } };
    }

    const arrData = await this.prisma.user.findMany({
      where: whereClause,
    });

    const monthlyPayments = arrData.map((user) => {
      const hourlyRate = user.hourlyRate || 0;
      const workingHoursPerDay = 8;
      const workingDaysPerMonth = 22;
      const monthlyPayment =
        hourlyRate * workingHoursPerDay * workingDaysPerMonth;
      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        designation: user.designation,
        profilePicture: user.profilePicture,
        monthlyPayment: monthlyPayment,
        techStack: user.techStack,
      };
    });
    
    return monthlyPayments;
  }

  private getQueryParameters(filterDto: FilterDTO): Prisma.userWhereInput {
    const where: Prisma.userWhereInput = {};

    if (
      filterDto.technicalSkill !== undefined &&
      filterDto.technicalSkill.length > 0
    ) {
      where.techStack = {
        hasSome: filterDto.technicalSkill,
      };
    }

    if (filterDto.city !== undefined && filterDto.city !== '') {
      where.address = filterDto.city;
    }

    if (filterDto.country !== undefined && filterDto.country !== '') {
      where.country = filterDto.country;
    }

    if (filterDto.availability !== undefined) {
      where.currentStatus = filterDto.availability;
    }

    if (filterDto.pricePerHour !== undefined) {
      where.hourlyRate = filterDto.pricePerHour;
    }

    where.userRole = 'developer';

    return where;
  }
}
