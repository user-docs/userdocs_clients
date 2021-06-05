FROM alpine
RUN apk add chromium
RUN wget https://github.com/johns10/userdocs/releases/download/0.0.2/userdocs-cicd-alpine
ADD .env .
RUN ls	
RUN chmod +x userdocs-cicd-alpine
