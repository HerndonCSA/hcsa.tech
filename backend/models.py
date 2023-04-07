from tortoise import Model, fields

"""
ROLES 
    - Member
    - Officer
    - Vice President
    - President
"""


class Users(Model):
    email = fields.CharField(max_length=255, unique=True, pk=True)
    personal_email = fields.CharField(max_length=255, unique=True, null=True)
    profile_picture = fields.CharField(max_length=255, default="google")
    first_name = fields.CharField(max_length=255)
    last_name = fields.CharField(max_length=255)

    discord_id = fields.CharField(max_length=255, unique=True, null=True)
    github_username = fields.CharField(max_length=255, unique=True, null=True)

    role = fields.CharField(max_length=255, default="member", null=True)

    about = fields.TextField(null=True)
    # url defaults to the user's ID
    url = fields.CharField(max_length=255, null=True, unique=True)

    date_joined = fields.DatetimeField(auto_now_add=True)

    id = property(lambda self: self.email.split('@')[0])
    name = property(lambda self: f"{self.first_name} {self.last_name}")

    def __str__(self):
        return f"{self.name} ({self.id})"
