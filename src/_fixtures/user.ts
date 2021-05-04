import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { MockedWorkingExperience } from './workingExperience';

const userProfile = new Profile();
userProfile.name = 'John Smith';
userProfile.workTitle = 'workTitle';
userProfile.id = 1;

const emptyUser: User = new User();
emptyUser.email = 'test@example.com';
emptyUser.userId = '123456';
emptyUser.id = 1;

const userWithProfile: User = new User();
userWithProfile.profile = new Profile();
userWithProfile.profile.name = 'John Smith';
userWithProfile.profile.id = 1;
userWithProfile.id = 1;

const userWithWe = new User();
userWithWe.id = 1;
userWithWe.workingExperiences = [
  MockedWorkingExperience,
  MockedWorkingExperience,
];

const completeUser: User = new User();
completeUser.profile = userProfile;
completeUser.profile.id = 1;
completeUser.id = 1;
completeUser.workingExperiences = [];
completeUser.educations = [];
completeUser.skillsets = [];

export { emptyUser, userWithProfile, completeUser, userWithWe };
