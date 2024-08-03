FROM qcobjects/qcobjects:latest

###
#  QCObjects Framework
#  ________________
#
#  Author: Jean Machuca <correojean@gmail.com>
#
#  Cross Browser Javascript Framework for MVC Patterns
#  QuickCorp/QCObjects is licensed under the
#  GNU Lesser General Public License v3.0
#  [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
#
#  Permissions of this copyleft license are conditioned on making available
#  complete source code of licensed works and modifications under the same
#  license or the GNU GPLv3. Copyright and license notices must be preserved.
#  Contributors provide an express grant of patent rights. However, a larger
#  work using the licensed work through interfaces provided by the licensed
#  work may be distributed under different terms and without source code for
#  the larger work.
#
#  Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
#
#  Everyone is permitted to copy and distribute verbatim copies of this
#  license document, but changing it is not allowed.
###
USER root

ENV XDG_RUNTIME_DIR $(id -u)
ENV container docker
ENV LC_ALL C
ENV DEBIAN_FRONTEND noninteractive

LABEL MAINTAINER "Jean Machuca <jean@qcobjects.com>"
LABEL Author "Jean Machuca <jean@qcobjects.com>"
LABEL org.opencontainers.image.authors="Jean Machuca <jean@qcobjects.com>"
ENV container docker

RUN npm i -g qcobjects qcobjects-sdk qcobjects-cli

#Configure the internal user permissions
RUN mkdir -p /home/qcobjects/app && chown -R qcobjects:qcobjects /home/qcobjects/app

#Setting the work directory
WORKDIR /home/qcobjects/app
ENV DOCUMENT_ROOT /home/qcobjects/app/
ENV DATA_PATH $DOCUMENT_ROOT/data/
COPY package*.json ./

#Run the initial install init scripts for jasmine and cache verify
#RUN jasmine init
RUN npm cache verify
RUN npm i


# Bundle app source
COPY --chown=qcobjects:qcobjects . .

RUN apk add --no-cache openssl

USER qcobjects
EXPOSE 8080:8080
EXPOSE 8443:8443
CMD [ "npm", "start" ]
