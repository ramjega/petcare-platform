package pet.care.core.repo;

import lombok.extern.log4j.Log4j2;
import org.joda.time.LocalDate;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.*;
import pet.care.core.domain.type.Gender;
import pet.care.core.domain.type.PetType;
import pet.care.core.domain.type.ScheduleStatusValue;
import pet.care.core.domain.type.Speciality;
import pet.care.core.repo.jpa.CityRepo;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.factory.CityFactory;
import pet.care.core.service.factory.OrganizationFactory;
import pet.care.core.service.factory.ProfileFactory;
import pet.care.core.service.module.PetService;
import pet.care.core.service.module.ScheduleService;
import pet.care.core.service.util.DateTimeFormats;
import pet.care.core.service.util.TimeUtils;

import javax.annotation.PostConstruct;

@Service
@Log4j2
public class DataManagementService {
    private final CityRepo cityRepo;
    private final ScheduleService scheduleService;
    private final PetService petService;

    private final ProfileFactory profileFactory;
    private final CityFactory cityFactory;
    private final OrganizationFactory organizationFactory;

    public DataManagementService(ApplicationContext ctx) {
        this.cityRepo = ctx.getBean(CityRepo.class);
        this.scheduleService = ctx.getBean(ScheduleService.class);
        this.petService = ctx.getBean(PetService.class);

        this.profileFactory = ctx.getBean(ProfileFactory.class);
        this.cityFactory = ctx.getBean(CityFactory.class);
        this.organizationFactory = ctx.getBean(OrganizationFactory.class);
    }

    @PostConstruct
    public void execute() {

        // create initial data

        SecurityHolder.setProfile(Profile.SYSTEM);

        if (cityRepo.count() == 0) {
            // assuming database is empty
            City jaffna = cityFactory.createCity("Jaffna").unwrap();
            Organization jaffnaVetHospital = organizationFactory.createOrganization("Jaffna Vet Hospital", jaffna).unwrap();

            City kilinochi = cityFactory.createCity("Kilinochi").unwrap();
            Organization kilinochiTrainingCentre = organizationFactory.createOrganization("Kilinochi Training Centre", kilinochi).unwrap();

            City colombo = cityFactory.createCity("Colombo").unwrap();
            Organization colomboGroomingCentre = organizationFactory.createOrganization("Colombo Grooming Centre", colombo).unwrap();

            City kandy = cityFactory.createCity("Kandy").unwrap();
            organizationFactory.createOrganization("Kandy Vet Hospital", kandy);

            // Creating users
            profileFactory.createAdmin("Gowri", "0776914220", "Test@123").unwrap();
            Profile ram = profileFactory.createPetOwner("Ram", "0775228994", "Test@123").unwrap();
            profileFactory.createCommunity("Community", "0777970070", "Test@123").unwrap();

            // Creating professionals
            Profile sriram = profileFactory.createProfessional("Sriram", "0775228995", "Test@123", Speciality.Veterinary).unwrap();
            Profile jenuthan = profileFactory.createProfessional("Jenuthan", "0778667986", "Test@123", Speciality.Training).unwrap();
            Profile theepan = profileFactory.createProfessional("Theepan", "0776621792", "Test@123", Speciality.Grooming).unwrap();

//             Creating schedules
            Schedule schedule1 = new Schedule();
            schedule1.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalToday()) + ";FREQ=WEEKLY;BYDAY=MO,TU,WE,FR,SU;INTERVAL=1");
            schedule1.setMaxAllowed(10L);
            schedule1.setStatus(ScheduleStatusValue.active);
            schedule1.setProfessional(sriram);
            schedule1.setOrganization(jaffnaVetHospital);
            scheduleService.create(schedule1).unwrap();

            Schedule schedule2 = new Schedule();
            schedule2.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalToday()) + ";FREQ=WEEKLY;BYDAY=MO,TU,WE,FR,SU;INTERVAL=1");
            schedule2.setMaxAllowed(20L);
            schedule2.setStatus(ScheduleStatusValue.active);
            schedule2.setProfessional(jenuthan);
            schedule2.setOrganization(kilinochiTrainingCentre);
            scheduleService.create(schedule2).unwrap();

            Schedule schedule3 = new Schedule();
            schedule3.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalToday()) + ";FREQ=WEEKLY;BYDAY=MO,TU,WE,FR,SU;INTERVAL=1");
            schedule3.setMaxAllowed(15L);
            schedule3.setStatus(ScheduleStatusValue.active);
            schedule3.setProfessional(theepan);
            schedule3.setOrganization(colomboGroomingCentre);
            scheduleService.create(schedule3).unwrap();

            // Creating pets
            Pet pet1 = new Pet();
            pet1.setName("Buddy");
            pet1.setType(PetType.Dog);
            pet1.setBreed("Golden Retriever");
            pet1.setBirthDate(LocalDate.parse("2020-05-10"));
            pet1.setGender(Gender.Male);
            pet1.setColor("Golden");
            pet1.setOwner(ram);
            petService.create(pet1).unwrap();

            Pet pet2 = new Pet();
            pet2.setName("Mittens");
            pet2.setType(PetType.Cat);
            pet2.setBreed("Siamese");
            pet2.setBirthDate(LocalDate.parse("2019-07-15"));
            pet2.setGender(Gender.Female);
            pet2.setColor("White");
            pet2.setOwner(ram);
            petService.create(pet2).unwrap();

            Pet pet3 = new Pet();
            pet3.setName("Labby");
            pet3.setType(PetType.Dog);
            pet3.setBreed("Labrador");
            pet3.setBirthDate(LocalDate.parse("2018-05-10"));
            pet3.setGender(Gender.Male);
            pet3.setColor("Golden");
            pet3.setOwner(ram);
            petService.create(pet3).unwrap();
        }

    }
}
