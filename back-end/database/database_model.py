from typing import Optional
import datetime
import uuid

from sqlalchemy import Column, DateTime, PrimaryKeyConstraint, Text, Uuid, text
from sqlmodel import Field, SQLModel

class Users(SQLModel, table=True):
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        {'schema': 'calendar_synchronizer'}
    )

    id: uuid.UUID = Field(sa_column=Column('id', Uuid, primary_key=True, server_default=text('gen_random_uuid()')))
    created_at: datetime.datetime = Field(sa_column=Column('created_at', DateTime(True), nullable=False, server_default=text('now()')))
    password: str = Field(sa_column=Column('password', Text, nullable=False, server_default=text("'password'::text")))
    username: Optional[str] = Field(default=None, sa_column=Column('username', Text))
