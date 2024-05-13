import { Constants, PayloadType } from './constants';

import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma.service';

// export const uploadFilesToS3 = async (
//   files: Express.Multer.File[],
//   folderName: string,
//   s3: AWS.S3,
// ) => {
//   const photosUrls = [];

//   for (const file of files) {
//     const isAllowed = isAllowedFileType(file);
//     if (isAllowed) {
//       const s3params = {
//         Bucket: Constants.bucketName,
//         Key: `${folderName}/${file.originalname}`,
//         Body: file.buffer,
//         ContentType: `${file.mimetype}`,
//       };
//       const s3upload = await s3.upload(s3params).promise();
//       photosUrls.push(s3upload.Location);
//     } else {
//       console.error(`File type not allowed: ${file.originalname}`);
//     }
//   }
//   return photosUrls;
// };

// export const deleteImage = async (
//   s3: AWS.S3,
//   model: string,
//   prisma: PrismaService,
//   id: string,
//   folderName: string,
//   field: string,
// ) => {
//   try {
//
//     const currentDoc = await prisma[model].findUnique({
//       where: { id },
//       select: { [field]: true },
//     });
//
//     if (currentDoc && currentDoc.document && currentDoc.document.length > 0) {
//
//       const currentImageKey = currentDoc.document[0].split('/').pop();
//
//       try {
//         const deleted = await s3
//           .deleteObject({
//             Bucket: Constants.bucketName,
//             Key: `${folderName}/${currentImageKey}`,
//           })
//           .promise();
//
//         return deleted;
//       } catch (err) {
//
//         return err;
//       }
//     }
//   } catch (err) {
//     err;
//   }
// };

// export const deleteDocuments = async (
//   s3: AWS.S3,
//   model: string,
//   prisma: PrismaService,
//   userId: string,
//   folderName: string,
//   field: string,
// ) => {
//   try {
//     const currentDoc = await prisma[model].findUnique({
//       where: { userId },
//       select: { [field]: true },
//     });
//     const str = Object.keys(currentDoc);
//     if (currentDoc && currentDoc[str] && currentDoc[str].length > 0) {
//       const currentImageKey = currentDoc[str].split('/').pop();
//       try {
//         const deleted = await s3
//           .deleteObject({
//             Bucket: Constants.bucketName,
//             Key: `${folderName}/${currentImageKey}`,
//           })
//           .promise();
//         if (Object.keys(deleted).length === 0) {
//           throw new Error(
//             "Error: The 'deletedImage' object is empty. Please provide valid data.",
//           );
//         }
//         return deleted;
//       } catch (err) {
//         return err;
//       }
//     }
//   } catch (err) {
//     err;
//   }
// };

export const findOne = async (
  prisma: PrismaService,
  model: string,
  name: string,
  field_value: string,
) => {
  const loginData = await prisma[model].findFirst({
    where: {
      [name]: field_value,
    },
  });

  if (loginData == null) {
    return null;
  }
  return loginData;
};

export const decodeJwtToken = (authHeader: string, jwtService: JwtService) => {
  const decodedJwt = jwtService.decode(authHeader) as PayloadType;
  return decodedJwt?.userId;
};

export const extractTokenFromHeader = (authHeader: string): string => {
  const token = authHeader.replace('Bearer ', '');
  return token;
};

function isAllowedFileType(file: Express.Multer.File) {
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'image/jpeg',
    'image/png',
  ];

  return allowedFileTypes.includes(file.mimetype);
}

// export const uploadDocument = async (
//   files: Express.Multer.File[],
//   folderName: string,
//   s3: AWS.S3,
// ) => {
//   const photosUrls = [];

//   for (const file of files) {
//     const s3params = {
//       Bucket: Constants.bucketName,
//       Key: `${folderName}/${file.originalname}`,
//       Body: file.buffer,
//       ContentType: `${file.mimetype}`,
//     };
//     const s3upload = await s3.upload(s3params).promise();
//     photosUrls.push(s3upload.Location);
//   }
//   return photosUrls;
// };

export const generatePassword = (length: number) => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

export const sendMail = (
  emailId: string,
  mailerService: MailerService,
  subject: string,
  txt: string,
  template: string,
) => {
  try {
    const sendMail = mailerService.sendMail({
      from: 'info.eremotehire@gmail.com',
      to: emailId,
      subject: `${subject}`,
      template: template,
      context: {
        code: txt,
      },
    });
    return sendMail;
  } catch (error) {
    return error;
  }
};


export const uploadFilesToGCS = async(files: Express.Multer.File[], folderName: string, storage: any, bucketName: string) =>  {
  const bucket = storage.bucket(bucketName);
  const documentsUrls = [];

  await Promise.all(
    files.map(async (file) => {
      const destination = folderName ? `${folderName}/${file.originalname}` : file.originalname;
      const fileUpload = bucket.file(destination);
      await fileUpload.save(file.buffer);
      const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-2491' }); 
      documentsUrls.push(url);
    })
  );

  return documentsUrls;
}

export const deleteFilesFromGCS = async (files: Express.Multer.File[], folderName: string, storage: any, bucketName: string) => {
  const bucket = storage.bucket(bucketName);

  await Promise.all(
    files.map(async (file) => {
      const fileName = folderName ? `${folderName}/${file.originalname}` : file.originalname;
      const gcsFile = bucket.file(fileName);
      await gcsFile.delete();
    })
  );

  return "Files deleted successfully";
};


export function validateUrl(value:any) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

