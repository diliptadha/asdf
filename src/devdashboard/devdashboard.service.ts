import * as AWS from 'aws-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AddBenefitListDto } from './dto/addBenefitsList.dto';
import { AddClientMonthlyReviewDto } from './dto/addClientMonthlyReview.dto';
import { AddFAQDto } from './dto/addFaq.dto';
import { AddPaymentDto } from './dto/addPayment.dto';
import { AddRemotePointsDto } from './dto/addremotepoints.dto';
import { AddRequestForPointsDto } from './dto/addRequestPointsDto';
import { AddRequestedBenefitsDto } from './dto/addQuestion.dto';
import { AddVideoDto } from './dto/addVideo.dto';
import { AddWeeklyReportDto } from './dto/addWeeklyReport.dto';
import { Constants } from 'src/utils/constants';
import { PrismaService } from 'src/prisma.service';
import { ROOT_DIR } from 'rootDir';
import { Storage } from '@google-cloud/storage';
import { WeeklySummariesDto } from './dto/addWeeklySummaries.dto';
import { uploadFilesToGCS } from 'src/utils/functions';

@Injectable()
export class DevdashboardService {
  private readonly storage: Storage;
  private readonly bucketName: string
  constructor(private prisma: PrismaService) {
    const filePath = path.resolve(ROOT_DIR,"eremote-hire-website-cloud.json");
    const creds = fs.readJsonSync(filePath);
      this.storage = new Storage({
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEYFILENAME,
      });
      this.bucketName = process.env.CLOUD_BUCKET_NAME;
  }

  async addBenefits(
    files: Express.Multer.File[],
    addBenefitListDto: AddBenefitListDto,
  ) {
    try {
      const folderName = `${Constants.Documents}/${Constants.benefits}`;
      const documentsUrls = await uploadFilesToGCS(files, folderName, this.storage, this.bucketName)

      const Documents = await this.prisma.document.create({
        data: {
          document: documentsUrls,
        },
      });

      const BenefitsData = await this.prisma.benefitsList.create({
        data: {
          icon: Documents.document[0],
          title: addBenefitListDto.title,
          description: addBenefitListDto.description,
        },
      });
      const questionArr = [];
      try {
        const questionData = addBenefitListDto.benefitQuestion.map(
          async (question) => {
            const questionRecord = await this.prisma.benefitQuestion.create({
              data: {
                question: question.question,
                benefitsListId: BenefitsData.id,
              },
            });
            return questionRecord;
          },
        );
        await Promise.all(
          questionData.map(async (question) => {
            const record = await question;
            questionArr.push(record);
          }),
        );
        return { BenefitsData, questionArr };
      } catch (err) {
        return err;
      }
    } catch (err) {
      return err;
    }
  }

  async getBenefitsList() {
    try {
      const benefitList = await this.prisma.benefitsList.findMany({});
      return benefitList;
    } catch (err) {
      return err;
    }
  }

  async getBenefitsListQuestion(benefitId: string) {
    try {
      const benefitList = await this.prisma.benefitQuestion.findMany({
        where: {
          benefitsListId: benefitId,
        },
      });
      return benefitList;
    } catch (err) {
      return err;
    }
  }

  async deleteBenefits(benefitsId: string) {
    try {
      const deletedQuestionData = await this.prisma.benefitQuestion.deleteMany({
        where: {
          benefitsListId: benefitsId,
        },
      });
      const deletedData = await this.prisma.benefitsList.delete({
        where: {
          id: benefitsId,
        },
      });
      return {
        benefitData: deletedData,
        deletedQuestionData: deletedQuestionData,
      };
    } catch (err) {
      return err;
    }
  }

  async addBenefitsQAData(data: AddRequestedBenefitsDto[], userId: string) {
    try {
      const results = [];

      for (const entry of data) {
        const result = await this.prisma.requestedBenefits.create({
          data: {
            userId: userId,
            questionId: entry.questionId,
            answer: entry.answer,
            benefitsListId: entry.benefitsListId,
          },
        });
        results.push(result);
      }
      return results;
    } catch (err) {
      return err;
    }
  }

  async getBenefitsQAData(userId: string) {
    if (userId) {
      try {
        const benefitsQAData = await this.prisma.requestedBenefits.findMany({
          where: {
            userId: userId,
          },
        });

        const benefitsMap = new Map();

        for (const data of benefitsQAData) {
          const benefitData = await this.prisma.benefitsList.findUnique({
            where: {
              id: data.benefitsListId,
            },
          });

          if (!benefitsMap.has(benefitData.id)) {
            benefitsMap.set(benefitData.id, {
              id: benefitData.id,
              title: benefitData.title,
              data: [],
            });
          }

          benefitsMap.get(benefitData.id).data.push({
            id: data.id,
            userId: data.userId,
            questionId: data.questionId,
            answer: data.answer,
            benefitsListId: data.benefitsListId,
          });
        }

        const resultArray = Array.from(benefitsMap.values());

        return {
          arr: resultArray,
        };
      } catch (err) {
        return err;
      }
    }
  }

  async addRemotePoints(
    addRemotePointsDto: AddRemotePointsDto,
    userId: string,
  ) {
    try {
      const remotepoint = await this.prisma.remotepoints.findUnique({
        where: {
          userId: userId,
        },
      });
      if (remotepoint && remotepoint.points) {
        const updateRemotepointData = await this.prisma.remotepoints.update({
          where: {
            userId: userId,
          },
          data: {
            points: remotepoint.points + addRemotePointsDto.points,
            notes: addRemotePointsDto.notes,
          },
        });

        await this.prisma.remotePointsHistory.create({
          data: {
            userId: userId,
            points: addRemotePointsDto.points,
            date: new Date(addRemotePointsDto.date),
            pointsType: addRemotePointsDto.pointsType,
            notes: addRemotePointsDto.notes,
          },
        });
        return updateRemotepointData;
      } else {
        const remotePointsData = await this.prisma.remotepoints.create({
          data: {
            userId: userId,
            points: addRemotePointsDto.points,
            date: new Date(addRemotePointsDto.date),
            pointsType: addRemotePointsDto.pointsType,
            notes: addRemotePointsDto.notes,
          },
        });

        await this.prisma.remotePointsHistory.create({
          data: {
            userId: remotePointsData.userId,
            points: remotePointsData.points,
            date: new Date(remotePointsData.date),
            pointsType: remotePointsData.pointsType,
            notes: remotePointsData.notes,
          },
        });
        return remotePointsData;
      }
    } catch (err) {
      return err;
    }
  }

  async getRemotePointsHistory(userId: string) {
    const remotePointsData = await this.prisma.remotePointsHistory.findMany({
      where: {
        userId: userId,
      },
    });
    return remotePointsData;
  }

  async getTotalRemotePoints(userId: string) {
    try {
      // const totalMicroPointsData = await this.prisma.microPointsHistory.findMany({
      //   where:{
      //     userId: userId,
      //     pointsType: "credited",
      //   }
      // });
      // let sum = 0;
      // for(const data of totalMicroPointsData){
      //   sum = sum + data.points;
      // }
      const totalRemotePointsData = await this.prisma.remotepoints.findUnique({
        where: {
          userId: userId,
        },
      });
      return totalRemotePointsData.points;
    } catch (err) {
      return err;
    }
  }

  async redeemPoints(
    addRequestForPointsDto: AddRequestForPointsDto,
    userId: string,
  ) {
    try {
      const totalPointsData = await this.getTotalRemotePoints(userId);
      if (addRequestForPointsDto.points >= 1000) {
        if (addRequestForPointsDto.points <= totalPointsData) {
          const pointsData = await this.prisma.requestedRedeemPoints.create({
            data: {
              userId: userId,
              points: addRequestForPointsDto.points,
            },
          });
          return pointsData;
        } else {
          throw new HttpException(
            Constants.invalidPoints,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        if (addRequestForPointsDto.points <= totalPointsData) {
          const pointsData = await this.prisma.remotepoints.update({
            where: {
              userId: userId,
            },
            data: {
              points: totalPointsData - addRequestForPointsDto.points,
            },
          });

          await this.prisma.remotePointsHistory.create({
            data: {
              userId: userId,
              points: addRequestForPointsDto.points,
              pointsType: 'debited',
              date: new Date(),
            },
          });
          return pointsData;
        } else {
          throw new HttpException(
            Constants.invalidPoints,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch (err) {
      throw new HttpException(Constants.invalidPoints, HttpStatus.BAD_REQUEST);
    }
  }

  async getRequestForRedeemPoints(userId: string) {
    if (userId) {
      const redeemData = await this.prisma.requestedRedeemPoints.findUnique({
        where: {
          userId: userId,
        },
      });
      return redeemData;
    } else {
      const redeemData = await this.prisma.requestedRedeemPoints.findMany();
      return redeemData;
    }
  }

  async redeemPointsRequestApprove(userId: string) {
    try {
      const totalPointsData = await this.getTotalRemotePoints(userId);
      const pointsData = await this.prisma.requestedRedeemPoints.findUnique({
        where: {
          userId: userId,
        },
      });
      if (pointsData.points <= totalPointsData) {
        const pointData = await this.prisma.remotepoints.update({
          where: {
            userId: userId,
          },
          data: {
            points: totalPointsData - pointsData.points,
          },
        });
        await this.prisma.remotePointsHistory.create({
          data: {
            userId: userId,
            points: pointsData.points,
            pointsType: 'debited',
            date: new Date(),
          },
        });
        await this.prisma.requestedRedeemPoints.delete({
          where: {
            userId: userId,
          },
        });
        return pointData;
      } else {
        throw new HttpException(
          Constants.invalidPoints,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(Constants.invalidPoints, HttpStatus.BAD_REQUEST);
    }
  }

  async addFAQData(addFAQDto: AddFAQDto[]) {
    try {
      const result = [];
      for (const data of addFAQDto) {
        const faqData = await this.prisma.faq.create({
          data: {
            question: data.question,
            answer: data.answer,
            pageName: data.pageName,
          },
        });
        result.push(faqData);
      }
      return result;
    } catch (err) {
      return err;
    }
  }

  async getFAQData(pageName: string) {
    try {
      if (pageName) {
        const getFQAData = await this.prisma.faq.findMany({
          where: {
            pageName: pageName,
          },
        });
        return getFQAData;
      } else {
        throw new HttpException(
          Constants.pageNameNotFound,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (err) {
      return err;
    }
  }

  async getSuccessManagerData() {
    try {
      const managerData = await this.prisma.user.findMany({
        where: {
          userRole: 'successManager',
        },
      });
      return managerData;
    } catch (err) {
      return err;
    }
  }

  async assignSuccessManager(userId: string, managerUserId: string) {
    try {
      const assignManagerData = await this.prisma.user.updateMany({
        where: {
          userId: userId,
        },
        data: {
          managerID: managerUserId,
        },
      });

      return assignManagerData;
    } catch (err) {
      return err;
    }
  }

  async getDevelpoerManagerData(userId: string) {
    try {
      const userData = await this.prisma.user.findMany({
        where: {
          userId: userId,
        },
        select: {
          managerID: true,
        },
      });
      if (userData != null) {
        const managerData = await this.prisma.user.findUnique({
          where: {
            userId: userData[0].managerID,
          },
          select: {
            firstName: true,
            lastName: true,
            phoneNo: true,
            emailId: true,
            resume: true,
            profilePicture: true,
          },
        });
        return managerData;
      } else {
        throw new HttpException('Manager Not assign', HttpStatus.NOT_FOUND);
      }
    } catch (err) {
      return err;
    }
  }

  async addPayoutData(
    addPaymentDto: AddPaymentDto,
    files: Express.Multer.File[],
  ) {
    try {
      const userId = addPaymentDto.userId;
      const folderName = `${userId}/${Constants.paymentSlip}`;
      const documentsUrls = await uploadFilesToGCS(files, folderName, this.storage, this.bucketName);

      const Documents = await this.prisma.document.create({
        data: {
          document: documentsUrls,
        },
      });

      const addPaymentData = await this.prisma.payment.create({
        data: {
          userId: addPaymentDto.userId,
          amount: Number(addPaymentDto.amount),
          date: new Date(addPaymentDto.date),
          paymentSlip: Documents.document[0],
        },
      });
      return addPaymentData;
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

  async addWeeklyReportData(addWeeklyReportDto: AddWeeklyReportDto) {
    try {
      const weeklyreportData = await this.prisma.weeklyReport.create({
        data: {
          userId: addWeeklyReportDto.userId,
          startDate: new Date(addWeeklyReportDto.startDate),
          endDate: new Date(addWeeklyReportDto.endDate),
          workingHours: Number(addWeeklyReportDto.workingHours),
          summary: addWeeklyReportDto.summary,
        },
      });
      return weeklyreportData;
    } catch (err) {
      return err;
    }
  }

  async getWeeklyReportData(userId: string) {
    try {
      if (userId) {
        const weeklyreportData = await this.prisma.weeklyReport.findMany({
          where: {
            userId: userId,
          },
        });
        return weeklyreportData;
      } else {
        const weeklyreportData = await this.prisma.weeklyReport.findMany({});
        return weeklyreportData;
      }
    } catch (err) {
      return err;
    }
  }

  async AddClientMonthlyReviewData(
    addClientMonthlyReviewDto: AddClientMonthlyReviewDto,
  ) {
    try {
      const monthlyreportData = await this.prisma.clientMonthlyReview.create({
        data: {
          userId: addClientMonthlyReviewDto.userId,
          month: addClientMonthlyReviewDto.month,
          review: addClientMonthlyReviewDto.review,
        },
      });
      return monthlyreportData;
    } catch (err) {
      return err;
    }
  }

  async GetClientMonthlyReviewData(userId: string) {
    try {
      if (userId) {
        const monthlyreportData =
          await this.prisma.clientMonthlyReview.findMany({
            where: {
              userId: userId,
            },
          });
        return monthlyreportData;
      } else {
        const monthlyreportData =
          await this.prisma.clientMonthlyReview.findMany({});
        return monthlyreportData;
      }
    } catch (err) {
      return err;
    }
  }

  async addVideoData(addVideoDto: AddVideoDto) {
    const existingVideo = await this.prisma.videos.findFirst({
      where: { url: addVideoDto?.url },
    });

    if (existingVideo) {
      throw new Error(Constants.videoURLExists);
    }

    const addVideoData = await this.prisma.videos.create({
      data: { url: addVideoDto?.url },
    });
    return addVideoData;
  }

  async GetVideosData() {
    try {
      const vidoesData = await this.prisma.videos.findMany();
      return vidoesData;
    } catch (err) {
      return err;
    }
  }

  async DeleteVideoData(Id: string) {
    try {
      const deleteVideoData = await this.prisma.videos.delete({
        where: {
          id: Id,
        },
      });
      return deleteVideoData;
    } catch (err) {
      return err;
    }
  }

  async addWeeklySummariesData(
    addWeeklySummariesDto: WeeklySummariesDto,
    userId: string,
  ) {
    try {
      const weeklySummariesData = await this.prisma.weeklySummaries.create({
        data: {
          userId: userId,
          workingTime: addWeeklySummariesDto.workingTime,
          date: new Date(addWeeklySummariesDto.date),
        },
      });
      return weeklySummariesData;
    } catch (err) {
      return err;
    }
  }

  async getWeeklySummariesData(userId: string) {
    try {
      const weeklySummariesData = await this.prisma.weeklySummaries.findMany({
        where: {
          userId: userId,
        },
      });
      return weeklySummariesData;
    } catch (err) {
      return err;
    }
  }
}
