import { Constants, endpoints } from 'src/utils/constants';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (
      req.originalUrl.startsWith(endpoints.user + endpoints.login) ||
      req.originalUrl.startsWith(endpoints.user + endpoints.forgotPassword) ||
      req.originalUrl.startsWith(
        endpoints.applyAsEngineer + endpoints.addData,
      ) ||
      req.originalUrl.startsWith(
        endpoints.hiretopengineer + endpoints.addHireData,
      ) ||
      req.originalUrl.startsWith(
        endpoints.home + endpoints.addCommunityDetails,
      ) ||
      req.originalUrl.startsWith(
        endpoints.home + endpoints.getSuccessStoryDetails,
      ) ||
      req.originalUrl.startsWith(
        endpoints.home + endpoints.getCommunityDetails,
      ) ||
      req.originalUrl.startsWith(
        endpoints.home + endpoints.getTrustedByLogoData,
      ) ||
      req.originalUrl.startsWith(
        endpoints.user + endpoints.sendOTPforForgotPassword,
      ) ||
      req.originalUrl.startsWith(endpoints.user + endpoints.addCertificate) ||
      req.originalUrl.startsWith(endpoints.home + endpoints.getClientReview) ||
      req.originalUrl.startsWith(
        endpoints.home + endpoints.getAvailableHireDeveloper,
      ) ||
      req.originalUrl.startsWith(endpoints.home + endpoints.getTeamDetails) ||
      req.originalUrl.startsWith(
        endpoints.devdashboard + endpoints.getBenefitsList,
      ) ||
      req.originalUrl.startsWith(
        endpoints.devdashboard + endpoints.getFAQData,
      ) ||
      req.originalUrl.startsWith(
        endpoints.devdashboard + endpoints.getBenefitsListQuestion,
      )
    ) {
      next();
      return;
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = this.jwtService.verify(token);
        req.user = decoded;
        next();
      } catch (err) {
        res.status(401).send(Constants.error);
      }
    } else {
      res.status(401).send(Constants.error);
    }
  }
}
