from django.db import models

class Media(models.Model):
    name = models.CharField(max_length=400)
    file = models.FileField(upload_to='media/')

    @property
    def url(self):
        return self.file.url