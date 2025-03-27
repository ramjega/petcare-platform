package pet.care.core.repo;

import lombok.extern.log4j.Log4j2;
import org.joda.time.LocalDate;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import pet.care.core.domain.entity.*;
import pet.care.core.domain.type.*;
import pet.care.core.repo.jpa.CityRepo;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.factory.CityFactory;
import pet.care.core.service.factory.OrganizationFactory;
import pet.care.core.service.factory.ProfileFactory;
import pet.care.core.service.module.MedicinalProductService;
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
    private final MedicinalProductService productService;
    private final PetService petService;

    private final ProfileFactory profileFactory;
    private final CityFactory cityFactory;
    private final OrganizationFactory organizationFactory;

    public DataManagementService(ApplicationContext ctx) {
        this.cityRepo = ctx.getBean(CityRepo.class);
        this.scheduleService = ctx.getBean(ScheduleService.class);
        this.productService = ctx.getBean(MedicinalProductService.class);
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

            // Creating Users
            profileFactory.createAdmin("Gowri", "0776914220", "Test@123", "gowri@gmail.com", "https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/profiles%2FWhatsApp%20Image%202025-03-25%20at%203.13.29%20PM.jpeg?alt=media&token=ae236151-e088-4aa8-906f-fa182e7ed0da").unwrap();
            Profile ram = profileFactory.createPetOwner("Ram", "0775228994", "Test@123", "sriram@gmail.com", "https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/profiles%2F2x2%20USA%20Visa.jpg?alt=media&token=c7e1f55a-b23e-4d0f-a0a7-e80dd691c11d").unwrap();
            profileFactory.createCommunity("Jegatheesan", "0779010066", "Test@123", "jegan@gmail.com", "https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/profiles%2FWhatsApp%20Image%202025-03-25%20at%203.14.22%20PM.jpeg?alt=media&token=fef500fe-85e4-405d-ab2c-700d11ed0cc5").unwrap();

            // Creating Professionals
            Profile sriram = profileFactory.createProfessional("Sriram", "0775228995", "Test@123", Speciality.Veterinary, "sriram@aroyga.life", "https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/profiles%2F20231015_101852.jpg?alt=media&token=e12fa936-53e4-437b-a1e9-870c395408d1").unwrap();
            Profile mario = profileFactory.createProfessional("Jenuthan", "0778667986", "Test@123", Speciality.Training, "mario@arogya.life", "https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/profiles%2FWhatsApp%20Image%202025-03-25%20at%203.15.06%20PM.jpeg?alt=media&token=a84e970b-dc10-4e9e-941c-452e981b6c8a").unwrap();
            Profile hamzath = profileFactory.createProfessional("Theepan", "0776621792", "Test@123", Speciality.Grooming, "hamzath@arogya.life", "https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/profiles%2FWhatsApp%20Image%202025-03-25%20at%203.15.58%20PM.jpeg?alt=media&token=3ff853e0-36da-49a8-8f57-1e03ad140686").unwrap();

//             Creating initial Schedules
            Schedule schedule1 = new Schedule();
            schedule1.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalTodayPlusHours(6)) + ";FREQ=WEEKLY;BYDAY=MO,WE,FR,SU;INTERVAL=1");
            schedule1.setMaxAllowed(10L);
            schedule1.setStatus(ScheduleStatusValue.active);
            schedule1.setProfessional(sriram);
            schedule1.setOrganization(jaffnaVetHospital);
            scheduleService.create(schedule1).unwrap();

            Schedule schedule11 = new Schedule();
            schedule11.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalTodayPlusHours(10)) + ";FREQ=WEEKLY;BYDAY=TU,TH,SA;INTERVAL=1");
            schedule11.setMaxAllowed(10L);
            schedule11.setStatus(ScheduleStatusValue.active);
            schedule11.setProfessional(sriram);
            schedule11.setOrganization(jaffnaVetHospital);
            scheduleService.create(schedule11).unwrap();

            Schedule schedule12 = new Schedule();
            schedule12.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalTodayPlusHours(14)) + ";FREQ=WEEKLY;BYDAY=MO,WE,FR,SU;INTERVAL=1");
            schedule12.setMaxAllowed(10L);
            schedule12.setStatus(ScheduleStatusValue.active);
            schedule12.setProfessional(sriram);
            schedule12.setOrganization(jaffnaVetHospital);
            scheduleService.create(schedule12).unwrap();

            Schedule schedule13 = new Schedule();
            schedule13.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalTodayPlusHours(18)) + ";FREQ=WEEKLY;BYDAY=TU,TH,SA;INTERVAL=1");
            schedule13.setMaxAllowed(10L);
            schedule13.setStatus(ScheduleStatusValue.active);
            schedule13.setProfessional(sriram);
            schedule13.setOrganization(jaffnaVetHospital);
            scheduleService.create(schedule13).unwrap();

            Schedule schedule2 = new Schedule();
            schedule2.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalTodayPlusHours(10)) + ";FREQ=WEEKLY;BYDAY=MO,TU,WE,FR,SU;INTERVAL=1");
            schedule2.setMaxAllowed(20L);
            schedule2.setStatus(ScheduleStatusValue.active);
            schedule2.setProfessional(mario);
            schedule2.setOrganization(kilinochiTrainingCentre);
            scheduleService.create(schedule2).unwrap();

            Schedule schedule3 = new Schedule();
            schedule3.setRecurringRule("DTSTART=" + DateTimeFormats.convertUtcLongToUtcString(TimeUtils.startTimeOfLocalTodayPlusHours(8)) + ";FREQ=WEEKLY;BYDAY=MO,TU,WE,FR,SU;INTERVAL=1");
            schedule3.setMaxAllowed(15L);
            schedule3.setStatus(ScheduleStatusValue.active);
            schedule3.setProfessional(hamzath);
            schedule3.setOrganization(colomboGroomingCentre);
            scheduleService.create(schedule3).unwrap();

            // Creating initial Pets
            Pet pet1 = new Pet();
            pet1.setName("Buddy");
            pet1.setType(PetType.Dog);
            pet1.setBreed("Golden Retriever");
            pet1.setBirthDate(LocalDate.parse("2020-05-10"));
            pet1.setGender(Gender.Male);
            pet1.setColor("Golden");
            pet1.setOwner(ram);
            pet1.setImageUrl("https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/pets%2F88ff5600-d979-11ef-a5c8-1da73bd59591.jpg?alt=media&token=f24cec07-66aa-4a57-9f59-5db24b23b59b");
            petService.create(pet1).unwrap();

            Pet pet2 = new Pet();
            pet2.setName("Mittens");
            pet2.setType(PetType.Cat);
            pet2.setBreed("Siamese");
            pet2.setBirthDate(LocalDate.parse("2019-07-15"));
            pet2.setGender(Gender.Female);
            pet2.setColor("White");
            pet2.setOwner(ram);
            pet2.setImageUrl("https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/pets%2Fimages.jpeg?alt=media&token=a8594ec7-baea-48ad-a646-2dc50609b860");
            petService.create(pet2).unwrap();

            Pet pet3 = new Pet();
            pet3.setName("Labby");
            pet3.setType(PetType.Dog);
            pet3.setBreed("Labrador");
            pet3.setBirthDate(LocalDate.parse("2018-05-10"));
            pet3.setGender(Gender.Male);
            pet3.setColor("Golden");
            pet3.setOwner(ram);
            pet3.setImageUrl("https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/pets%2Fgolden-retriever-dog-breed-info.jpeg?alt=media&token=ec3653bf-ab4d-4d4c-8f75-fd3c53f96041");
            petService.create(pet3).unwrap();

            Pet pet4 = new Pet();
            pet4.setName("Pluto");
            pet4.setType(PetType.Dog);
            pet4.setBreed("German Shepherd");
            pet4.setBirthDate(LocalDate.parse("2018-05-10"));
            pet4.setGender(Gender.Male);
            pet4.setColor("Golden Black");
            pet4.setOwner(ram);
            pet4.setImageUrl("https://firebasestorage.googleapis.com/v0/b/petcare-cf68c.firebasestorage.app/o/pets%2F911P5ZgJmLL._AC_UF894%2C1000_QL80_.jpg?alt=media&token=8fa859d7-1dd5-4270-b046-f7e55692928d");
            petService.create(pet4).unwrap();


            // Creating initial Medicinal Products
            MedicinalProduct product1 = new MedicinalProduct();
            product1.setBrandName("PetCare Pharma");
            product1.setMedicineName("Amoxicillin 250mg");
            product1.setType(MedicationType.tablet);
            productService.create(product1).unwrap();

            MedicinalProduct product2 = new MedicinalProduct();
            product2.setBrandName("VetStrong");
            product2.setMedicineName("Ivermectin Injection");
            product2.setType(MedicationType.injection);
            productService.create(product2).unwrap();

            MedicinalProduct product3 = new MedicinalProduct();
            product3.setBrandName("MediPet");
            product3.setMedicineName("Rabies Vaccine");
            product3.setType(MedicationType.injection);
            productService.create(product3).unwrap();

            MedicinalProduct product4 = new MedicinalProduct();
            product4.setBrandName("AquaVet");
            product4.setMedicineName("Electrolyte Saline");
            product4.setType(MedicationType.saline);
            productService.create(product4).unwrap();
        }

    }
}
