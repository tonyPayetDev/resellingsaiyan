import os
from setuptools import setup, find_packages
from runner.version import get_version

def read_file(filename):
    """Read a file into a string"""
    path = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(path, filename)
    try:
        return open(filepath).read()
    except IOError:
        return ''

try:
    REQUIREMENTS = read_file('requirements.txt').splitlines()
except:
    REQUIREMENTS = [
        'Django==1.6.10',
        'celery==3.1.17,'
    ]


setup(
    name='nerim-runner',
    version=get_version(),
    description='Project Facturation Telco',
    author="Philipe 'paHpa' Vivien",
    author_email='philippe.vivien@nerim.com',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False, 
    install_requires=REQUIREMENTS,
)
