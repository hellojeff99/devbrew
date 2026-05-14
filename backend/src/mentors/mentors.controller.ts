import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MentorsService } from './mentors.service';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorService: MentorsService) {}

  @Get()
  getMentor() {
    return this.mentorService.findAllMentors();
  }

  @Get(':id')
  getMentorById(@Param('id', ParseIntPipe) id: number) {
    return this.mentorService.findMentorById(id);
  }
}
