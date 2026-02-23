from typing import Optional
import datetime
import uuid

from sqlalchemy import BigInteger, Column, Date, DateTime, Enum, ForeignKeyConstraint, PrimaryKeyConstraint, Text, Time, Uuid, text
from sqlmodel import Field, Relationship, SQLModel

class Users(SQLModel, table=True):
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        {'schema': 'calendar_synchronizer'}
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime(True), nullable=False, server_default=text('now()')))
    password: str = Field(sa_column=Column('password', Text, nullable=False, server_default=text("'password'::text")))
    username: Optional[str] = Field(default=None, sa_column=Column('username', Text))

    schedule_recurrences: list['ScheduleRecurrences'] = Relationship(back_populates='users')
    schedules: list['Schedules'] = Relationship(back_populates='users')


class ScheduleRecurrences(SQLModel, table=True):
    __tablename__ = 'schedule_recurrences'
    __table_args__ = (
        ForeignKeyConstraint(['created_by'], ['calendar_synchronizer.users.id'], ondelete='CASCADE', onupdate='CASCADE', name='schedule_recurrences_created_by_fkey'),
        PrimaryKeyConstraint('id', name='schedule_recurrences_pkey'),
        {'schema': 'calendar_synchronizer'}
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime(True), nullable=False, server_default=text('now()')))
    recurrence_interval: int = Field(sa_column=Column('recurrence_interval', BigInteger, nullable=False, server_default=text("'1'::bigint")))
    recurrence_period: str = Field(sa_column=Column('recurrence_period', Enum('DAY', 'WEEK', 'MONTH', 'YEAR', name='recurrence_period', schema='calendar_synchronizer'), nullable=False, server_default=text("'WEEK'::calendar_synchronizer.recurrence_period")))
    created_by: uuid.UUID = Field(sa_column=Column('created_by', Uuid, nullable=False))

    users: Optional['Users'] = Relationship(back_populates='schedule_recurrences')
    schedules: list['Schedules'] = Relationship(back_populates='schedule_recurrence')


class Schedules(SQLModel, table=True):
    __table_args__ = (
        ForeignKeyConstraint(['created_by'], ['calendar_synchronizer.users.id'], ondelete='CASCADE', onupdate='CASCADE', name='schedules_created_by_fkey'),
        ForeignKeyConstraint(['schedule_recurrence_id'], ['calendar_synchronizer.schedule_recurrences.id'], ondelete='CASCADE', onupdate='CASCADE', name='schedules_schedule_recurrence_id_fkey'),
        PrimaryKeyConstraint('id', name='schedules_pkey'),
        {'schema': 'calendar_synchronizer'}
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    event_date: datetime.date = Field(sa_column=Column('event_date', Date, nullable=False))
    start_time: datetime.time = Field(sa_column=Column('start_time', Time(True), nullable=False, server_default=text("'00:00:00+07'::time with time zone")))
    end_time: datetime.time = Field(sa_column=Column('end_time', Time(True), nullable=False, server_default=text("'23:59:59+07'::time with time zone")))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime, nullable=False, server_default=text('now()')))
    created_by: uuid.UUID = Field(sa_column=Column('created_by', Uuid, nullable=False))
    event: Optional[str] = Field(default=None, sa_column=Column('event', Text, server_default=text("''::text")))
    schedule_recurrence_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column('schedule_recurrence_id', Uuid))

    users: Optional['Users'] = Relationship(back_populates='schedules')
    schedule_recurrence: Optional['ScheduleRecurrences'] = Relationship(back_populates='schedules')
