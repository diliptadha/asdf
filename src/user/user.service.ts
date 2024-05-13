import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs-extra';
import * as path from 'path';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generatePassword, uploadFilesToGCS } from 'src/utils/functions';

import { Bucket } from '@google-cloud/storage';
import { Constants } from 'src/utils/constants';
import { DocumentService } from 'src/document/document.service';
import { GiveFeedbackDto } from './dto/addFeedback.dto';
import { JWT } from 'google-auth-library';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma.service';
import { ROOT_DIR } from 'rootDir';
import { Storage } from '@google-cloud/storage';
import { UpdateUserDto } from './dto/updateUser.dto';
import axios from 'axios';
import { error } from 'console';
import { sendMail } from 'src/utils/functions';

@Injectable()
export class UserService {
  private readonly storage: Storage;
  constructor(
    private prisma: PrismaService,
    private documentService: DocumentService,
    private readonly mailerService: MailerService,
  ) {
    const filePath = path.resolve(ROOT_DIR, 'eremote-hire-website-cloud.json');
    const creds = fs.readJsonSync(filePath);
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEYFILENAME,
    });

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
    });
  }

  bucketName = process.env.CLOUD_BUCKET_NAME;
  async updateUser(
    updateUserDto: UpdateUserDto,
    files: Express.Multer.File[],
    userId: string,
    vettingResultId?: string,
    educationId?: string,
    experienceId?: string,
  ) {
    try {
      if (userId) {
        const data = await this.prisma.user.findUnique({
          where: {
            userId: userId,
          },
        });
        const profilePictureFiles = files.filter((file) => {
          const fileName = file.originalname.toLowerCase();
          return (
            fileName.endsWith('.jpg') ||
            fileName.endsWith('.jpeg') ||
            fileName.endsWith('.png')
          );
        });

        const resumeFiles = files.filter((file) => {
          const fileName = file.originalname.toLowerCase();
          return fileName.endsWith('.pdf');
        });

        if (profilePictureFiles.length > 0) {
          const folderName = `images`;
          if (data.profilePicture) {
            const updateDocument = await this.documentService.updateDocuments(
              profilePictureFiles,
              userId,
              folderName,
              Constants.profilePicture,
            );
            await this.prisma.user.update({
              where: {
                userId: userId,
              },
              data: {
                profilePicture: updateDocument[0],
              },
            });
          } else {
            let bucketName = 'eremotehire';
            const documentsUrls = await uploadFilesToGCS(
              files,
              folderName,
              this.storage,
              bucketName,
            );
            const Documents = await this.prisma.document.create({
              data: {
                userId: userId,
                document: documentsUrls,
              },
            });

            await this.prisma.user.update({
              where: {
                userId: userId,
              },
              data: {
                profilePicture: Documents.document[0],
              },
            });
          }
        }
        if (resumeFiles.length > 0) {
          const folderName = `${userId}/${Constants.resume}`;
          const updateDocument = await this.documentService.updateDocuments(
            resumeFiles,
            userId,
            folderName,
            Constants.resume,
          );

          await this.prisma.user.update({
            where: {
              userId: userId,
            },
            data: {
              resume: updateDocument[0],
            },
          });
        }

        if (vettingResultId) {
          let vettingResultsArray = [];
          if (updateUserDto?.vettingResults) {
            vettingResultsArray = Array.isArray(updateUserDto.vettingResults)
              ? updateUserDto.vettingResults.map((item: any) =>
                  JSON.parse(item),
                )
              : [JSON.parse(updateUserDto.vettingResults)];
          }
          const vettingResultData = await this.prisma.vettingResults.update({
            where: {
              id: vettingResultId,
            },
            data: {
              skill: vettingResultsArray[0]?.skill,
              vettingResult: vettingResultsArray[0]?.vettingResult,
              yearOfExperience: vettingResultsArray[0]?.yearOfExperience
                ? parseInt(vettingResultsArray[0]?.yearOfExperience)
                : undefined,
            },
          });
          return vettingResultData;
        }

        if (educationId) {
          let educationDetailsArray = [];
          if (updateUserDto?.educationDetails) {
            educationDetailsArray = Array.isArray(
              updateUserDto.educationDetails,
            )
              ? updateUserDto.educationDetails.map((item: any) =>
                  JSON.parse(item),
                )
              : [JSON.parse(updateUserDto.educationDetails)];
          }
          const educationDetailsData =
            await this.prisma.educationDetails.update({
              where: {
                id: educationId,
              },
              data: {
                course: educationDetailsArray[0].course,
                university: educationDetailsArray[0]?.university,
                department: educationDetailsArray[0]?.department,
                startDate: educationDetailsArray[0]?.startDate
                  ? new Date(educationDetailsArray[0]?.startDate).toISOString()
                  : undefined,
                endDate: educationDetailsArray[0]?.endDate
                  ? new Date(educationDetailsArray[0]?.endDate).toISOString()
                  : undefined,
              },
            });
          return educationDetailsData;
        }
        if (experienceId) {
          let experienceDetailsArray = [];
          if (updateUserDto?.experienceDetails) {
            experienceDetailsArray = Array.isArray(
              updateUserDto.experienceDetails,
            )
              ? updateUserDto.experienceDetails.map((item: any) =>
                  JSON.parse(item),
                )
              : [JSON.parse(updateUserDto.experienceDetails)];
          }
          const experienceDetailsData =
            await this.prisma.experienceDetails.update({
              where: {
                id: experienceId,
              },
              data: {
                companyName: experienceDetailsArray[0]?.companyName,
                techStack: experienceDetailsArray[0]?.techStack
                  ? { set: experienceDetailsArray[0]?.techStack }
                  : undefined,
                responsibility: experienceDetailsArray[0]?.responsibility,
                designation: experienceDetailsArray[0]?.designation,
                startDate: experienceDetailsArray[0]?.startDate
                  ? new Date(experienceDetailsArray[0]?.startDate).toISOString()
                  : undefined,
                endDate: experienceDetailsArray[0]?.endDate
                  ? new Date(experienceDetailsArray[0]?.endDate).toISOString()
                  : undefined,
              },
            });
          return experienceDetailsData;
        }
      }
      try {
        let vettingResultsArray = [];
        if (updateUserDto?.vettingResults) {
          vettingResultsArray = Array.isArray(updateUserDto.vettingResults)
            ? updateUserDto.vettingResults.map((item: any) => JSON.parse(item))
            : [JSON.parse(updateUserDto.vettingResults)];
        }

        let educationDetailsArray = [];
        if (updateUserDto?.educationDetails) {
          educationDetailsArray = Array.isArray(updateUserDto.educationDetails)
            ? updateUserDto.educationDetails.map((item: any) =>
                JSON.parse(item),
              )
            : [JSON.parse(updateUserDto.educationDetails)];
        }

        let experienceDetailsArray = [];
        if (updateUserDto?.experienceDetails) {
          experienceDetailsArray = Array.isArray(
            updateUserDto.experienceDetails,
          )
            ? updateUserDto.experienceDetails.map((item: any) =>
                JSON.parse(item),
              )
            : [JSON.parse(updateUserDto.experienceDetails)];
        }

        const userData = await this.prisma.user.update({
          where: {
            userId: userId,
          },
          data: {
            firstName: updateUserDto?.firstName,
            lastName: updateUserDto?.lastName,
            age: Number(updateUserDto?.age),
            designation: updateUserDto?.designation,
            techStack: updateUserDto?.techStack,
            hourlyRate: Number(updateUserDto?.hourlyRate),
            country: updateUserDto?.country,
            address: updateUserDto?.address,
            yearOfExperience: Number(updateUserDto?.yearOfExperience),
            typeOfEngagement: updateUserDto?.typeOfEngagement,
            currentStatus: updateUserDto?.currentStatus,
            noticePeriod: updateUserDto?.noticePeriod,
            summary: updateUserDto.summary,
            userRole: updateUserDto?.userRole,
            managerID: updateUserDto?.managerID || null,
            technicalInterviewNotes: updateUserDto?.technicalInterviewNotes,
            softSkillAssessment: updateUserDto?.softSkillAssessment,
            verifiedAiTools: updateUserDto?.verifiedAiTools,
            vettingResults: {
              create: vettingResultsArray,
            },
            educationDetails: {
              create: educationDetailsArray.map((education) => ({
                ...education,
                startDate: new Date(education.startDate).toISOString(),
                endDate: new Date(education.endDate).toISOString(),
              })),
            },
            experienceDetails: {
              create: experienceDetailsArray.map((experience) => ({
                ...experience,
                startDate: new Date(experience.startDate).toISOString(),
                endDate: new Date(experience.endDate).toISOString(),
              })),
            },
            socialLinks: {
              update: {
                facebook: updateUserDto.socialLinks?.facebook,
                linkedIn: updateUserDto.socialLinks?.linkedIn,
                twitter: updateUserDto.socialLinks?.twitter,
              },
            },
          },
        });
        return userData;
      } catch (err) {
        return err;
      }
    } catch (err) {
      return err;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async getUserData(userId?: string) {
    if (userId) {
      const userData = await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });
      return userData;
    } else {
      const userData = await this.prisma.user.findMany();
      return userData;
    }
  }

  async deleteUserData(userId?: string) {
    if (userId) {
      const userData = await this.prisma.user.delete({
        where: {
          userId: userId,
        },
      });
      return userData;
    } else {
      const userData = await this.prisma.user.deleteMany();
      return userData;
    }
  }

  async forgotPassword(
    emailId: string,
    submittedOtp: string,
    password: string,
    confirmPassword: string,
  ) {
    const storedOtpWithExpiry = process.env.OTP;

    if (!storedOtpWithExpiry) {
      throw new Error(Constants.otpExpire);
    }

    const [storedOtp, expiryTimeString] = storedOtpWithExpiry.split(',');
    const time = new Date().getTime();
    const currentTime = new Date(time).toLocaleTimeString('en-US', {
      hour12: true,
    });
    const storedExpiryTime = expiryTimeString
      .replace('(Valid until ', '')
      .replace(')', '');

    const user = await this.prisma.user.findUnique({
      where: {
        emailId: emailId,
      },
    });
    if (storedOtp === submittedOtp) {
      if (currentTime <= storedExpiryTime) {
        if (password == user.password) {
          throw new error(Constants.samePassword);
        }
        if (password === confirmPassword) {
          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          const newHashedPassword = await bcrypt.hashSync(
            confirmPassword,
            salt,
          );
          const updatePassword = await this.prisma.user.update({
            where: { emailId: emailId },
            data: { password: newHashedPassword },
          });
          return updatePassword;
        } else {
          throw new Error(Constants.passswordNotMatch);
        }
      } else {
        throw new Error(Constants.otpExpire);
      }
    } else {
      throw new Error(Constants.otpInValid);
    }
  }

  async feedBackData(
    userId: string,
    files: Express.Multer.File[],
    giveFeedbackDto: GiveFeedbackDto,
  ) {
    const folderName = `${Constants.Documents}/${Constants.feedBack}`;
    const documentsUrls = await uploadFilesToGCS(
      files,
      folderName,
      this.storage,
      this.bucketName,
    );

    const Documents = await this.prisma.document.create({
      data: {
        userId: userId,
        document: documentsUrls,
      },
    });
    const feedBackData = await this.prisma.giveFeedback.create({
      data: {
        userId: userId,
        message: giveFeedbackDto.message,
        document: Documents.document[0],
      },
    });
    return feedBackData;
  }

  async sendOTPforForgotPassword(emailId: string) {
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    const message = `${otp},(Valid until ${expiryTime.toLocaleTimeString()})`;

    process.env.OTP = message;

    const otpMessage = message.split(',')[0];
    const checkEmailData = await this.prisma.user.findUnique({
      where: {
        emailId: emailId,
      },
    });
    const subject = Constants.forgotPassword;
    if (checkEmailData.emailId) {
      const sendmailData = await sendMail(
        emailId,
        this.mailerService,
        subject,
        otpMessage,
        'forgotpassword',
      );
      return sendmailData;
    } else {
      throw new HttpException(
        Constants.emailNotExist,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async addCertificate(emailId: string, files: Express.Multer.File[]) {
    let resumeUrl: any;
    let certificateUrl: any;
    try {
      const data = await this.prisma.applyAsEngineer.findUnique({
        where: {
          emailId: emailId,
        },
      });
      
      console.log(data, "data");
      const checkemail = await this.prisma.user.findUnique({
        where: {
          emailId: emailId,
        },
      });

      console.log(checkemail, "checkEmail");
      if (!checkemail) {
        if (data == null) {
          throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
        let userId = '';

        let seqNum;
        const prefix = 'RH_';
        const maxUser = await this.prisma.user.findFirst({
          where: { userId: { startsWith: prefix } },
          orderBy: { userId: 'desc' },
        });
        const password = generatePassword(12);
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await this.hashPassword(password, salt);
        if (!maxUser) {
          seqNum = 1;
        }
        if (maxUser) {
          const maxId = maxUser.userId;
          seqNum = parseInt(maxId.substr(prefix.length)) + 1;
        }

        const formattedSeqNum = seqNum.toString().padStart(7, '0');
        userId = `${prefix}${formattedSeqNum}`;
        console.log(userId, "userId");

        if (data.resume) {
          const resumeFileName = path.basename(data.resume);
          const resumeBuffer = await axios
            .get(data.resume, { responseType: 'arraybuffer' })
            .then((response) => Buffer.from(response.data));
          const folderName = `${userId}/${Constants.resume}`;
          resumeUrl = await this.uploadBufferToGCS(
            resumeBuffer,
            resumeFileName,
            folderName,
            this.storage,
            this.bucketName,
          );
        }
        console.log(resumeUrl, "resumeURL");

        const certificateFolderName = `${userId}/${Constants.certificate}`;
        const certificateUrls = await uploadFilesToGCS(
          files,
          certificateFolderName,
          this.storage,
          this.bucketName,
        );
        console.log(certificateUrls, "certificateuRLs");
        console.log(certificateUrls[0], "first");
        certificateUrl = certificateUrls[0];
        
        const Documents = await this.prisma.document.create({
          data: {
            userId: userId,
            document: certificateUrls,
          },
        });

        console.log(Documents,"document");
        
        const userData = await this.prisma.user.create({
          data: {
            userId: userId,
            firstName: data.name,
            emailId: data.emailId,
            phoneNo: data.phoneNo,
            password: hashedPassword,
            resume: resumeUrl,
            certificate: Documents.document[0],
            socialLinks: {
              create: {
                linkedIn: data.linkedinUrl,
              },
            },
          },
        });
        console.log(userData, "userData");
        if (data.emailId) {
          await sendMail(
            emailId,
            this.mailerService,
            'User Credential',
            password,
            'credentials',
          );
        } else {
          throw new HttpException(
            Constants.emailNotExist,
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        await this.prisma.applyAsEngineer.delete({
          where: {
            emailId: emailId,
          },
        });
        return userData;
      } else {
        throw new HttpException('User already exist', 401);
      }
    } catch (err) {
      return err;
    }
  }
  async uploadBufferToGCS(
    buffer: Buffer,
    filename: string,
    folderName: string,
    storage: Storage,
    bucketName: string,
  ): Promise<string> {
    const bucket = storage.bucket(bucketName);

    const file = bucket.file(`${folderName}/${filename}`);
    await file.save(buffer, {
      contentType: 'application/pdf', // Set the appropriate content type
      resumable: false, // Ensure resumable uploads are disabled for small files
    });

    // Generate a signed URL for the file
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return url;
  }

  async getCertificateData(userId: string) {
    try {
      if (userId) {
        const certificateData = await this.prisma.user.findUnique({
          where: {
            userId: userId,
          },
          select: {
            certificate: true,
          },
        });
        return certificateData;
      } else {
        const certificateData = await this.prisma.user.findMany({
          select: {
            certificate: true,
          },
        });
        return certificateData;
      }
    } catch (err) {
      return err;
    }
  }

  async developerAssignToClient(userId: string, user_Id: string) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });
      if (userData.userRole == 'client') {
        const assignData = await this.prisma.user.update({
          where: {
            userId: user_Id,
            userRole: 'developer',
          },
          data: {
            client: userId,
            hiredDate: new Date(),
          },
        });
        return assignData;
      } else {
        throw new HttpException(
          'not assign client because user is already client',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      console.error(err, 'error');
      throw new HttpException(
        'Acoount is already client account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
