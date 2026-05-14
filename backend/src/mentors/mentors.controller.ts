import { Controller, Get } from '@nestjs/common';
import { MentorsService } from './mentors.service';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorService: MentorsService) {}

  @Get()
  getMentor() {
    return this.mentorService.findAllMentors();
  }
}
