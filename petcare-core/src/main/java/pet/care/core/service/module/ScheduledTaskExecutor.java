package pet.care.core.service.module;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import pet.care.core.domain.entity.Profile;
import pet.care.core.domain.entity.ScheduledTask;
import pet.care.core.domain.entity.ScheduledTaskOutput;
import pet.care.core.domain.type.SchedulePhase;
import pet.care.core.domain.type.ScheduleStatus;
import pet.care.core.repo.jpa.ScheduledTaskRepo;
import pet.care.core.service.endpoint.auth.SecurityHolder;
import pet.care.core.service.util.TimeUtils;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ScheduledTaskExecutor {

    private static final Logger logger = LoggerFactory.getLogger("scheduler");
    private static final Logger scheduleLogger = LoggerFactory.getLogger(ScheduledTaskExecutor.class);

    private static final AtomicInteger threadCounter = new AtomicInteger(0);

    private final ScheduledTaskRepo taskRepo;
    private final ApplicationContext appCtx;
    private volatile boolean running = false;

    public ScheduledTaskExecutor(ApplicationContext ctx) {
        this.appCtx = ctx;
        this.taskRepo = ctx.getBean(ScheduledTaskRepo.class);
    }

    class ExecutorThread extends Thread {
        @Override
        public void run() {
            SecurityHolder.setProfile(Profile.SYSTEM);

            int executionCount = 0;

            while (isRunning() && !isInterrupted()) {

                try {

                    List<ScheduledTask> tasks = taskRepo.findTop10ByScheduleStatusAndSchedulePhaseAndNextScheduleTimeLessThanEqual(
                            ScheduleStatus.active,
                            SchedulePhase.recurring,
                            TimeUtils.currentUtcTime()
                    );

                    for (ScheduledTask task : tasks) {

                        try {
                            ScheduledTaskHandler taskHandler = (ScheduledTaskHandler) appCtx.getBean(
                                    Class.forName(task.getHandler())
                            );

                            ScheduledTaskOutput output = taskHandler.execute(task);
                            task.moveToNextState(ScheduleStatus.active, Optional.of(output));

                        } catch (ClassNotFoundException e) {
                            scheduleLogger.error("Invalid or missing handler [{}], task will be suspended", task.getHandler(), e);
                            task.moveToNextState(ScheduleStatus.suspended, Optional.empty());
                        }

                        taskRepo.save(task);

                        executionCount = executionCount + 1;

                        doSleep(250);
                        if (isInterrupted()) {
                            break;
                        }
                    }

                } catch (Exception e) {
                    executionCount = 0;
                    scheduleLogger.error("Error occurred while executing task ", e);
                }

                if (executionCount == 0) {
                    doSleep(1000);
                }

                executionCount = 0;
            }

        }

        private void doSleep(long timeout) {
            try {
                Thread.sleep(timeout);
            } catch (InterruptedException e) {
                logger.info("Interrupted while waiting after task  execution, probably system shutting down");
                interrupt();
            }
        }
    }

    @PostConstruct
    public synchronized void start() {
        if (!isRunning()) {
            logger.debug("starting ...");
            running = true;
            Thread thread = new ExecutorThread();
            thread.setName("scheduled-task-executor" + threadCounter.incrementAndGet());
            thread.start();
        }
    }

    public synchronized boolean isRunning() {
        return running;
    }

    @PreDestroy
    public synchronized void stop() {
        if (isRunning()) {
            logger.debug("scheduled-task-executor stopping ...");
            running = false;
        }
    }
}
