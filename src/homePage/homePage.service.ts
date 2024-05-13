import * as AWS from 'aws-sdk';
import * as fs from 'fs-extra';
import * as path from 'path';

import { AddTrustedByDto } from './dto/addtrustedbylogo.dto';
import { ClientReviewDto } from './dto/clientReview.dto';
import { CommunityDto } from './dto/community.dto';
import { Constants } from 'src/utils/constants';
import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { PrismaService } from 'src/prisma.service';
import { ROOT_DIR } from 'rootDir';
import { Storage } from '@google-cloud/storage';
import { SuccessStoryDto } from './dto/successstory.dto';
import { UpdateTrustedByDto } from './dto/updatetrustedlogo.dto';
import { uploadFilesToGCS } from 'src/utils/functions';

@Injectable()
export class HomePageService {
  private readonly storage: Storage;
  constructor(private prisma: PrismaService) {
    const filePath = path.resolve(ROOT_DIR,"eremote-hire-website-cloud.json");
    const creds = fs.readJsonSync(filePath);
      this.storage = new Storage({
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEYFILENAME,
      });
      const bucketName = process.env.CLOUD_BUCKET_NAME;
  }

  bucketName = process.env.CLOUD_BUCKET_NAME;
  async addClientReview(userId: string, clientReviewDto: ClientReviewDto) {
    const clientData = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if ((clientData.userRole = 'client')) {
      const clientReviewData = await this.prisma.clientReview.create({
        data: {
          userId: userId,
          fullName: clientData.firstName + ' ' + clientData.lastName,
          message: clientReviewDto.message,
          position: clientData.designation,
          profile: clientData.profilePicture,
        },
      });
      return clientReviewData;
    } else {
      console.error('Not permitted');
    }
  }

  async getClientReview() {
    const clientReviewData = await this.prisma.clientReview.findMany({});
    return clientReviewData;
  }

  async getAvailableHireDeveloper() {
    try {
      const developerData = await this.prisma.user.findMany({
        where: {
          currentStatus: 'openToWork',
          userRole: 'developer',
        },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          userRole: true,
          designation: true,
          country: true,
          summary: true,
          profilePicture: true,
          hourlyRate: true,
        },
      });

      const developerdata = await this.prisma.user.findMany({
        where: {
          currentStatus: 'engage',
          userRole: 'developer',
        },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          userRole: true,
          designation: true,
          country: true,
          summary: true,
          profilePicture: true,
          hourlyRate: true,
        },
        take: 4,
      });
      return { openToWork: developerData, engage: developerdata };
    } catch (err) {
      return err;
    }
  }

  async getTeamDetailsData() {
    const founderDetailsData = await this.prisma.user.findMany({
      where: {
        userRole: 'admin',
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        userRole: true,
        profilePicture: true,
        designation: true,
        socialLinks: true,
      },
    });
    const teamDetailsData = await this.prisma.user.findMany({
      where: {
        userRole: 'developer',
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        userRole: true,
        profilePicture: true,
        designation: true,
        socialLinks: true,
      },
    });
    return { Founders: founderDetailsData, teamMembers: teamDetailsData };
  }

  async addCommunityDetails(userId: string, communityDto: CommunityDto) {
    // const folderName = `${Constants.Documents}/${Constants.communityProfile}`;
    // const documentsUrls = await uploadDocument(files, folderName, this.s3);

    // const Documents = await this.prisma.document.create({
    //   data: {
    //     userId: userId,
    //     document: documentsUrls,
    //   },
    // });
    const userData = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    const communityDetailsData = await this.prisma.community.create({
      data: {
        userId: userId,
        fullName: userData.firstName + ' ' + userData.lastName,
        position: userData.designation,
        description: communityDto.description,
        profilePicture: userData.profilePicture,
      },
    });
    return communityDetailsData;
  }

  async getCommunityDetailsData() {
    const communityDetails = await this.prisma.community.findMany();
    return communityDetails;
  }

  async addSuccessStoryDetails(
    userId: string,
    successStoryDto: SuccessStoryDto,
  ) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });

      const SuccessStoryData = await this.prisma.successStory.create({
        data: {
          userId: userId,
          firstName: userData.firstName,
          lastName: userData.lastName !== undefined ? userData.lastName : null,
          designation: userData.designation,
          profilePicture: userData.profilePicture,
          successStory: successStoryDto.successStory,
        },
      });
      return SuccessStoryData;
    } catch (err) {
      return err;
    }
  }

  async getSuccessStoryData() {
    try {
      const successStoryData = await this.prisma.successStory.findMany();
      return successStoryData;
    } catch (err) {
      return err;
    }
  }

  async addUpdateTrustedByLogo(
    addTrustedByDto: AddTrustedByDto,
    files: Express.Multer.File[],
    updateTrustedByDto: UpdateTrustedByDto,
    id?: string,
  ) {
    if (id) {
      const isVisibleValue =
        updateTrustedByDto.isVisible.toLowerCase() === 'true';
      const updatedData = await this.prisma.trustedBy.update({
        where: {
          id: id,
        },
        data: {
          isVisible: isVisibleValue,
        },
      });
      return updatedData;
    }
    const folderName = `${Constants.trustedBy}`;
    const documentsUrls = await uploadFilesToGCS(files, folderName, this.storage, this.bucketName);

    const Documents = await this.prisma.document.create({
      data: {
        document: documentsUrls,
      },
    });
    const isVisibleValue = addTrustedByDto.isVisible.toLowerCase() === 'true';
    const logoData = await this.prisma.trustedBy.create({
      data: {
        logo: Documents.document[0],
        isVisible: isVisibleValue,
      },
    });
    return logoData;
  }

  async getTrustedByLogoData() {
    const logoData = await this.prisma.trustedBy.findMany({
      where: {
        isVisible: true,
      },
    });
    return logoData;
  }
}
