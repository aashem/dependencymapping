# Generated by Django 2.0.3 on 2018-07-10 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0002_auto_20180709_1152'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='map',
            field=models.ManyToManyField(blank=True, related_name='mapped_resource', to='application.DependencyMap'),
        ),
        migrations.AlterField(
            model_name='dependencymap',
            name='resources',
            field=models.ManyToManyField(related_name='resources', to='application.Resource'),
        ),
        migrations.AlterField(
            model_name='dependencymap',
            name='tags',
            field=models.ManyToManyField(related_name='tags', to='application.Tag'),
        ),
    ]