create table student (
    `student-id` char(8) primary key,
    uuid char(36) not null unique key,
    password varchar(255) not null,
    username varchar(255) not null,
    class decimal(5,0) unsigned not null, -- 0 to 99999
    email varchar(255) not null,
    `year-offset` tinyint unsigned default 0 not null,
    year int unsigned default 0 not null,
    `is-learner` boolean not null,
    `is-tutor` boolean not null
);

create table review (
    rating tinyint not null,
    `review-text` varchar(10000) not null,
    `time-sent` datetime not null,
    `tutor-sid` char(8) not null,
    `learner-sid` char(8) not null,
    primary key (`tutor-sid`, `learner-sid`),
    foreign key (`tutor-sid`) references student(`student-id`) 
    on update cascade on delete cascade,
    foreign key (`learner-sid`) references student(`student-id`) 
    on update cascade on delete cascade
);

create table subject (
    `subject-code` char(2) primary key,
    name varchar(30) not null
);

create table interest (
    `interest-id` int unsigned auto_increment primary key,
    `learner-sid` char(8) not null,
    `subject-code` char(2) not null,
    unique (`learner-sid`, `subject-code`),
    foreign key (`learner-sid`) references student(`student-id`)
    on update cascade on delete cascade,
    foreign key (`subject-code`) references subject(`subject-code`)
    on update cascade on delete cascade
);

create table filledTutelage (
    `tutelage-id` int unsigned auto_increment primary key,
    `tutor-sid` char(8) not null,
    `learner-sid` char(8) not null,
    `what-to-learn` varchar(10000) not null,
    unique (`tutor-sid`, `learner-sid`),
    foreign key (`tutor-sid`) references student(`student-id`)
    on update cascade on delete cascade,
    foreign key (`learner-sid`) references student(`student-id`)
    on update cascade on delete cascade
);

create table pendingTutelage (
    `tutelage-id` int unsigned auto_increment primary key,
    `tutor-sid` char(8) not null,
    `learner-sid` char(8) not null,
    `what-to-learn` varchar(10000) not null,
    unique (`tutor-sid`, `learner-sid`),
    foreign key (`tutor-sid`) references student(`student-id`)
    on update cascade on delete cascade,
    foreign key (`learner-sid`) references student(`student-id`)
    on update cascade on delete cascade
);

create table filledTimeslot (
    `timeslot-id` int unsigned auto_increment primary key,
    `tutelage-id` int unsigned not null,
    `subject-code` char(2) not null,
    `day-of-week` tinyint not null,
    `start-time` time not null,
    `end-time` time not null,
    foreign key (`tutelage-id`) references filledTutelage(`tutelage-id`)
    on update cascade on delete cascade,
    foreign key (`subject-code`) references subject(`subject-code`)
    on update cascade on delete cascade
);

create table emptyTimeslot (
    `timeslot-id` int unsigned auto_increment primary key,
    `tutor-sid` char(8) not null,
    `day-of-week` tinyint not null,
    `start-time` time not null,
    `end-time` time not null,
    foreign key (`tutor-sid`) references student(`student-id`)
    on update cascade on delete cascade
);

create table pendingTimes (
    `tutelage-id` int unsigned,
    `timeslot-id` int unsigned,
    `subject-code` char(2) not null,
    primary key (`tutelage-id`, `timeslot-id`),
    foreign key (`tutelage-id`) references pendingTutelage(`tutelage-id`)
    on update cascade on delete cascade,
    foreign key (`timeslot-id`) references emptyTimeslot(`timeslot-id`)
    on update cascade on delete cascade,
    foreign key (`subject-code`) references subject(`subject-code`)
    on update cascade on delete cascade
);

create table message (
    `message-id` int unsigned auto_increment primary key,
    `tutelage-id` int unsigned,
    sender boolean not null,
    `time-sent` datetime not null,
    `message-text` varchar(1000) not null,
    foreign key (`tutelage-id`) references filledTutelage(`tutelage-id`)
    on update cascade on delete cascade
);

create table messageAttachment (
    `message-id` int unsigned,
    attachment mediumblob, -- 16MB
    primary key (`message-id`, attachment(255)),
    foreign key (`message-id`) references message(`message-id`)
    on update cascade on delete cascade
);

create table notification (
    `notification-id` int unsigned auto_increment primary key,
    message varchar(1000) not null,
    `time-sent` datetime not null,
    `interest-id` int unsigned not null,
    foreign key (`interest-id`) references interest(`interest-id`)
    on update cascade on delete cascade
);

create table canTeach (
    `tutor-sid` char(8),
    `subject-code` char(2),
    `subject-gpa` decimal(2,1) not null,
    year int unsigned not null,
    primary key (`tutor-sid`, `subject-code`),
    foreign key (`tutor-sid`) references student(`student-id`)
    on update cascade on delete cascade,
    foreign key (`subject-code`) references subject(`subject-code`)
    on update cascade on delete cascade
);

create table question (
    `question-id` int unsigned auto_increment primary key,
    title varchar(100) not null,
    description varchar(10000) not null,
    `time-posted` datetime not null,
    `learner-sid` char(8) not null,
    foreign key (`learner-sid`) references student(`student-id`)
    on update cascade on delete cascade
);

create table questionAttachment (
    `question-id` int unsigned,
    attachment mediumblob, -- 16MB
    primary key (`question-id`, attachment(255)),
    foreign key (`question-id`) references question(`question-id`)
    on update cascade on delete cascade
);

create table answer (
    `answer-id` int unsigned auto_increment primary key,
    `question-id` int unsigned,
    `time-sent` datetime not null,
    `answer-text` varchar(10000) not null,
    `marked-correct` boolean not null,
    `tutor-sid` char(8) not null,
    foreign key (`question-id`) references question(`question-id`)
    on update cascade on delete cascade,
    foreign key (`tutor-sid`) references student(`student-id`)
    on update cascade on delete cascade
);

create table answerAttachment (
    `answer-id` int unsigned,
    attachment mediumblob, -- 16MB
    primary key (`answer-id`, attachment(255)),
    foreign key (`answer-id`) references answer(`answer-id`)
    on update cascade on delete cascade
);

create table hasQuestion (
    `subject-code` char(2),
    `question-id` int unsigned,
    primary key (`subject-code`, `question-id`),
    foreign key (`subject-code`) references subject(`subject-code`)
    on update cascade on delete cascade,
    foreign key (`question-id`) references question(`question-id`)
    on update cascade on delete cascade
);

create function compute_year(
    current_year int unsigned,
    student_id char(8),
    year_offset tinyint unsigned
)
returns tinyint unsigned deterministic
return (current_year % 100) - substr(student_id, 2, 2) 
+ substr(student_id, 4, 1) - year_offset;

create function compute_year_offset(
    current_year int unsigned,
    student_id char(8),
    year tinyint unsigned
)
returns tinyint unsigned deterministic
return (current_year % 100) - substr(student_id, 2, 2)
+ substr(student_id, 4, 1) - year;

insert into subject(`subject-code`, name) values
('PC', 'Physics'),
('CS', 'Computer Science'),
('CM', 'Chemistry'),
('BL', 'Biology'),
('MA', 'Mathematics'),
('EL', 'English'),
('EC', 'Economics'),
('GE', 'Geography'),
('HE', 'History'),
('CH', 'Higher Chinese');

delimiter //
create procedure update_student_years()
begin
    update student
    set year = compute_year(year(now()), `student-id`, `year-offset`);
end //

create trigger set_year_trigger
before insert on student
for each row
begin
    set new.year = compute_year(year(now()), new.`student-id`, new.`year-offset`);
end //

create trigger set_year_trigger_update
before update on student
for each row
begin
    set new.year = compute_year(year(now()), new.`student-id`, new.`year-offset`);
end //

delimiter ;

create event sched_update_student_years
on schedule every 1 year starts makedate(year(now()) + 1, 1)
do
call update_student_years();
