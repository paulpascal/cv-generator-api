import { User } from 'src/user/entities/user.entity';
import { WorkingExperience } from 'src/working-experience/entities/working-experience.entity';

const We = new WorkingExperience();
We.id = 1;
We.title = 'Experience Title';
We.position = 'Work position';
We.startDate = 'May 2010';
We.endDate = 'May 2020';
We.isActual = false;
We.description = 'Lorem ipsum';
We.user = new User();
We.user.id = 1;

export { We as MockedWorkingExperience };
