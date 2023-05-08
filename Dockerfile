FROM amazonlinux:2017.09
MAINTAINER DL Garage

LABEL description="Docker file for Order Management Web Service."

RUN yum update -y
RUN yum groupinstall -y "Development Tools"

####Install node####
RUN curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
RUN yum -y install nodejs
####################

RUN mkdir -p /logs

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
ADD . /usr/src/

RUN npm install .

EXPOSE 8000

CMD ["npm", "start"]
