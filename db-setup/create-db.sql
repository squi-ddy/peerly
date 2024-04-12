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
    on update cascade on delete cascade,
    unique (`tutor-sid`, `day-of-week`, `start-time`, `end-time`)
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
    `tutor-sid` char(8),
    foreign key (`tutor-sid`) references student(`student-id`)
    on update cascade on delete cascade
);

create table notificationInterests (
    `notification-id` int unsigned,
    `interest-id` int unsigned,
    primary key (`notification-id`, `interest-id`),
    foreign key (`notification-id`) references notification(`notification-id`)
    on update cascade on delete cascade,
    foreign key (`interest-id`) references interest(`interest-id`)
    on update cascade on delete cascade
);

create table canTeach (
    `tutor-sid` char(8),
    `subject-code` char(2),
    `subject-gpa` decimal(2,1) not null,
    year tinyint unsigned not null,
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

create function timeslots_overlap(
    ts1_start time,
    ts1_end time,
    ts2_start time,
    ts2_end time
) returns boolean deterministic
return ts1_start < ts2_end and ts1_end > ts2_start//

-- find_timeslots() uses these temporary table templates that is recreated every time
create table timeslotsInTemplate (
    `day-of-week` tinyint,
    `start-time` time,
    `end-time` time
)//

create table interestedSubjectsTemplate (
    `subject-code` char(2)
)//

create procedure find_timeslots()
begin
    select
        ct.`tutor-sid`, 
        s.username, 
        (
            select json_arrayagg(tmp.subj)
            from (
                select json_object(
                    'subject-code', sub.`subject-code`, 
                    'name', sub.name
                ) subj
                from subject sub
                where sub.`subject-code` in (
                    select `subject-code` 
                    from canTeach 
                    where `tutor-sid` = ct.`tutor-sid`
                )
                and sub.`subject-code` in (
                    select `subject-code` from interestedSubjects
                )
            ) tmp
        ) `can-teach-subjects`, 
        (
            select json_arrayagg(tmp.tslot)
            from (
                select json_object(
                    'day-of-week', ts.`day-of-week`, 
                    'start-time', greatest(ts.`start-time`, tsIn.`start-time`), 
                    'end-time', least(ts.`end-time`, tsIn.`end-time`)
                ) tslot
                from timeslotsIn tsIn
                join emptyTimeslot ts on 
                    ts.`day-of-week` = tsIn.`day-of-week` 
                    and timeslots_overlap(
                        ts.`start-time`, ts.`end-time`, 
                        tsIn.`start-time`, tsIn.`end-time`
                    )
                    and ts.`tutor-sid` = ct.`tutor-sid`
            ) tmp
        ) timeslots
        from canTeach ct
        join student s on ct.`tutor-sid` = s.`student-id`
        group by ct.`tutor-sid`
        having 
            timeslots is not null 
            and `can-teach-subjects` is not null;
end //

create procedure find_proposals_at_time(
    in tutor_id char(8), 
    in day_of_week tinyint, 
    in start_time time, 
    in end_time time,
    in is_not_student char(8)
)
begin
    select 
        t.`tutelage-id`, t.`tutor-sid`, t.`learner-sid`, s.name `learner-name`,
        ts.`day-of-week`, ts.`start-time`, ts.`end-time`, sub.name `subject-name`
    from pendingTutelage t
    join pendingTimes m on t.`tutelage-id` = m.`tutelage-id`
    join emptyTimeslot ts on m.`timeslot-id` = ts.`timeslot-id`
    and ts.`day-of-week` = day_of_week
    and ts.`start-time` <= end_time
    and ts.`end-time` >= start_time
    join student s on t.`learner-sid` = s.`student-id`
    join subject sub on m.`subject-code` = sub.`subject-code`
    where t.`tutor-sid` = tutor_id
    and (
        is_not_student is null 
        or t.`learner-sid` != is_not_student
    );
end //

delimiter ;

create event sched_update_student_years
on schedule every 1 year starts makedate(year(now()) + 1, 1)
do
call update_student_years();
